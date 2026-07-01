# 中转礼宾助手：多意图理解 + 通识知识 Q&A 设计

## 背景

`/api/concierge`（[route.ts](../../src/app/api/concierge/route.ts)）已经接入 qwen3.7-max（DashScope OpenAI 兼容模式），并在请求体中设置了 `enable_thinking: false`。但当前系统提示词把回答范围硬性限定在"中转时长、行李托管、套餐权益、城市路线、增值项、履约保障"，导致像"新加坡有啥好玩的"这类通识类提问只会得到产品推销话术，而不是真正的城市/机场知识回答（见产品截图）。

`inferIntent()`（[conciergeEngine.ts](../../src/lib/conciergeEngine.ts)）是纯正则的意图识别，覆盖的同义词较窄，一些常见口语化表达（如"存包""用车""到哪一步了"）识别不到对应意图，会跌入 `general` 兜底。

## 目标

1. 验证并确保 qwen3.7-max 的 thinking 模式确实被关闭（不泄漏 reasoning 内容、不报错）。
2. 新增 `knowledge` 意图，让礼宾助手可以针对**当前中转机场/城市**回答通识类问题（景点、美食、购物、天气、交通、货币、时差、免税、插座等），并衔接回产品。
3. 扩充现有意图的同义词覆盖，提升多种口语化表达的识别率。
4. 明确拒答无关话题（编程、新闻、政治、私人建议等）的护栏。
5. 无 API Key 时的本地兜底回复也要覆盖新意图，不留死角。

## 非目标

- 不用 LLM 替代确定性的套餐/价格推荐逻辑（PRD 合规要求价格和边界必须走规则引擎）。
- 不引入两段式（先分类再回答）架构，避免额外的延迟和成本。
- 不扩展到签证/入境代办等 PRD 明确排除的服务。

## 设计

### 1. 意图分类：`ConciergeIntent` 新增 `'knowledge'`

在 [conciergeEngine.ts](../../src/lib/conciergeEngine.ts) 的 `ConciergeIntent` 联合类型中新增 `'knowledge'`。

`inferIntent()` 的 if-chain 保持"交易类意图优先"的顺序：

```
checkout > fulfillment > baggage > private > tour > addons > package > profile > knowledge > general
```

`knowledge` 正则匹配信息性提问关键词，例如：
`好玩|景点推荐|美食|小吃|购物|免税|天气|气温|时差|货币|汇率|插座|wifi|地铁|出租车|怎么去市区|有什么(玩|吃|逛)|attractions|weather|currency|things to do|what to (do|see|eat)`

放在 `tour`/`addons`/`package`/`profile` 之后，保证"我要出机场玩微游包路线""加购接送"这类明确的交易意图仍然优先命中已有分支；只有真正的信息性提问才落入 `knowledge`，与彻底空泛/无关的输入（`general`）区分开。

同时扩充其他意图的同义词（在不改变匹配顺序的前提下追加关键词）：
- `baggage`：加入 `存包|寄放|寄存`
- `private`：加入 `用车|租车`
- `fulfillment`：加入 `到哪一步|进度查询|办到哪了`
- `checkout`：加入 `立即预订|马上下单|现在订`

### 2. System Prompt 改造（route.ts `buildMessages()`）

保留现有的"仅围绕产品六要素回答"规则，作为**默认**规则。新增一条条件规则：

> 当 `deterministic_plan.intent === "knowledge"` 时，允许基于你自身的通用知识，针对 `current_profile.airportCode` 对应的机场/城市回答通识类问题（景点、美食、购物、天气、交通、货币、时差、免税、插座等），2-4 句话，内容要具体、真实、不夸大；回答后自然衔接回产品（说明该内容是否被当前路线/套餐覆盖，或引导下一步）。

新增护栏规则：

> 如果问题与旅游、机场、城市、中转礼宾服务完全无关（如编程、新闻、政治、私人建议、闲聊等），礼貌说明你是"龙腾中转礼遇助手"，只能协助中转相关问题，并引导用户重新提问，不回答无关内容本身。

`response_rules` JSON 中追加一条，明确 `knowledge` 意图下允许通用知识回答，其余意图维持"不要编造 SKU/价格"的既有约束不变。

### 3. 本地兜底回复（`buildDeterministicReply`）

新增 `plan.intent === 'knowledge'` 分支（zh + en 两个语言分支都要加）：说明这类问题需要在线助手才能展开，同时仍然给出当前套餐摘要，避免离线 demo 卡死或无响应。

### 4. quickReplies

`knowledge` 意图下返回衔接型快捷回复，例如：
- zh: `['按套餐规划行程', '行李怎么办', '还有其他玩法推荐吗']`
- en: `['Plan it into a package', 'What about my baggage?', 'Any other recommendations?']`

（现有 quickReplies 是按 `intent === 'checkout' | 'baggage' | 'addons' | 默认` 的三/四分支写的，直接追加一个 `knowledge` 分支即可，不改变其他分支。）

### 5. Thinking 关闭验证

用 `/Users/kaisun/smartbundlex/.env.dev` 里的真实 Key 起本地 dev server，实际调用一次 `/api/concierge`，检查：
- HTTP 响应是否成功（模型名 `qwen3.7-max` 是否被 DashScope 接受）。
- `choices[0].message.content` 是否干净，没有 `<think>`/reasoning 内容混入。
- 响应头/`source` 字段确认走的是 `dashscope:qwen3.7-max` 而不是 fallback。

如发现 `enable_thinking` 未生效（比如 DashScope 要求嵌套在其他字段，或该字段被忽略），根据实际报错/行为调整请求体结构，而不是凭猜测修改。

### 6. 全应用代码评审（任务二）

在 1-5 落地后，对照 `docs/stopover-prd-v1.0.md`、`docs/stopover-demo-tech-scaffold.md`，评审：
- `src/app/(flow)/*`（checkout/journey/order/packages/search）
- `src/lib/state-machine/orderState.ts`、`src/lib/store/orderStore.ts`
- `conciergePersonas.ts` 中的角色模板是否仍与规则引擎输出一致

修复评审中发现的、与 PRD 口径不一致或明显的 bug，不做无关重构。

### 7. 测试与发布（任务三）

- 真实 API Key 下手动多轮测试：知识类问答（新加坡景点/天气等）、无关话题拒答、既有业务意图（套餐/行李/下单/履约）仍正常工作、thinking 未泄漏。
- `npm run lint`、`npm run build` 通过。
- 通过后创建 tag `v1.0.0`，提交并推送代码（含 tag）。

## 风险与权衡

- 正则关键词扩充是启发式的，无法覆盖所有口语表达，但与现有架构一致，改动风险低、可解释、可维护。
- 通用知识回答依赖模型自身知识，无法保证 100% 准确；通过限定"当前机场/城市 + 简短 2-4 句"降低幻觉暴露面，且不影响价格/规则相关内容（那部分仍来自 `deterministic_plan`）。
- `qwen3.7-max` 是否为 DashScope 上真实可用的模型名以及 `enable_thinking` 的确切生效方式，需要通过真实 API 调用实证，而非基于训练知识猜测（模型可能在 2026 年才发布）。
