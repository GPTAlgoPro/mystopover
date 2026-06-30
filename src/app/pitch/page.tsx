import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Luggage,
  MapPinned,
  MessageCircle,
  Plane,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const metrics = [
  { label: '休息室单点客单', before: '约 ¥200', after: '目标 ¥450+' },
  { label: '套餐渗透率', before: '待建立基线', after: '90 天 8%' },
  { label: '行李托管占比', before: 'N/A', after: '90 天 30%' },
  { label: '履约目标', before: '人工兜底', after: '零漏接 / 零误机事故' },
];

const flow = [
  { title: '一句话说需求', body: '我在新加坡中转 10 小时，想轻装出机场看看城市。', icon: MessageCircle },
  { title: 'AI 核算安全窗口', body: '识别航班、到离港时间、入境和安检缓冲，给出可用服务时长。', icon: Clock3 },
  { title: '推荐套餐和路线', body: '微游包：行李托管、贵宾厅、4 小时城市游、接送和误机保障。', icon: Route },
  { title: '进入履约追踪', body: 'RFID 行李卡、向导车辆、返程截止和异常兜底全部可视化。', icon: Radar },
];

const stack = [
  { title: 'AI 礼宾入口', body: 'Qwen3.7 Max 负责把自然语言转成可执行的中转方案。' },
  { title: '业务状态机', body: '订单、行李、微游、酒店和误机保障按可解释状态流转。' },
  { title: 'Mock 枢纽数据', body: '首站新加坡樟宜，保留多哈、伊斯坦布尔、迪拜扩展位。' },
  { title: '降级可演示', body: '没有模型 key 或网络失败时，自动使用确定性礼宾回复。' },
];

export default function PitchPage() {
  return (
    <div className="bg-slate-950 text-white">
      <section className="relative min-h-[calc(100vh-74px)] overflow-hidden px-5 py-16 sm:px-8 lg:px-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-28"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1800)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.98),rgba(15,23,42,0.76),rgba(15,23,42,0.42))]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100 backdrop-blur-xl">
              <Plane size={15} />
              Hackathon Demo
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-normal sm:text-7xl">
              Stopover 中转游
              <span className="block text-blue-200">机场等待的第二增长曲线</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-200 sm:text-xl">
              用 AI 礼宾把“我有 10 小时中转”翻译成可售卖、可履约、可保障的机场生态服务包，让旅客放心走出机场，也让休息室用户完成套餐升级。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
              >
                打开手机 Demo
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                查看传统流程
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                    Demo Case
                  </div>
                  <div className="mt-2 text-2xl font-black">新加坡 10 小时中转</div>
                </div>
                <div className="rounded-2xl bg-blue-600 px-4 py-3 text-right text-white">
                  <div className="text-[10px] font-bold opacity-80">推荐</div>
                  <div className="text-lg font-black">微游包</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ['08:30', 'SQ833 抵达'],
                  ['09:20', '向导出发'],
                  ['13:00', '城市路线结束'],
                  ['16:50', '返抵安检口'],
                ].map(([time, label]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xl font-black text-slate-950">{time}</div>
                    <div className="mt-1 text-xs font-bold text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-7 text-emerald-800">
                返程缓冲、VIP 安检、误机改签和行李保险是这个产品的信任底座。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-slate-950 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-black tracking-normal sm:text-5xl">旅客买的不是旅游，是确定性</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
            {[
              { title: '时间焦虑', body: '6-48 小时不知道怎么安排，纯等候体验差。', icon: Clock3 },
              { title: '行李焦虑', body: '拖箱出机场麻烦，想消费也走不远。', icon: Luggage },
              { title: '决策焦虑', body: '陌生城市缺攻略，路线和语言都有风险。', icon: MapPinned },
              { title: '误机焦虑', body: '一旦堵车误机，旅客要独自承担后果。', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                  <Icon className="text-blue-600" size={26} />
                  <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbff] px-5 py-16 text-slate-950 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-4xl font-black tracking-normal sm:text-5xl">产品解法：一个 AI 入口，三层履约能力</h2>
            <p className="mt-6 text-base font-semibold leading-8 text-slate-600">
              AI 让用户不用学习菜单，状态机让运营不靠口头承诺。评委看到的是酷炫对话卡片，业务真正卖的是可控的机场服务编排。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {flow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.5rem] border border-white bg-white p-6 shadow-lg shadow-blue-950/5">
                  <Icon className="text-blue-600" size={25} />
                  <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-4xl font-black tracking-normal sm:text-5xl">技术讲法：非技术也能听懂</h2>
              <p className="mt-6 text-base font-semibold leading-8 text-slate-300">
                大模型负责“理解和解释”，业务数据负责“价格和边界”，状态机负责“每一步是否真的能履约”。这三层分开，demo 酷，但不是幻觉。
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {stack.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <Sparkles className="text-blue-200" size={22} />
                  <h3 className="mt-5 text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-slate-950 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-normal sm:text-5xl">商业结果：从等待时间里长出新收入</h2>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600">
                首个 PoC 不追求全机场覆盖，只验证高价值中转用户愿不愿意为省心多付 ¥200-400。
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <BadgeCheck size={18} />
              90 天验证窗口
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-slate-200">
            {metrics.map((item) => (
              <div key={item.label} className="grid grid-cols-1 border-b border-slate-200 last:border-b-0 md:grid-cols-[1fr_1fr_1fr]">
                <div className="bg-slate-50 p-5 text-sm font-black">{item.label}</div>
                <div className="p-5 text-sm font-semibold text-slate-500">{item.before}</div>
                <div className="flex items-center gap-2 p-5 text-sm font-black text-blue-700">
                  <CheckCircle2 size={18} />
                  {item.after}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ['轻享包', '6-8h', '休息室 + 行李寄存 + 快速安检'],
              ['微游包', '10-18h', '行李全托管 + 城市 4h 游 + 接送'],
              ['过夜包', '12-36h', '酒店/钟点房 + 行李托管 + 接送'],
            ].map(([name, hours, body]) => (
              <div key={name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-black text-blue-600">{hours}</div>
                <h3 className="mt-3 text-2xl font-black">{name}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#0b5fff,#0f172a)] px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">Closing</div>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
              我们不是卖一段观光，而是卖一段不会失控的中转时间。
            </h2>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
          >
            进入现场 Demo
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
