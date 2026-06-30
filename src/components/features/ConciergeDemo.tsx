'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Luggage,
  Map,
  MessageCircle,
  Plane,
  QrCode,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  UserRound,
} from 'lucide-react';
import { airports, packages, tourRoutes } from '@/lib/mockData';
import { useOrderStore } from '@/lib/store/orderStore';

type ChatStep = 'opening' | 'profile' | 'plan' | 'fulfillment';

const scenario = {
  airportCode: 'SIN' as const,
  arrivalFlightNo: 'SQ833',
  departureFlightNo: 'SQ322',
  arrivalTimeStr: '2026-07-01 08:30',
  departureTimeStr: '2026-07-01 18:30',
  layoverHours: 8,
  totalTransitHours: 10,
  userPrompt: '我在新加坡中转 10 小时，想轻装出机场看看城市',
};

const stepCopy: Record<ChatStep, { label: string; agent: string; user?: string }> = {
  opening: {
    label: '意图识别',
    user: scenario.userPrompt,
    agent:
      '可以。你有 10 小时白天中转，我会优先保证回机场时间，再把行李、贵宾厅和城市微游打包成一个可履约方案。',
  },
  profile: {
    label: '风险核算',
    agent:
      '已核算 SQ833 到达 08:30、SQ322 离境 18:30。扣除入境、返程和安检缓冲后，可安全使用 8 小时。',
  },
  plan: {
    label: '套餐推荐',
    agent:
      '推荐微游包：行李全托管，先交包，再由向导带你完成 4 小时经典路线，16:50 前回到安检口。',
  },
  fulfillment: {
    label: '履约托底',
    agent:
      '订单会生成 RFID 行李卡、向导车辆信息和误时保护规则。若返程超阈值，自动切换快速返程和 VIP 安检。',
  },
};

const journeyCheckpoints = [
  { time: '08:30', label: '落地 SIN T3', status: 'done' },
  { time: '08:50', label: '柜台交包 RFID', status: 'done' },
  { time: '09:20', label: '向导接驳出发', status: 'live' },
  { time: '13:00', label: '市区经典路线结束', status: 'next' },
  { time: '16:50', label: '回机场 + VIP 安检', status: 'safe' },
];

const proofPoints = [
  { value: '¥780', label: '套餐起价', icon: CircleDollarSign },
  { value: '4h', label: '城市微游', icon: Route },
  { value: '¥5000', label: '每件行李险', icon: ShieldCheck },
];

const serviceItems = [
  { label: '行李全托管', icon: Luggage },
  { label: '贵宾厅 2h', icon: BriefcaseBusiness },
  { label: '城市 4h 微游', icon: Map },
  { label: '误机保障', icon: ShieldCheck },
];

export default function ConciergeDemo() {
  const router = useRouter();
  const [step, setStep] = useState<ChatStep>('opening');
  const [aiReplies, setAiReplies] = useState<Partial<Record<ChatStep, string>>>({});
  const [aiSource, setAiSource] = useState('scripted');
  const [isAsking, setIsAsking] = useState(false);
  const [inputValue, setInputValue] = useState(scenario.userPrompt);
  const {
    setSearchParams,
    clearCustomizations,
    selectPackage,
    createOrder,
    currentOrder,
  } = useOrderStore();

  const airport = airports.find((item) => item.code === scenario.airportCode)!;
  const microPackage = packages.find((item) => item.sku === 'micro')!;
  const route = tourRoutes.find((item) => item.id === 'sin-classic-4h')!;

  const visibleSteps = useMemo(() => {
    const order: ChatStep[] = ['opening', 'profile', 'plan', 'fulfillment'];
    return order.slice(0, order.indexOf(step) + 1);
  }, [step]);

  const askConcierge = async (targetStep: ChatStep, message = inputValue) => {
    setStep(targetStep);
    setIsAsking(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: targetStep,
          message,
          scenario,
        }),
      });

      if (!response.ok) {
        throw new Error(`concierge api ${response.status}`);
      }

      const data = await response.json();
      if (typeof data.reply === 'string' && data.reply.trim()) {
        setAiReplies((current) => ({ ...current, [targetStep]: data.reply.trim() }));
      }
      setAiSource(typeof data.source === 'string' ? data.source : 'dashscope');
    } catch (error) {
      console.warn('Concierge API fallback', error);
      setAiReplies((current) => ({ ...current, [targetStep]: stepCopy[targetStep].agent }));
      setAiSource('fallback:client');
    } finally {
      setIsAsking(false);
    }
  };

  const advance = () => {
    if (step === 'opening') void askConcierge('profile');
    if (step === 'profile') void askConcierge('plan');
    if (step === 'plan') void askConcierge('fulfillment');
  };

  const createConciergeOrder = () => {
    clearCustomizations();
    setSearchParams(scenario);
    selectPackage('micro');
    const order = createOrder();
    router.push(`/order?id=${order.orderId}`);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(11,95,255,0.12),transparent_32%),linear-gradient(180deg,#f7fbff_0%,#eef5f7_52%,#ffffff_100%)] text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-74px)] w-full max-w-7xl grid-cols-1 items-start gap-8 px-0 py-0 sm:px-6 sm:py-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-8 lg:py-10">
        <div className="order-2 hidden space-y-7 lg:order-1 lg:block">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/72 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-xl">
              <Sparkles size={14} />
              <span>AI Stopover Concierge</span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-[2.6rem] font-black leading-[0.98] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
                把中转等待，变成一单可托付的城市体验
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Stopover 用 AI 礼宾把航班时间、行李托管、贵宾厅、城市微游和误机保障整合成一个对话式订单。评委在手机上跟着提示点三次，就能完成从推荐到履约追踪的完整 demo。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => void askConcierge('plan')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <MessageCircle size={18} />
                <span>直接看 AI 推荐</span>
              </button>
              <Link
                href="/pitch"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/78 px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                <TicketCheck size={18} />
                <span>打开展示 PPT</span>
              </Link>
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {proofPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/72 p-3 shadow-sm backdrop-blur-xl">
                  <Icon className="mb-3 text-blue-600" size={18} />
                  <div className="text-lg font-black text-slate-950">{item.value}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{item.label}</div>
                </div>
              );
            })}
          </div>

          <div className="hidden max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/64 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl md:block">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${airport.image})` }}
            />
            <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  Flagship PoC
                </div>
                <h2 className="mt-2 text-xl font-black text-slate-950">{airport.nameZh}</h2>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  首站选择中文友好、机场生态成熟、城市路线集中的新加坡樟宜，把 10 小时中转压缩成一个可控、可赔付、可核销的标准服务包。
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/25">
                SIN
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-none sm:max-w-[430px] lg:order-2">
          <div className="border-slate-950/10 bg-slate-950 shadow-[0_32px_80px_rgba(15,23,42,0.28)] sm:rounded-[2.35rem] sm:border sm:p-2">
            <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fcff_0%,#edf6fb_48%,#fdfefe_100%)] sm:rounded-[1.9rem]">
              <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_0%,rgba(11,95,255,0.28),transparent_58%)]" />

              <div className="relative flex min-h-[calc(100vh-65px)] flex-col sm:min-h-[780px]">
                <header className="flex items-center justify-between px-5 pb-3 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg">
                      S
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-950">Stopover</div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                        {isAsking ? 'Qwen Thinking' : aiSource.startsWith('dashscope') ? 'Qwen Live' : 'Concierge Online'}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/search"
                    className="rounded-full bg-white/82 px-3 py-2 text-[11px] font-extrabold text-blue-700 shadow-sm backdrop-blur-xl"
                  >
                    传统流程
                  </Link>
                </header>

                <main className="relative flex-1 space-y-4 px-4 pb-4">
                  <div className="rounded-[1.65rem] border border-white/80 bg-white/72 p-3 shadow-lg shadow-blue-950/5 backdrop-blur-2xl">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>{scenario.arrivalFlightNo}</span>
                      <Plane size={15} className="text-blue-600" />
                      <span>{scenario.departureFlightNo}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                      <div>
                        <div className="text-2xl font-black text-slate-950">08:30</div>
                        <div className="text-[10px] font-bold text-slate-400">抵达 SIN</div>
                      </div>
                      <div className="relative h-2 rounded-full bg-slate-200">
                        <div className="absolute inset-y-0 left-0 w-[74%] rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-950">18:30</div>
                        <div className="text-[10px] font-bold text-slate-400">离境 LHR</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {visibleSteps.map((item) => (
                      <div key={item} className="space-y-2">
                        {stepCopy[item].user && (
                          <div className="ml-auto flex max-w-[84%] items-start gap-2">
                            <div className="rounded-[1.35rem] rounded-tr-md bg-slate-950 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-lg">
                              {stepCopy[item].user}
                            </div>
                            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                              <UserRound size={14} />
                            </div>
                          </div>
                        )}

                        <div className="flex max-w-[91%] items-start gap-2">
                          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                            <Sparkles size={14} />
                          </div>
                          <div className="rounded-[1.35rem] rounded-tl-md border border-white/80 bg-white/78 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm backdrop-blur-2xl">
                            <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
                              {stepCopy[item].label}
                            </span>
                            {aiReplies[item] ?? stepCopy[item].agent}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(step === 'plan' || step === 'fulfillment') && (
                    <div className="rounded-[1.7rem] border border-white/80 bg-white/78 p-4 shadow-xl shadow-blue-950/10 backdrop-blur-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                            <BadgeCheck size={12} />
                            AI 最优推荐
                          </div>
                          <h2 className="mt-3 text-2xl font-black text-slate-950">{microPackage.name}</h2>
                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                            {route.name}，含专车、双语向导和误机保障。
                          </p>
                        </div>
                        <div className="rounded-2xl bg-blue-600 px-3 py-2 text-right text-white shadow-lg shadow-blue-600/25">
                          <div className="text-[10px] font-bold opacity-80">起价</div>
                          <div className="text-xl font-black">¥{microPackage.price}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {serviceItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-extrabold text-slate-700">
                              <Icon size={15} className="text-blue-600" />
                              <span>{item.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                            <ShieldCheck size={16} />
                            <span>60 分钟前回到安检口</span>
                          </div>
                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-emerald-700">
                            已校验
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] font-semibold leading-5 text-emerald-800/75">
                          返程截止 16:50。超阈值自动触发专车直返、VIP 安检和客服介入。
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={createConciergeOrder}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-xs font-black text-white shadow-lg transition hover:bg-slate-800"
                        >
                          <QrCode size={16} />
                          <span>生成凭证</span>
                        </button>
                        <Link
                          href={currentOrder ? `/journey?id=${currentOrder.orderId}` : '/journey'}
                          className="flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-3 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                        >
                          <CalendarClock size={16} />
                          <span>履约追踪</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {step === 'fulfillment' && (
                    <div className="rounded-[1.7rem] border border-white/80 bg-slate-950 p-4 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-black">
                          <Luggage size={17} className="text-orange-300" />
                          <span>RFID 行李托管</span>
                        </div>
                        <span className="rounded-full bg-orange-400/20 px-2 py-1 text-[10px] font-black text-orange-200">
                          RFID 88421976
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {journeyCheckpoints.map((item) => (
                          <div key={item.label} className="grid grid-cols-[44px_16px_1fr] items-center gap-2">
                            <span className="text-[11px] font-black text-slate-400">{item.time}</span>
                            <span
                              className={`h-3 w-3 rounded-full ${
                                item.status === 'done'
                                  ? 'bg-emerald-400'
                                  : item.status === 'live'
                                    ? 'bg-orange-300 shadow-[0_0_0_6px_rgba(251,146,60,0.16)]'
                                    : item.status === 'safe'
                                      ? 'bg-blue-300'
                                      : 'bg-slate-600'
                              }`}
                            />
                            <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </main>

                <footer className="relative border-t border-white/70 bg-white/74 p-4 backdrop-blur-2xl">
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                    {(['profile', 'plan', 'fulfillment'] as ChatStep[]).map((item) => (
                      <button
                        key={item}
                        onClick={() => void askConcierge(item)}
                        className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-extrabold transition ${
                          step === item
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {stepCopy[item].label}
                      </button>
                    ))}
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (step === 'fulfillment') {
                        createConciergeOrder();
                        return;
                      }
                      advance();
                    }}
                    className="flex w-full items-center gap-2 rounded-2xl bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition focus-within:ring-blue-200"
                  >
                    <input
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder="告诉礼宾你的中转时间和偏好"
                    />
                    <button
                      type="submit"
                      disabled={isAsking}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:bg-slate-300"
                      title={step === 'fulfillment' ? '生成电子凭证' : '继续规划'}
                    >
                      {step === 'fulfillment' ? <ArrowRight size={17} /> : <Send size={16} />}
                    </button>
                  </form>
                </footer>
              </div>
            </div>
          </div>

          <div className="mt-4 hidden grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500 sm:grid">
            <div className="rounded-full bg-white/80 px-2 py-2 shadow-sm">
              <Check className="mx-auto mb-1 text-emerald-600" size={13} />
              一键下单
            </div>
            <div className="rounded-full bg-white/80 px-2 py-2 shadow-sm">
              <Clock3 className="mx-auto mb-1 text-blue-600" size={13} />
              固定时段
            </div>
            <div className="rounded-full bg-white/80 px-2 py-2 shadow-sm">
              <ShieldCheck className="mx-auto mb-1 text-orange-500" size={13} />
              误机兜底
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              title: '从休息室单点到套餐升级',
              body: '把原本 ¥200 左右的休息室消费升级成 ¥450+ 的中转服务包，商业目标清晰。',
              icon: CircleDollarSign,
            },
            {
              title: 'AI 只是入口，履约才是护城河',
              body: '对话把传统按钮流程压缩成自然语言，背后仍是订单、行李、向导和误机保障状态机。',
              icon: Sparkles,
            },
            {
              title: '现场手机竖屏可演示',
              body: '首页即 demo，评委无需理解后台系统，也能走完“问询、推荐、确认、追踪”。',
              icon: ChevronRight,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <Icon className="text-blue-600" size={24} />
                <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
