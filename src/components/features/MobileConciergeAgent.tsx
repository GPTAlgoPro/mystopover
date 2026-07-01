'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot,
  ChevronDown,
  Clock3,
  ExternalLink,
  Luggage,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from 'lucide-react';
import {
  buildConciergePlan,
  buildDeterministicReply,
  defaultConciergeProfile,
  type ConciergeMessage,
  type ConciergePlan,
  type ConciergeProfile,
} from '@/lib/conciergeEngine';
import { useOrderStore } from '@/lib/store/orderStore';
import type { AddonSku } from '@/lib/types';
import { useAppPreferences } from './AppPreferenceProvider';

type ChatItem = ConciergeMessage & {
  id: string;
  source?: string;
};

const seedPromptZh = '我在新加坡中转 10 小时，有 1 件行李，想轻松看一下城市但不能误机。';
const seedResolved = buildConciergePlan(seedPromptZh, defaultConciergeProfile, ['esim', 'ai-group-meal']);
const conciergeNameZh = '龙腾中转礼遇助手';
const conciergeNameEn = 'DragonPass Stopover Concierge';

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isDashScopeSource(source?: string) {
  return Boolean(source?.startsWith('dashscope:'));
}

function sourceLabel(source: string | undefined, isChinese: boolean) {
  if (isDashScopeSource(source)) return isChinese ? '礼宾模型在线' : 'Concierge model online';
  if (source === 'system') return isChinese ? '中转礼遇助手' : 'DragonPass Concierge';
  if (source === 'template') return isChinese ? '模板流程' : 'Template flow';
  if (source?.startsWith('fallback')) return isChinese ? '规则兜底' : 'Rule fallback';
  return isChinese ? '业务引擎' : 'Business engine';
}

export default function MobileConciergeAgent() {
  const router = useRouter();
  const { language } = useAppPreferences();
  const { clearCustomizations, setSearchParams, selectPackage, toggleAddon, createOrder } = useOrderStore();
  const isChinese = language === 'zh-CN';
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ConciergeProfile>(seedResolved.profile);
  const [plan, setPlan] = useState<ConciergePlan>(seedResolved.plan);
  const [selectedAddons, setSelectedAddons] = useState<AddonSku[]>(seedResolved.plan.recommendedAddons);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [lastSource, setLastSource] = useState('ready');
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'mobile-welcome',
      role: 'assistant',
      content: isChinese
        ? '我是龙腾中转礼遇助手。告诉我机场、停留时长和行李，我会用自然语言对话和卡片带你完成套餐、行李托管、下单与返场保障。'
        : 'I am DragonPass Stopover Concierge. Tell me your airport, layover time and baggage, and I will guide package, baggage custody, order and return assurance through conversation plus cards.',
      source: 'system',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = useMemo(
    () =>
      isChinese
        ? ['按 10 小时中转推荐方案', '行李怎么托管和送回？', '如果城市游误机怎么办？', '我要下单']
        : ['Recommend a 10h plan', 'How is baggage returned?', 'What if the city route causes a miss?', 'Create my order'],
    [isChinese],
  );

  const summaryModules = useMemo(
    () => [
      {
        icon: Clock3,
        label: isChinese ? '停留' : 'Layover',
        value: `${profile.totalTransitHours}h`,
      },
      {
        icon: Luggage,
        label: isChinese ? '行李' : 'Bags',
        value: isChinese ? `${profile.baggagePieces} 件` : `${profile.baggagePieces} pc`,
      },
      {
        icon: ShieldCheck,
        label: isChinese ? '返场缓冲' : 'Return buffer',
        value: '90min',
      },
    ],
    [isChinese, profile.baggagePieces, profile.totalTransitHours],
  );

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [isOpen, isAsking, messages]);

  const askConcierge = async (message: string, nextProfile = profile, nextAddons = selectedAddons) => {
    const trimmed = message.trim();
    if (!trimmed || isAsking) return;

    const userMessage: ChatItem = {
      id: makeId('mobile-user'),
      role: 'user',
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue('');
    setIsAsking(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.map(({ role, content }) => ({ role, content })),
          profile: nextProfile,
          selectedAddons: nextAddons,
          locale: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`concierge api ${response.status}`);
      }

      const data = await response.json();
      const nextPlan = data.plan as ConciergePlan | undefined;
      const nextResolvedProfile = data.profile as ConciergeProfile | undefined;
      const reply =
        typeof data.reply === 'string' && data.reply.trim()
          ? data.reply.trim()
          : nextPlan
            ? buildDeterministicReply(nextPlan, language)
            : isChinese
              ? '我会先按中转时长、行李和返场缓冲帮你核算方案。'
              : 'I will calculate the package from layover time, baggage and return buffer.';

      if (nextPlan) {
        setPlan(nextPlan);
        if (Array.isArray(nextPlan.recommendedAddons) && nextAddons.length === 0) {
          setSelectedAddons(nextPlan.recommendedAddons);
        }
      }
      if (nextResolvedProfile) {
        setProfile(nextResolvedProfile);
      }

      setLastSource(typeof data.source === 'string' ? data.source : 'dashscope');
      setMessages((current) => [
        ...current,
        {
          id: makeId('mobile-assistant'),
          role: 'assistant',
          content: reply,
          source: typeof data.source === 'string' ? data.source : 'dashscope',
        },
      ]);
    } catch (error) {
      console.warn('Mobile concierge fallback', error);
      const local = buildConciergePlan(trimmed, nextProfile, nextAddons);
      setProfile(local.profile);
      setPlan(local.plan);
      setLastSource('fallback:client');
      setMessages((current) => [
        ...current,
        {
          id: makeId('mobile-assistant'),
          role: 'assistant',
          content: buildDeterministicReply(local.plan, language),
          source: 'fallback:client',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askConcierge(inputValue);
  };

  const createConciergeOrder = () => {
    clearCustomizations();
    setSearchParams({
      airportCode: profile.airportCode,
      arrivalFlightNo: profile.arrivalFlightNo,
      departureFlightNo: profile.departureFlightNo,
      arrivalTimeStr: profile.arrivalTimeStr,
      departureTimeStr: profile.departureTimeStr,
      layoverHours: profile.layoverHours,
      totalTransitHours: profile.totalTransitHours,
      baggagePieces: profile.baggagePieces,
    });
    selectPackage(plan.packageSku);
    selectedAddons.forEach((sku) => toggleAddon(sku));
    const order = createOrder();
    setIsOpen(false);
    router.push(`/order?id=${order.orderId}`);
  };

  return (
    <div className="md:hidden">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+14px)] z-50 flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[#12345f] bg-[#06152c] px-4 py-3 text-left text-white shadow-2xl shadow-black/35 active:scale-[0.99]"
          aria-label={isChinese ? '打开龙腾中转礼遇助手' : 'Open DragonPass Stopover Concierge'}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="meal-pulse-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-[1px]">
              <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#06152c]">
                <Bot size={20} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">
                {isChinese ? conciergeNameZh : conciergeNameEn}
              </span>
              <span className="block truncate text-[11px] font-semibold text-slate-300">
                {isChinese ? '对话 + 卡片下单 · 模板快捷流程' : 'Conversation + cards · template flows'}
              </span>
            </span>
          </span>
          <Sparkles className="shrink-0 text-[#ff7a00]" size={20} />
        </button>
      )}

      {isOpen && (
        <section
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[86dvh] min-h-[68dvh] flex-col overflow-hidden rounded-t-[24px] border border-[#1d3559] bg-[#f8fafc] text-[#071632] shadow-2xl shadow-black/40"
          role="dialog"
          aria-modal="true"
          aria-label={isChinese ? '龙腾中转礼遇助手对话框' : 'DragonPass Stopover Concierge dialog'}
        >
          <div className="bg-[#06152c] px-4 pb-3 pt-3 text-white">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/24" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-[#7dd3fc]" />
                  <h2 className="truncate text-base font-black">
                    {isChinese ? conciergeNameZh : conciergeNameEn}
                  </h2>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-300">
                  {isDashScopeSource(lastSource)
                    ? isChinese
                      ? '礼宾模型在线，支持多轮自然语言核算'
                      : 'Concierge model online for multi-turn planning'
                    : isChinese
                      ? '也可用模板与本地业务规则快速跑通流程'
                      : 'Template and local business rules keep the flow deterministic'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
                aria-label={isChinese ? '收起礼宾对话框' : 'Collapse concierge dialog'}
              >
                <ChevronDown size={20} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {summaryModules.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl border border-white/12 bg-white/8 px-3 py-2">
                    <Icon size={15} className="mb-1 text-[#7dd3fc]" />
                    <div className="truncate text-[10px] font-semibold text-slate-300">{item.label}</div>
                    <div className="truncate text-sm font-black text-white">{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <div className="mb-3 rounded-2xl border border-[#d7e1ec] bg-[#ffffff] p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#64748b]">
                    {isChinese ? '当前推荐' : 'Current recommendation'}
                  </div>
                  <div className="mt-1 truncate text-base font-black">{plan.packageName}</div>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed text-[#52627a]">{plan.summary}</p>
                </div>
                <div className="shrink-0 rounded-xl bg-[#eaf1fb] px-3 py-2 text-center">
                  <div className="text-[10px] font-black text-[#0b5fff]">{plan.airportCode}</div>
                  <div className="text-sm font-black text-[#071632]">¥{plan.packagePrice}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={createConciergeOrder}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f97316] px-3 text-xs font-black text-white shadow-lg shadow-orange-600/20 active:scale-[0.98]"
                >
                  <TicketCheck size={15} />
                  <span>{isChinese ? '按此方案下单' : 'Order this plan'}</span>
                </button>
                <Link
                  href="/search"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d7e1ec] bg-[#ffffff] text-[#0b5fff]"
                  aria-label={isChinese ? '打开手动预订' : 'Open manual booking'}
                >
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm font-medium leading-relaxed ${
                        isUser
                          ? 'rounded-br-md bg-[#0b5fff] text-white'
                          : 'rounded-bl-md border border-[#d7e1ec] bg-[#ffffff] text-[#17223a]'
                      }`}
                    >
                      {message.content}
                      {!isUser && message.source ? (
                        <div className="mt-1 text-[10px] font-black text-[#8a98ab]">
                          {sourceLabel(message.source, isChinese)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {isAsking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-[#d7e1ec] bg-[#ffffff] px-3 py-2 text-sm font-black text-[#52627a]">
                    {isChinese ? '中转礼遇助手正在核算方案...' : 'DragonPass Concierge is calculating...'}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[#d7e1ec] bg-[#ffffff] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => void askConcierge(reply)}
                  className="shrink-0 rounded-full border border-[#d7e1ec] bg-[#f1f6fb] px-3 py-2 text-xs font-black text-[#0f3e86] active:scale-[0.98]"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                rows={1}
                placeholder={isChinese ? '问中转礼遇助手：机场、时长、行李、预算...' : 'Ask DragonPass Concierge: airport, bags, budget...'}
                className="max-h-24 min-h-11 flex-1 resize-none rounded-2xl border border-[#d7e1ec] bg-[#f8fafc] px-3 py-3 text-sm font-semibold text-[#071632] outline-none focus:border-[#0b5fff]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isAsking}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#06152c] text-white disabled:cursor-not-allowed disabled:bg-[#94a3b8]"
                aria-label={isChinese ? '发送给礼宾' : 'Send to concierge'}
              >
                {isAsking ? <Plane size={17} /> : <Send size={17} />}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
