import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ConciergeStage = 'opening' | 'profile' | 'plan' | 'fulfillment';

interface ConciergeRequest {
  message?: string;
  stage?: ConciergeStage;
  scenario?: {
    airportCode?: string;
    arrivalFlightNo?: string;
    departureFlightNo?: string;
    arrivalTimeStr?: string;
    departureTimeStr?: string;
    layoverHours?: number;
    totalTransitHours?: number;
  };
}

const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const DEFAULT_MODEL = 'qwen3.7-max';

const fallbackReplies: Record<ConciergeStage, string> = {
  opening:
    '可以。我会先看中转时长和离境时间，再把行李、贵宾厅、路线和误机保障合成一个安全方案。',
  profile:
    '你这段是新加坡白天 10 小时中转。扣掉入境、返程和安检缓冲后，建议只使用 8 小时，保留足够登机余量。',
  plan:
    '推荐微游包：¥780 起，包含行李全托管、贵宾厅 2 小时、4 小时城市经典路线、专车接送和误机保障。',
  fulfillment:
    '下单后会生成电子凭证和 RFID 行李卡。系统按 16:50 返抵机场倒推提醒，超时即触发快速返程、VIP 安检和客服兜底。',
};

function resolveStage(stage: unknown): ConciergeStage {
  if (stage === 'profile' || stage === 'plan' || stage === 'fulfillment') {
    return stage;
  }
  return 'opening';
}

function buildPrompt(body: ConciergeRequest, stage: ConciergeStage) {
  const scenario = body.scenario ?? {};
  return [
    {
      role: 'system',
      content: [
        '你是 Stopover 中转游的 AI 礼宾销售助手。',
        '产品目标：为 6-48 小时中转旅客提供机场生态一站式服务包，把休息室单点消费升级为套餐化消费。',
        '必须用简体中文回答，非技术、短句、像现场礼宾，不要使用 Markdown。',
        '核心套餐：轻享包 6-8h ¥260-320，休息室3h+行李寄存+快速安检；微游包 10-18h ¥680-880，休息室2h+行李全托管+城市4h游+接送+误机保障；过夜包 12-36h ¥780-1200，休息室1h+行李托管+酒店/钟点房+接送。',
        '必须强调确定性：固定路线、RFID 行李托管、60 分钟前回到安检口、误机保障。',
        '当前 demo 推荐首站新加坡樟宜，航班 SQ833 08:30 到达，SQ322 18:30 离境，总中转 10 小时，服务预留 8 小时。',
        '如果用户问泛泛问题，仍然引导回中转时长、行李、城市微游、误机保障四个决策点。',
      ].join('\n'),
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          stage,
          user_message: body.message || '我在新加坡中转 10 小时，想轻装出机场看看城市',
          scenario: {
            airportCode: scenario.airportCode || 'SIN',
            arrivalFlightNo: scenario.arrivalFlightNo || 'SQ833',
            departureFlightNo: scenario.departureFlightNo || 'SQ322',
            arrivalTimeStr: scenario.arrivalTimeStr || '2026-07-01 08:30',
            departureTimeStr: scenario.departureTimeStr || '2026-07-01 18:30',
            layoverHours: scenario.layoverHours ?? 8,
            totalTransitHours: scenario.totalTransitHours ?? 10,
          },
          response_contract:
            '只输出 1-3 句自然中文，最多 90 字。不要列长清单。stage=plan 时要给出套餐名和价格；stage=fulfillment 时要说 RFID 和误机保障。',
        },
        null,
        2,
      ),
    },
  ];
}

async function callDashScope(body: ConciergeRequest, stage: ConciergeStage) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.COMPATIBLE_API_KEY;
  if (!apiKey) {
    return { reply: fallbackReplies[stage], source: 'fallback:no-key' };
  }

  const baseUrl = process.env.COMPATIBLE_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.DEFAULT_MODEL || DEFAULT_MODEL;
  const temperature = Number(process.env.MODEL_TEMPERATURE ?? 0.2);
  const timeoutMs = Math.max(1000, Number(process.env.LLM_CALL_TIMEOUT ?? 10) * 1000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: buildPrompt(body, stage),
        temperature,
        max_tokens: 220,
        stream: false,
        enable_thinking: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text();
      console.warn('DashScope concierge call failed', response.status, detail.slice(0, 240));
      return { reply: fallbackReplies[stage], source: `fallback:http-${response.status}` };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return {
      reply: reply || fallbackReplies[stage],
      source: reply ? `dashscope:${model}` : 'fallback:empty',
    };
  } catch (error) {
    console.warn('DashScope concierge call errored', error);
    return { reply: fallbackReplies[stage], source: 'fallback:error' };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ConciergeRequest;
  const stage = resolveStage(body.stage);
  const result = await callDashScope(body, stage);

  return NextResponse.json({
    stage,
    ...result,
    recommendations: {
      packageSku: stage === 'opening' || stage === 'profile' ? null : 'micro',
      packageName: stage === 'opening' || stage === 'profile' ? null : '微游包',
      airportCode: body.scenario?.airportCode || 'SIN',
    },
  });
}
