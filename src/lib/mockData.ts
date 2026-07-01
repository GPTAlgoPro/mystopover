import { Airport, Package, Addon, AirportCode } from './types';

export const airports: Airport[] = [
  {
    code: 'SIN',
    name: '新加坡樟宜国际机场',
    city: 'Singapore',
    nameZh: '新加坡樟宜',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1200',
    loungeLocation: 'T1 环亚贵宾厅 (Plaza Premium Lounge)',
    visaFree: true,
    cityTourRoutes: ['sin-classic-4h', 'sin-deep-6h', 'sin-night-3h'],
  },
  {
    code: 'DOH',
    name: '多哈哈马德国际机场',
    city: 'Doha',
    nameZh: '多哈哈马德',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200',
    loungeLocation: 'Al Mourjan 商务贵宾厅',
    visaFree: true,
    cityTourRoutes: ['doh-classic-4h', 'doh-desert-6h'],
  },
  {
    code: 'IST',
    name: '伊斯坦布尔机场',
    city: 'Istanbul',
    nameZh: '伊斯坦布尔',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1200',
    loungeLocation: 'IGA Premium Lounge',
    visaFree: false, // IST 对部分国家非免签，需要电子签或免签政策核对
    cityTourRoutes: ['ist-classic-4h', 'ist-bosphorus-6h'],
  },
  {
    code: 'DXB',
    name: '迪拜国际机场',
    city: 'Dubai',
    nameZh: '迪拜国际',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    loungeLocation: 'Marhaba Lounge (T3)',
    visaFree: true,
    cityTourRoutes: ['dxb-classic-4h', 'dxb-city-6h'],
  },
];

export const packages: Package[] = [
  {
    sku: 'light',
    name: '轻享包',
    tagline: '6–8 小时中转首选，轻量小憩，去疲补能',
    price: 280,
    currency: 'CNY',
    includes: [
      '机场联营贵宾厅使用权 (3小时)',
      '随身行李安检外寄存与安全托管',
      '快速安检绿色通道 (Fast Track)',
      '贵宾厅内洗漱淋浴与高速 Wi-Fi'
    ],
    recommendedLayover: { minHours: 6, maxHours: 8 },
    addons: ['esim', 'ai-group-meal', 'meal-voucher', 'shower'],
  },
  {
    sku: 'micro',
    name: '微游包',
    tagline: '10–18 小时白天中转首选，轻装出机场，探秘城市',
    price: 780,
    currency: 'CNY',
    includes: [
      '随身行李全托管 (中转柜台收取，直达贵宾厅寄存)',
      '机场联营贵宾厅使用权 (2小时)',
      '标准化城市半日游 (4-6小时，含专车+中文/英文向导)',
      '往返市区机场专属接送机专车',
      '特制当地风味特色午餐/晚餐',
      '中转延误/误机全面安心保障与改签协助'
    ],
    recommendedLayover: { minHours: 10, maxHours: 18 },
    addons: ['esim', 'transfer', 'ai-group-meal', 'meal-voucher'],
  },
  {
    sku: 'overnight',
    name: '过夜包',
    tagline: '12–36 小时跨夜中转首选，舒适床铺与探索双重满足',
    price: 980,
    currency: 'CNY',
    includes: [
      '随身行李全托管 (中转柜台收取，直送合作酒店房间)',
      '合作星级酒店钟点房/过夜房 (6小时舒适入住)',
      '机场 ↔ 合作酒店专属接送专车',
      '机场贵宾厅餐食券 (1小时快速用餐)',
      '中转延误/误机全面安心保障与改签协助'
    ],
    recommendedLayover: { minHours: 12, maxHours: 36 },
    addons: ['esim', 'transfer', 'hotel-dayuse', 'ai-group-meal', 'private-car', 'meal-voucher'],
  },
];

export const addons: Addon[] = [
  {
    sku: 'esim',
    name: '中转地 eSIM 高速流量包',
    price: 35,
    description: '中转地 4G/5G 本地高速流量，免换卡即开即用，支持热点分享，5GB 流量。',
    iconName: 'Wifi',
  },
  {
    sku: 'transfer',
    name: '机场 ↔ 市区/酒店双向专属专车接送',
    price: 150,
    description: '高档 B 级轿车，专业双语司机，举牌接机，准时安全，省去排队打车烦恼。',
    iconName: 'Car',
  },
  {
    sku: 'hotel-dayuse',
    name: '加购：合作酒店钟点房续住 (4小时)',
    price: 300,
    description: '在过夜包基础上额外增加 4 小时酒店房间使用时间，方便更久休憩或倒时差。',
    iconName: 'BedDouble',
  },
  {
    sku: 'shower',
    name: '机场淋浴房升级单点权益',
    price: 60,
    description: '非贵宾厅用户亦可凭券前往机场指定淋浴中心，享 30 分钟舒适淋浴及全套高档备品。',
    iconName: 'ShowerHead',
  },
  {
    sku: 'ai-group-meal',
    name: '龙腾 AI 停留团餐匹配',
    price: 168,
    description: '随票智能匹配停留时段、E/I 偏好与能量水平，生成可拼团或低打扰的机场/城市团餐方案，含餐位锁定与返场时间校验。',
    iconName: 'Sparkles',
  },
  {
    sku: 'meal-voucher',
    name: '机场地标美食核销券 (面值 ¥100)',
    price: 80,
    description: '可在樟宜机场“星耀樟宜”、多哈“黄铜熊”旁等 30+ 合作餐饮店作 ¥100 等值无门槛抵扣。',
    iconName: 'Utensils',
  },
  {
    sku: 'private-car',
    name: '升级：豪华包车/专属定制随性游 (4小时)',
    price: 500,
    description: '升级为独立包车，路线由您决定，随走随停，专属配车与私人导游全程贴心服务。',
    iconName: 'Compass',
  },
];

export interface TourRoute {
  id: string;
  airport: AirportCode;
  name: string;
  duration: string;
  spots: string[];
  description: string;
  schedule: Array<{ time: string; activity: string }>;
}

export const tourRoutes: TourRoute[] = [
  {
    id: 'sin-classic-4h',
    airport: 'SIN',
    name: '樟宜地标经典 4 小时微游',
    duration: '4小时',
    spots: ['滨海湾花园', '鱼尾狮公园', '牛车水唐人街'],
    description: '一次性饱览新加坡最核心的地标性美景，适合初次到访或时间较紧的中转客。',
    schedule: [
      { time: '09:00', activity: '专车在樟宜机场航站楼接机，向导会合' },
      { time: '09:30', activity: '抵达滨海湾花园，参观超级树 (Supertree Grove) 拍照打卡' },
      { time: '10:30', activity: '乘车前往鱼尾狮公园，眺望金沙酒店，漫步海滨步道' },
      { time: '11:15', activity: '探访牛车水唐人街，品尝当地特色南洋糕点或肉骨茶' },
      { time: '12:15', activity: '专车启程返回新加坡樟宜机场' },
      { time: '13:00', activity: '安全抵达机场，开启 VIP 快速安检通道，准备登机' }
    ]
  },
  {
    id: 'sin-deep-6h',
    airport: 'SIN',
    name: '南洋风情深度 6 小时漫游',
    duration: '6小时',
    spots: ['小印度', '哈芝巷', '滨海湾云雾林', '老巴刹美食中心'],
    description: '深度体验多元文化交融，含地标温室门票与老巴刹沙嗲盛宴。',
    schedule: [
      { time: '09:00', activity: '专车机场接机，前往富有印度风情的小印度街区' },
      { time: '10:00', activity: '漫步哈芝巷，欣赏涂鸦墙，探访精品手作小店' },
      { time: '11:00', activity: '进入滨海湾花园双馆（花穹+云雾林），观赏全球最大室内瀑布' },
      { time: '13:00', activity: '前往历史悠久的老巴刹 (Lau Pa Sat)，享用正宗烤沙嗲、海南鸡饭与椰子水' },
      { time: '14:15', activity: '专车返程，途中路过新达城与大喷泉' },
      { time: '15:00', activity: '回到樟宜机场，享受贵宾厅淋浴补能，准备登机' }
    ]
  },
  {
    id: 'sin-night-3h',
    airport: 'SIN',
    name: '星耀樟宜夜魅 3 小时室内奇境',
    duration: '3小时',
    spots: ['雨漩涡瀑布', '星空花园', '樟宜时空体验馆'],
    description: '针对晚间及红眼航班中转客，无需出关也能在机场内部体验到震撼奇景。',
    schedule: [
      { time: '20:00', activity: '贵宾厅会合，向导带领前往星耀樟宜 (Jewel)' },
      { time: '20:15', activity: '观赏 40 米高的汇丰雨漩涡瀑布 (Rain Vortex) 炫目夜间灯光音乐秀' },
      { time: '21:00', activity: '登上星空花园，漫步于奇幻滑道与天空之网' },
      { time: '22:00', activity: '向导送回贵宾厅，尊享按摩椅休息与夜间点心' }
    ]
  },
  {
    id: 'doh-classic-4h',
    airport: 'DOH',
    name: '多哈地标 4 小时沙漠之珠游',
    duration: '4小时',
    spots: ['伊斯兰艺术博物馆', '瓦吉夫老集市', '珍珠岛'],
    description: '感受阿拉伯传统与现代的奇妙碰撞，品尝地道红茶。',
    schedule: [
      { time: '09:00', activity: '机场接机，向导迎接并乘专车出发' },
      { time: '09:20', activity: '游览贝聿铭设计的伊斯兰艺术博物馆外围，俯瞰多哈天际线' },
      { time: '10:15', activity: '探索充满历史感的瓦吉夫老集市 (Souq Waqif)，体验香料与猎鹰文化' },
      { time: '11:30', activity: '乘专车巡游奢华的珍珠岛 (The Pearl-Qatar) 游艇码头' },
      { time: '12:20', activity: '返程，专车送回哈马德机场' }
    ]
  },
  {
    id: 'doh-desert-6h',
    airport: 'DOH',
    name: '卡塔尔沙漠内海 6 小时越野探秘',
    duration: '6小时',
    spots: ['金沙沙丘', '内海 (Khor Al Adaid)', '骆驼农场', '瓦吉夫老集市'],
    description: '深度体验阿拉伯沙漠，4x4 越野冲沙直抵联合国自然保护区内海。',
    schedule: [
      { time: '08:30', activity: '哈马德机场接机，换乘 4x4 越野车前往南部沙漠' },
      { time: '09:30', activity: '抵达金沙沙丘，专业司机带你冲沙 (Dune Bashing)' },
      { time: '10:45', activity: '远眺沙漠与海洋交汇的内海奇观，骆驼骑行与拍照' },
      { time: '12:00', activity: '沙漠营地享用阿拉伯风味午餐与红茶' },
      { time: '13:15', activity: '返程途中停靠瓦吉夫老集市补给纪念品' },
      { time: '14:15', activity: '专车送回哈马德机场，VIP 快速安检' }
    ]
  },
  {
    id: 'dxb-classic-4h',
    airport: 'DXB',
    name: '迪拜地标经典 4 小时游',
    duration: '4小时',
    spots: ['哈利法塔', '迪拜购物中心', '迪拜喷泉'],
    description: '直击世界第一高楼与奢华都市，感受沙漠中崛起的现代传奇。',
    schedule: [
      { time: '09:00', activity: '迪拜国际机场 T3 接机，向导会合乘专车出发' },
      { time: '09:30', activity: '登顶哈利法塔 (Burj Khalifa) 124 层观景台俯瞰全城' },
      { time: '10:45', activity: '漫步迪拜购物中心，探访室内水族馆与奢侈品长廊' },
      { time: '11:45', activity: '欣赏迪拜喷泉音乐水舞秀，眺望帆船酒店天际线' },
      { time: '12:20', activity: '专车启程返回迪拜国际机场' }
    ]
  },
  {
    id: 'dxb-city-6h',
    airport: 'DXB',
    name: '迪拜新旧城 6 小时风情漫游',
    duration: '6小时',
    spots: ['棕榈岛', '亚特兰蒂斯', '黄金市场', '迪拜河风情区'],
    description: '从人工岛奇迹到传统金市，一次看尽迪拜的奢华与市井。',
    schedule: [
      { time: '08:30', activity: '机场接机，专车前往人工棕榈岛 (Palm Jumeirah)' },
      { time: '09:30', activity: '外观亚特兰蒂斯酒店，海滨栈道拍照打卡' },
      { time: '10:45', activity: '前往德拉老城，穿行黄金市场与香料市场' },
      { time: '12:00', activity: '乘传统阿布拉水上木船横渡迪拜河，享当地午餐' },
      { time: '13:30', activity: '自由采购纪念品，专车返程' },
      { time: '14:30', activity: '回到迪拜国际机场，快速安检准备登机' }
    ]
  },
  {
    id: 'ist-bosphorus-6h',
    airport: 'IST',
    name: '博斯普鲁斯海峡 6 小时欧亚漫游',
    duration: '6小时',
    spots: ['托普卡帕宫', '博斯普鲁斯海峡游船', '香料市场', '加拉塔大桥'],
    description: '横跨欧亚两洲，乘船饱览海峡两岸宫殿与城堡。',
    schedule: [
      { time: '08:30', activity: '伊斯坦布尔新机场接机（已过海关），专车前往老城' },
      { time: '09:30', activity: '参观托普卡帕宫外庭，俯瞰金角湾' },
      { time: '10:45', activity: '登船游览博斯普鲁斯海峡，观赏多尔玛巴赫切宫与要塞' },
      { time: '12:15', activity: '海峡边餐厅享用土耳其烤鱼午餐' },
      { time: '13:15', activity: '漫步香料市场与加拉塔大桥，品尝土耳其软糖' },
      { time: '14:15', activity: '专车返回机场，确保航班起飞前从容抵达' }
    ]
  },
  {
    id: 'ist-classic-4h',
    airport: 'IST',
    name: '伊斯坦布尔蓝色经典 4 小时游',
    duration: '4小时',
    spots: ['蓝色清真寺', '圣索菲亚大教堂', '大巴扎集市'],
    description: '跨越欧亚大陆的传奇中转！探访千年的帝都心脏遗址。',
    schedule: [
      { time: '09:00', activity: '专车从新机场接机（已过海关）' },
      { time: '09:50', activity: '抵达苏丹艾哈迈德广场，步行参观蓝色清真寺外景' },
      { time: '10:45', activity: '外观圣索菲亚大教堂，聆听历史讲解' },
      { time: '11:30', activity: '快速穿行古老的大巴扎集市，品尝土耳其咖啡' },
      { time: '12:10', activity: '专车踏上回程高速，确保航班起飞前回到机场' }
    ]
  }
];

export interface MockFlightCase {
  id: string;
  label: string;
  airportCode: AirportCode;
  arrivalFlightNo: string;
  arrivalAirline: string;
  arrivalTimeStr: string;     // e.g. "2026-07-01 09:00"
  departureFlightNo: string;
  departureAirline: string;
  departureTimeStr: string;   // e.g. "2026-07-01 13:00"
  calculatedLayover: number;  // hours
  periodDesc: string;         // e.g. "白天中转", "跨夜中转", "超长跨天中转"
  description: string;
}

export const mockFlightCases: MockFlightCase[] = [
  {
    id: 'case-4h',
    label: '4小时不可订购边界样例 (新加坡樟宜)',
    airportCode: 'SIN',
    arrivalFlightNo: 'SQ801',
    arrivalAirline: '新加坡航空',
    arrivalTimeStr: '2026-07-01 09:00',
    departureFlightNo: 'SQ306',
    departureAirline: '新加坡航空',
    departureTimeStr: '2026-07-01 13:00',
    calculatedLayover: 4,
    periodDesc: '低于MVP最低时长',
    description: '4小时超短中转低于 PRD 6 小时起订线，用于演示不可订购边界和机场内替代建议。'
  },
  {
    id: 'case-10h',
    label: '10小时白天中转 (新加坡樟宜 - 经典微游)',
    airportCode: 'SIN',
    arrivalFlightNo: 'SQ833',
    arrivalAirline: '新加坡航空',
    arrivalTimeStr: '2026-07-01 08:30',
    departureFlightNo: 'SQ322',
    departureAirline: '新加坡航空',
    departureTimeStr: '2026-07-01 18:30',
    calculatedLayover: 10,
    periodDesc: '上午到达 / 傍晚离境',
    description: '10小时白天中转（推荐微游包，手动预留8小时进行市区经典微游）'
  },
  {
    id: 'case-23h',
    label: '23小时跨夜中转 (新加坡樟宜 - 家庭过夜休息)',
    airportCode: 'SIN',
    arrivalFlightNo: 'SQ825',
    arrivalAirline: '新加坡航空',
    arrivalTimeStr: '2026-07-01 13:30',
    departureFlightNo: 'SQ308',
    departureAirline: '新加坡航空',
    departureTimeStr: '2026-07-02 12:30',
    calculatedLayover: 23,
    periodDesc: '中午到达 / 次日中午离境',
    description: '完美过夜时间（自动推荐过夜包，含机场星级酒店6小时舒缓补眠）'
  },
  {
    id: 'case-35h',
    label: '35小时超长跨天中转 (多哈哈马德 - 深度游/私享)',
    airportCode: 'DOH',
    arrivalFlightNo: 'QR871',
    arrivalAirline: '卡塔尔航空',
    arrivalTimeStr: '2026-07-01 23:30',
    departureFlightNo: 'QR003',
    departureAirline: '卡塔尔航空',
    departureTimeStr: '2026-07-03 10:30',
    calculatedLayover: 35,
    periodDesc: '深夜到达 / 隔日早上离境',
    description: '深度跨夜长停（时间充裕，适合订购过夜包并加购包车定制，畅玩沙漠与多哈城市）'
  }
];
