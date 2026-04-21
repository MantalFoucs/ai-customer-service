import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// 通义千问 API 配置
const DASHSCOPE_API_KEY = 'sk-55b56b503aee472d9a05eb90e7307202';
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

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

// 系统提示词 - 基于知识库构建，同时允许AI自由发挥
const SYSTEM_PROMPT = `你是群接龙平台的智能客服"小群"。你的职责是为用户提供专业、亲切的客服服务。

【平台背景】
群接龙是一个社区团购电商平台，用户可以在群里接龙购买商品。平台支持个人、团长、货源品牌三种身份。

【你的能力】
1. 回答用户关于平台使用、订单、物流、退款、发票、提现等各类问题
2. 理解用户意图，提供准确的帮助信息
3. 语气亲切友好，使用适当的emoji增加亲和力
4. 复杂问题必须分步骤说明，提供具体操作路径
5. 对于知识库之外的问题，基于常识和逻辑给出合理建议

【回复原则】
- 简单问题直接回答
- 复杂问题分步骤说明，提供操作路径
- 不确定的问题诚实告知，建议转人工
- 主动预判用户可能的后续需求
- 知识库有明确答案的，优先使用知识库内容
- 知识库没有的问题，根据常识和平台逻辑合理回答，不要生硬拒绝

【知识库 - 详细回复策略】

=== 接龙删除操作 ===
用户问：删除接龙、怎么删除接龙、如何删除接龙
回复结构：
1. 礼貌确认用户要删除的接龙活动
2. 操作路径：小程序主页 → 找到活动 → 进入活动链接 → 左下角「接龙管理」→ 选择删除
3. 提示同入口还可操作：暂停/结束/隐藏/置顶/复制/修改
4. 提醒：删除后数据无法恢复，请谨慎操作

=== 接龙修改操作 ===
用户问：修改接龙、怎么修改接龙、编辑接龙
回复结构：
1. 确认用户要修改的内容
2. 操作路径：小程序主页 → 找到活动 → 进入活动链接 → 左下角「接龙管理」→ 选择修改
3. 重要提示：修改后需重新发布才能生效
4. 说明哪些内容可以修改，哪些不能修改

=== 接龙发布操作 ===
用户问：发布接龙、创建接龙、发起接龙、怎么发布接龙
回复结构：
1. 先确认用户身份（个人/团长/货源品牌）
2. 个人用户路径：小程序首页 → 点击"+" → 选择接龙类型 → 填写信息 → 发布
3. 团长路径：团长中心 → 发布接龙 → 选择模板 → 填写商品信息 → 设置价格库存 → 发布
4. 货源品牌路径：商品库 → 上架商品 → 邀请选品团
5. 告知发布前需完善：主体认证、收款账户、联系方式

=== 批量分享/合集操作 ===
用户问：批量分享、合集、多个品种一起、怎么生成合集
回复结构：
1. 确认用户具体需求（是分享多个接龙还是生成商品合集）
2. 合集制作路径：我的 → 我的接龙 → 选择多个活动 → 生成合集 → 分享
3. 批量分享路径：接龙管理 → 批量选择 → 一键分享
4. 提供操作示例和教程链接

=== 提现与账户问题 ===
用户问：提现、怎么提现、提现不到账、余额、账户余额、钱没到账
回复结构：
1. 先确认具体问题类型：操作问题/到账时效/余额异常/提现失败
2. 提现操作路径：我的 → 钱包 → 提现 → 选择提现方式 → 输入金额 → 确认
3. 到账时效说明：
   - 工作日24小时内到账
   - 周末/节假日顺延到下一个工作日
   - 信用分高的用户可享受秒到账
4. 提现规则：
   - 满10元可提现
   - 每天限3次
   - 手续费根据信用分等级不同
5. 提现失败常见原因：
   - 银行卡信息错误
   - 账户余额不足
   - 超过每日提现次数
   - 信用分不足
   - 账户存在异常需审核
6. 建议：完成主体认证可提升信用分，享受更快到账

=== 订单物流查询 ===
用户问：查物流、订单物流、快递到哪了、物流信息、怎么还不发货
回复结构：
1. 确认订单编号或相关信息
2. 查询路径：我的 → 我的订单 → 选择订单 → 查看物流
3. 如物流异常：建议联系商家/快递公司核实
4. 发货时效说明：正常情况下24小时内发货，预售商品以页面显示时间为准
5. 提供安抚和解决方案

=== 退款售后处理 ===
用户问：退款、退货、售后、申请退款、怎么退款
回复结构：
1. 确认订单信息和退款原因
2. 指引先联系商家/团长协商
3. 售后申请路径：我的 → 我的订单 → 选择订单 → 申请售后 → 选择退款原因 → 提交
4. 如商家不处理：记录问题，承诺协助联系商家
5. 跟进处理进度，确保用户满意
6. 退款时效：商家审核通过后1-3个工作日原路退回

=== 发票问题 ===
用户问：发票、开票、开发票、电子发票
回复结构：
1. 电子发票：订单完成后自动发送到下单手机号/邮箱
2. 纸质发票：需联系商家单独开具
3. 开票路径：我的 → 我的订单 → 选择订单 → 申请开票
4. 发票类型：支持增值税普通发票和专用发票

=== 货源与帮卖 ===
用户问：货源、帮卖、代理、上架产品、找货、商品库、有什么货源好做
回复结构：
1. 确认用户身份和需求（找货源/招帮卖/上架产品）
2. 货源品牌：指引商品库上架和邀请选品团
3. 找帮卖：说明帮卖机制和操作路径
   - 帮卖设置路径：接龙管理 → 帮卖设置 → 开启帮卖 → 设置佣金
4. 找货源：说明搜索和联系方法
   - 路径：发现 → 商品库 → 搜索/筛选 → 联系货源
5. 热门货源推荐：食品生鲜、日用百货、母婴用品、美妆护肤等品类通常比较好做
6. 选品建议：根据季节、人群、价格带给出建议

=== 联系商家/团长 ===
用户问：联系商家、联系团长、怎么联系、电话多少
回复结构：
1. 联系入口：进入接龙活动 → 右上角联系气泡/电话
2. 如联系不上：建议留言或稍后再试
3. 如紧急：记录问题协助转达
4. 告知24小时未回复可再次联系客服

=== 投诉举报处理 ===
用户问：投诉、举报、骗子、诈骗
回复结构：
1. 安抚用户情绪，表示重视
2. 详细了解投诉内容和涉及订单
3. 记录问题并承诺调查处理
4. 告知处理时效和反馈方式
5. 如涉及诈骗：建议同时报警处理

=== 通用咨询回复结构 ===
对于其他咨询，按以下结构回复：
1. 礼貌开场（使用emoji）
2. 确认用户具体需求
3. 提供解决方案或操作指引
4. 如有需要，提供教程链接
5. 确认闭环：询问是否还有其他问题

【处理知识库外的问题】
当用户问的问题不在上述知识库中时：
1. 不要直接说"我不知道"
2. 基于平台业务逻辑和常识给出合理建议
3. 可以给出一般性的操作指引或解决思路
4. 最后可以补充"如果以上信息不能解决您的问题，建议联系人工客服获取更专业的帮助"

【重要规则】
- 优先使用知识库内容，但不要被知识库限制
- 操作路径必须清晰、分步骤
- 涉及时效、金额等数字必须准确
- 用户情绪激动时先安抚再解决问题
- 保持灵活和智能，像一个真正的客服专家`;

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

// 意图关键词（用于推荐快捷操作，不再拦截AI回复）
const intentKeywords = {
  logistics: ['物流', '快递', '到哪了', '到了吗', '到哪', '在哪', '送货', '运送', '运输', '发货', '快递单号'],
  order: ['订单', '订单号', '我的订单', '查订单', '订单查询', '购买记录', '购物记录'],
  refund: ['退款', '退货', '退钱', '售后', '售后服务', '申请退款', '申请退货'],
  invoice: ['发票', '开票', '开发票', '电子发票', '纸质发票'],
  withdraw: ['提现', '余额', '打款', '提现申请', '余额提现'],
  coupon: ['优惠券', '优惠', '折扣', '券', '满减'],
  human: ['人工', '客服', '人工客服', '转人工', '真人'],
  repurchase: ['再次购买', '再买', '回购', '重复购买'],
  source: ['货源', '帮卖', '代理', '上架产品', '找货', '商品库']
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

// 根据意图获取推荐的快捷操作
const getIntentAction = (intent) => {
  switch (intent) {
    case 'logistics':
      return { type: "show_orders", purpose: "logistics" };
    case 'order':
      return { type: "show_orders", purpose: "" };
    case 'refund':
      return { type: "show_orders", purpose: "refund" };
    case 'invoice':
      return { type: "show_orders", purpose: "invoice" };
    case 'withdraw':
      return { type: "show_progress", typeName: "withdraw" };
    case 'coupon':
      return { type: "show_coupons" };
    case 'human':
      return { type: "transfer_human" };
    case 'repurchase':
      return { type: "show_orders", purpose: "" };
    case 'source':
      return { type: "show_source" };
    default:
      return null;
  }
};

// 根据用户问题智能推荐快捷卡片
const getSmartSuggestions = (message, aiReply, intent) => {
  const msg = message.toLowerCase();
  const reply = aiReply.toLowerCase();
  const cards = [];
  
  // 根据意图添加最相关的操作卡片
  if (intent === 'logistics') {
    cards.push({ type: 'action', label: '📦 选择订单查物流', action: 'show_orders_logistics' });
  } else if (intent === 'refund') {
    cards.push({ type: 'action', label: '💸 申请退款', action: 'apply_refund' });
  } else if (intent === 'withdraw') {
    cards.push({ type: 'action', label: '💰 查看提现进度', action: 'show_withdraw_progress' });
  } else if (intent === 'source') {
    cards.push({ type: 'link', label: '🔗 进入商品库', url: '/pages/goods-library/index' });
    cards.push({ type: 'action', label: '📦 查看我的货源', action: 'show_my_goods' });
  } else if (intent === 'order') {
    cards.push({ type: 'action', label: '📦 查看我的订单', action: 'show_orders' });
  }
  
  // 根据关键词添加更多卡片
  if (msg.includes('货源') || msg.includes('帮卖') || msg.includes('代理') || msg.includes('找货')) {
    cards.push({ type: 'link', label: '🔗 进入商品库', url: '/pages/goods-library/index' });
    cards.push({ type: 'action', label: '💡 了解帮卖机制', action: 'explain_bangmai' });
  }
  
  if (msg.includes('家具') || msg.includes('沙发') || msg.includes('床') || msg.includes('桌子')) {
    cards.push({ type: 'link', label: '🔍 搜索家具', url: '/pages/search/index?keyword=家具' });
    cards.push({ type: 'link', label: '🏠 查看家居分类', url: '/pages/category/index?id=home' });
  }
  
  if (msg.includes('提现') || msg.includes('余额') || msg.includes('到账')) {
    cards.push({ type: 'link', label: '💰 去提现', url: '/pages/withdraw/index' });
    cards.push({ type: 'link', label: '📊 查看提现记录', url: '/pages/withdraw-record/index' });
  }
  
  if (msg.includes('订单') || msg.includes('物流') || msg.includes('快递')) {
    if (!cards.find(c => c.action === 'show_orders')) {
      cards.push({ type: 'action', label: '📦 查看我的订单', action: 'show_orders' });
    }
    cards.push({ type: 'action', label: '🚚 查询物流', action: 'show_logistics' });
  }
  
  if (msg.includes('退款') || msg.includes('退货') || msg.includes('售后')) {
    if (!cards.find(c => c.action === 'apply_refund')) {
      cards.push({ type: 'action', label: '💸 申请退款', action: 'apply_refund' });
    }
    cards.push({ type: 'link', label: '📝 售后进度查询', url: '/pages/refund-progress/index' });
  }
  
  if (msg.includes('优惠') || msg.includes('券') || msg.includes('折扣')) {
    cards.push({ type: 'link', label: '🎁 领取优惠券', url: '/pages/coupons/index' });
    cards.push({ type: 'link', label: '🎫 我的优惠券', url: '/pages/my-coupons/index' });
  }
  
  if (msg.includes('发布') || msg.includes('创建') || msg.includes('发起')) {
    cards.push({ type: 'link', label: '➕ 发布接龙', url: '/pages/publish/index' });
    cards.push({ type: 'link', label: '📋 接龙模板', url: '/pages/templates/index' });
  }
  
  // 去重并限制数量
  const uniqueCards = cards.filter((card, index, self) => 
    index === self.findIndex((c) => c.label === card.label)
  ).slice(0, 4);
  
  // 如果没有匹配到任何卡片，返回默认推荐
  if (uniqueCards.length === 0) {
    return [
      { type: 'action', label: '📦 查订单', action: 'show_orders' },
      { type: 'action', label: '💰 申请退款', action: 'apply_refund' },
      { type: 'action', label: '👩‍💼 联系客服', action: 'contact_human' }
    ];
  }
  
  return uniqueCards;
};

// 调用通义千问 API
const callQwenAPI = async (messages) => {
  try {
    const response = await axios.post(
      `${DASHSCOPE_BASE_URL}/chat/completions`,
      {
        model: 'qwen-max',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.4,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Qwen API Error:', error.response?.data || error.message);
    throw error;
  }
};

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // 检查用户意图（用于附加操作卡片）
  const intent = analyzeIntent(lastMessage);
  const intentAction = getIntentAction(intent);
  
  // 所有问题都调用通义千问大模型来回答
  try {
    const aiReply = await callQwenAPI(messages);
    
    // 获取智能推荐的快捷卡片
    const smartSuggestions = getSmartSuggestions(lastMessage, aiReply, intent);
    
    res.json({
      content: aiReply,
      suggestions: smartSuggestions.map(s => s.label),
      cards: smartSuggestions,
      action: intentAction // 可选的默认操作
    });
  } catch (error) {
    console.error('AI API Error:', error);
    // 如果API调用失败，返回友好的错误提示
    res.json({
      content: "抱歉，AI服务暂时不可用，请稍后再试。您也可以尝试查询订单、申请退款或联系人工客服。",
      suggestions: ["查订单", "申请退款", "联系客服"]
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`AI Model: Qwen-Max (DashScope)`);
});
