import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

const orders = {
  recent: [
    { id: "QJL98765432101", productName: "云南高山冰糖橙 5斤装", price: 49.90, status: "delivered", statusText: "已签收", date: "2024-01-15", expressNo: "SF1234567890", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20orange%20citrus%20fruits%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432102", productName: "新疆阿克苏苹果 10斤装", price: 89.00, status: "shipping", statusText: "运输中", date: "2024-01-18", expressNo: "YT9876543210", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20apple%20fruits%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432103", productName: "智利车厘子 2斤装", price: 128.00, status: "pending", statusText: "待发货", date: "2024-01-20", expressNo: null, image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20cherries%20on%20white%20background%20product%20photography&image_size=square" }
  ],
  all: [
    { id: "QJL98765432101", productName: "云南高山冰糖橙 5斤装", price: 49.90, status: "delivered", statusText: "已签收", date: "2024-01-15", expressNo: "SF1234567890", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20orange%20citrus%20fruits%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432102", productName: "新疆阿克苏苹果 10斤装", price: 89.00, status: "shipping", statusText: "运输中", date: "2024-01-18", expressNo: "YT9876543210", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20apple%20fruits%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432103", productName: "智利车厘子 2斤装", price: 128.00, status: "pending", statusText: "待发货", date: "2024-01-20", expressNo: null, image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20cherries%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432104", productName: "泰国金枕头榴莲 3斤装", price: 159.00, status: "delivered", statusText: "已签收", date: "2024-01-10", expressNo: "JD1234567890", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20durian%20fruit%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432105", productName: "海南贵妃芒 5斤装", price: 68.00, status: "completed", statusText: "已完成", date: "2024-01-08", expressNo: "ZTO987654321", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20yellow%20mango%20fruits%20on%20white%20background%20product%20photography&image_size=square" },
    { id: "QJL98765432106", productName: "新西兰奇异果 6个装", price: 39.90, status: "refunded", statusText: "已退款", date: "2024-01-05", expressNo: "EMS123456789", image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20kiwi%20fruits%20on%20white%20background%20product%20photography&image_size=square" }
  ]
};

const products = {
  "QJL98765432101": {
    id: "P001",
    name: "云南高山冰糖橙",
    desc: "精选云南高海拔产区，皮薄肉嫩，汁多味甜，富含维C",
    specs: ["3斤装", "5斤装", "10斤装"],
    prices: [35.90, 49.90, 89.00],
    origin: "云南·玉溪",
    shelfLife: "15天",
    storage: "冷藏保存",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20orange%20citrus%20fruits%20on%20white%20background%20product%20photography&image_size=square"
  },
  "QJL98765432102": {
    id: "P002",
    name: "新疆阿克苏苹果",
    desc: "冰糖心苹果，果肉细腻，甜度高，自然成熟",
    specs: ["5斤装", "10斤装", "20斤装"],
    prices: [59.00, 89.00, 159.00],
    origin: "新疆·阿克苏",
    shelfLife: "30天",
    storage: "阴凉通风处保存",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20apple%20fruits%20on%20white%20background%20product%20photography&image_size=square"
  },
  "QJL98765432103": {
    id: "P003",
    name: "智利车厘子",
    desc: "进口智利车厘子，果大饱满，甜度高，新鲜空运",
    specs: ["1斤装", "2斤装", "5斤装"],
    prices: [78.00, 128.00, 298.00],
    origin: "智利",
    shelfLife: "7天",
    storage: "冷藏0-4°C保存",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20red%20cherries%20on%20white%20background%20product%20photography&image_size=square"
  },
  "QJL98765432104": {
    id: "P004",
    name: "泰国金枕头榴莲",
    desc: "泰国进口金枕头榴莲，果肉金黄，浓郁香甜",
    specs: ["2斤装", "3斤装", "5斤装"],
    prices: [119.00, 159.00, 239.00],
    origin: "泰国",
    shelfLife: "5天",
    storage: "常温放置，尽快食用",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20durian%20fruit%20on%20white%20background%20product%20photography&image_size=square"
  },
  "QJL98765432105": {
    id: "P005",
    name: "海南贵妃芒",
    desc: "海南贵妃芒，皮薄肉厚，核小汁多，香甜可口",
    specs: ["3斤装", "5斤装", "10斤装"],
    prices: [45.00, 68.00, 128.00],
    origin: "海南·三亚",
    shelfLife: "10天",
    storage: "常温或冷藏保存",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20yellow%20mango%20fruits%20on%20white%20background%20product%20photography&image_size=square"
  },
  "QJL98765432106": {
    id: "P006",
    name: "新西兰奇异果",
    desc: "新西兰进口奇异果，富含膳食纤维和维生素",
    specs: ["6个装", "12个装", "24个装"],
    prices: [39.90, 69.90, 129.00],
    origin: "新西兰",
    shelfLife: "20天",
    storage: "冷藏保存",
    image: "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fresh%20kiwi%20fruits%20on%20white%20background%20product%20photography&image_size=square"
  }
};

const logisticsData = {
  "QJL98765432101": {
    expressCompany: "顺丰速运",
    expressNo: "SF1234567890",
    estimatedDelivery: "2024-01-18",
    currentStatus: "已签收",
    timeline: [
      { time: "2024-01-15 14:30", status: "快件已签收", location: "北京市朝阳区" },
      { time: "2024-01-15 08:15", status: "快件正在派送中", location: "北京市朝阳区网点" },
      { time: "2024-01-14 22:30", status: "快件到达北京转运中心", location: "北京市" },
      { time: "2024-01-13 18:00", status: "快件已发出", location: "云南省昆明市" },
      { time: "2024-01-13 14:00", status: "商家已发货", location: "云南省昆明市" }
    ]
  },
  "QJL98765432102": {
    expressCompany: "圆通速递",
    expressNo: "YT9876543210",
    estimatedDelivery: "2024-01-21",
    currentStatus: "运输中",
    timeline: [
      { time: "2024-01-19 16:30", status: "快件正在运输中", location: "甘肃省兰州市" },
      { time: "2024-01-18 20:00", status: "快件已发出", location: "新疆阿克苏市" },
      { time: "2024-01-18 16:00", status: "商家已发货", location: "新疆阿克苏市" }
    ]
  },
  "QJL98765432103": {
    expressCompany: "中通快递",
    expressNo: null,
    estimatedDelivery: "2024-01-23",
    currentStatus: "待发货",
    timeline: [
      { time: "2024-01-20 10:00", status: "订单已提交", location: "智利圣地亚哥" },
      { time: "2024-01-20 10:05", status: "商家已接单", location: "智利圣地亚哥" }
    ]
  }
};

const refundReasons = [
  { id: 1, reason: "商品质量问题", description: "商品存在质量缺陷或损坏" },
  { id: 2, reason: "商品与描述不符", description: "收到的商品与页面描述不一致" },
  { id: 3, reason: "尺寸/规格不符", description: "商品尺寸或规格不符合预期" },
  { id: 4, reason: "拍错/多拍", description: "误拍或重复下单" },
  { id: 5, reason: "不想要了", description: "个人原因不想购买" },
  { id: 6, reason: "物流问题", description: "长时间未收到商品或物流异常" },
  { id: 7, reason: "发货延迟", description: "商家未按时发货" },
  { id: 8, reason: "其他", description: "其他原因请在备注中说明" }
];

const coupons = [
  { id: 1, name: "新人专享券", discount: "满50减10", expire: "2024-02-28", status: "available", minAmount: 50, discountAmount: 10 },
  { id: 2, name: "水果专区券", discount: "满100减20", expire: "2024-02-15", status: "available", minAmount: 100, discountAmount: 20 },
  { id: 3, name: "会员折扣券", discount: "满200减30", expire: "2024-03-01", status: "available", minAmount: 200, discountAmount: 30 },
  { id: 4, name: "限时特惠券", discount: "满80减15", expire: "2024-01-25", status: "available", minAmount: 80, discountAmount: 15 },
  { id: 5, name: "已使用券", discount: "满30减5", expire: "2024-01-10", status: "used", minAmount: 30, discountAmount: 5 },
  { id: 6, name: "已过期券", discount: "满100减15", expire: "2024-01-01", status: "expired", minAmount: 100, discountAmount: 15 }
];

const progressData = {
  withdraw: {
    status: "审核中",
    step: "审核阶段",
    currentStep: 2,
    totalSteps: 4,
    amount: "¥2,850.00",
    method: "银行卡",
    estimated: "1-2个工作日",
    timeline: [
      { step: 1, title: "提交申请", status: "completed", time: "2024-01-19 14:30" },
      { step: 2, title: "审核中", status: "current", time: "2024-01-19 15:00" },
      { step: 3, title: "打款处理", status: "pending", time: null },
      { step: 4, title: "已到账", status: "pending", time: null }
    ],
    bankInfo: "尾号****8888",
    submitTime: "2024-01-19 14:30"
  },
  refund: {
    status: "处理中",
    step: "商家审核",
    currentStep: 2,
    totalSteps: 4,
    amount: "¥89.00",
    orderId: "QJL98765432102",
    estimated: "1-3个工作日",
    timeline: [
      { step: 1, title: "提交申请", status: "completed", time: "2024-01-20 10:00" },
      { step: 2, title: "商家审核", status: "current", time: "2024-01-20 10:15" },
      { step: 3, title: "退款处理", status: "pending", time: null },
      { step: 4, title: "已到账", status: "pending", time: null }
    ]
  },
  invoice: {
    status: "已完成",
    step: "已发送",
    currentStep: 4,
    totalSteps: 4,
    orderId: "QJL98765432101",
    estimated: "已完成",
    timeline: [
      { step: 1, title: "提交申请", status: "completed", time: "2024-01-16 09:00" },
      { step: 2, title: "审核通过", status: "completed", time: "2024-01-16 10:30" },
      { step: 3, title: "开具发票", status: "completed", time: "2024-01-16 14:00" },
      { step: 4, title: "已发送", status: "completed", time: "2024-01-16 14:30" }
    ],
    email: "user@example.com"
  }
};

app.get('/api/orders', (req, res) => {
  const purpose = req.query.purpose;
  let filteredOrders = { ...orders };
  
  if (purpose === 'invoice') {
    filteredOrders.recent = orders.recent.filter(o => o.status === 'delivered');
    filteredOrders.all = orders.all.filter(o => o.status === 'delivered');
  } else if (purpose === 'refund') {
    filteredOrders.recent = orders.recent.filter(o => ['delivered', 'shipping'].includes(o.status));
    filteredOrders.all = orders.all.filter(o => ['delivered', 'shipping'].includes(o.status));
  }
  
  res.json(filteredOrders);
});

app.get('/api/product/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const product = products[orderId];
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/logistics/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const logistics = logisticsData[orderId];
  
  if (logistics) {
    const events = logistics.timeline.map(item => ({
      description: item.status,
      location: item.location,
      time: item.time
    }));
    
    res.json({
      status: logistics.currentStatus,
      carrier: logistics.expressCompany,
      trackingNumber: logistics.expressNo || "--",
      estimatedDelivery: logistics.estimatedDelivery,
      deliveredTime: logistics.currentStatus === "已签收" && logistics.timeline.length > 0 ? logistics.timeline[0].time : null,
      events: events,
      orderId: orderId
    });
  } else {
    res.json({
      status: "暂无物流信息",
      carrier: "未知",
      trackingNumber: "--",
      estimatedDelivery: "--",
      deliveredTime: null,
      events: [{ description: "暂无物流信息", location: "--", time: "--" }],
      orderId: orderId
    });
  }
});

app.get('/api/refund-reasons', (req, res) => {
  res.json(refundReasons);
});

app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.get('/api/progress/:type', (req, res) => {
  const type = req.params.type;
  const progress = progressData[type];
  
  if (progress) {
    res.json(progress);
  } else {
    res.json({
      status: "暂无记录",
      step: "--",
      estimated: "--"
    });
  }
});

const intentKeywords = {
  logistics: [
    '物流', '快递', '到哪了', '到了吗', '到哪', '在哪',
    '送货', '运送', '运输', '发货', '快递单号',
    '到哪了', '到哪了呀', '东西到哪了', '我的东西到哪了',
    '快递到哪了', '货到哪了', '包裹到哪了', '快件到哪了',
    '什么时候到', '多久到', '预计什么时候到', '能到吗',
    '查询物流', '查物流', '物流信息', '快递信息', '运输信息'
  ],
  order: [
    '订单', '订单号', '我的订单', '查订单', '订单查询',
    '购买记录', '购物记录', '订单状态', '订单详情',
    '买了什么', '我买的东西', '我买的商品', '查看订单'
  ],
  refund: [
    '退款', '退货', '退钱', '售后', '售后服务',
    '申请退款', '申请退货', '退货退款', '退款申请',
    '退', '不要了', '想退', '质量问题', '有问题'
  ],
  invoice: [
    '发票', '开票', '开发票', '电子发票', '纸质发票',
    '增值税发票', '发票申请', '索取发票', '发票信息'
  ],
  withdraw: [
    '提现', '余额', '打款', '提现申请', '余额提现',
    '提现进度', '提现审核', '提现到账', '提钱', '取钱'
  ],
  coupon: [
    '优惠券', '优惠', '折扣', '券', '满减',
    '领取优惠券', '优惠券领取', '我的优惠券', '优惠码'
  ],
  human: [
    '人工', '客服', '人工客服', '转人工', '真人',
    '人工服务', '客服电话', '联系客服', '找客服'
  ],
  repurchase: [
    '再次购买', '再买', '回购', '重复购买', '想买'
  ]
};

const analyzeIntent = (message) => {
  const lowerMsg = message.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword)) {
        return intent;
      }
    }
  }
  
  return null;
};

const aiResponses = {
  greetings: [
    "您好！我是群接龙 AI 客服~ 今天有什么可以帮您的？",
    "嗨！我是小群，很高兴为您服务~",
    "您好！需要查询订单还是处理售后问题呢？"
  ],
  thanks: [
    "不客气！很高兴能帮到您~",
    "不用谢，有问题随时找我哦！",
    "能为您服务是我的荣幸~"
  ],
  fallback: [
    "抱歉，我不太理解您的问题，可以换一种方式问吗？",
    "您的问题我需要进一步了解，能再详细说明一下吗？",
    "这个问题我会帮您记录并转交人工客服处理~"
  ],
  order_related: [
    "好的，我来帮您查询订单信息~",
    "请告诉我您的订单号，我来帮您查询~",
    "您最近有3笔订单，需要查询哪一笔呢？"
  ],
  refund_related: [
    "好的，我来帮您处理退款申请~",
    "请告诉我订单号或选择要退款的订单~",
    "退款申请需要1-3个工作日处理，请耐心等待~"
  ],
  invoice_related: [
    "好的，我来帮您处理发票申请~",
    "电子发票将在24小时内发送至您的邮箱~",
    "请选择要开发票的订单~"
  ],
  withdraw_related: [
    "好的，我来帮您查询提现进度~",
    "提现审核通常需要1-2个工作日~",
    "大额提现可能需要额外审核，请耐心等待~"
  ],
  coupon_related: [
    "好的，我来帮您查看优惠券~",
    "您有4张优惠券即将到期，需要领取吗？",
    "优惠券可以在下单时直接抵扣~"
  ]
};

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  const intent = analyzeIntent(lastMessage);
  
  let response = { content: aiResponses.fallback[0], suggestions: ["查询订单", "帮助中心"] };
  
  switch (intent) {
    case 'logistics':
      response = {
        type: "action",
        action: { type: "show_orders", purpose: "logistics" },
        suggestions: ["查物流", "申请退款", "开发票"]
      };
      break;
    case 'order':
      response = {
        type: "action",
        action: { type: "show_orders", purpose: "" },
        suggestions: ["查物流", "申请退款", "开发票"]
      };
      break;
    case 'refund':
      response = {
        type: "action",
        action: { type: "show_orders", purpose: "refund" },
        suggestions: ["修改订单", "取消申请"]
      };
      break;
    case 'invoice':
      response = {
        type: "action",
        action: { type: "show_orders", purpose: "invoice" },
        suggestions: ["返回修改", "取消申请"]
      };
      break;
    case 'withdraw':
      response = {
        type: "action",
        action: { type: "show_progress", typeName: "withdraw" },
        suggestions: ["查看详情", "继续提现", "联系客服"]
      };
      break;
    case 'coupon':
      response = {
        type: "action",
        action: { type: "show_coupons" },
        suggestions: ["领取优惠券", "查看我的优惠券", "使用规则"]
      };
      break;
    case 'human':
      response = {
        type: "action",
        action: { type: "transfer_human" },
        suggestions: ["继续排队", "取消排队", "留言"]
      };
      break;
    case 'repurchase':
      response = {
        type: "action",
        action: { type: "show_orders", purpose: "" },
        suggestions: ["查物流", "申请退款", "再次购买"]
      };
      break;
    default:
      if (lastMessage.includes('谢谢') || lastMessage.includes('感谢')) {
        response = { content: aiResponses.thanks[Math.floor(Math.random() * aiResponses.thanks.length)], suggestions: ["继续咨询", "帮助中心"] };
      } else {
        response = {
          content: "您好！我是群接龙 AI 客服小群~ 可以帮您查询订单、处理退款、开发票或查询提现进度哦~",
          suggestions: ["查订单", "申请退款", "提现"]
        };
      }
  }
  
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  res.json(response);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
