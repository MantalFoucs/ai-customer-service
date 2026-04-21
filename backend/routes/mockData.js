const mockOrders = [
  {
    id: 'ORD_001',
    productName: '🍓 草莓礼盒 2kg',
    price: 89.00,
    status: 'shipping',
    statusText: '运输中',
    thumbnail: 'https://picsum.photos/id/108/80/80',
    date: '2025-04-21'
  },
  {
    id: 'ORD_002',
    productName: '🥬 有机蔬菜套餐',
    price: 45.00,
    status: 'delivered',
    statusText: '已签收',
    thumbnail: 'https://picsum.photos/id/15/80/80',
    date: '2025-04-20'
  },
  {
    id: 'ORD_003',
    productName: '🍎 红富士苹果 5斤',
    price: 39.90,
    status: 'shipping',
    statusText: '运输中',
    thumbnail: 'https://picsum.photos/id/106/80/80',
    date: '2025-04-19'
  },
  {
    id: 'ORD_004',
    productName: '🐟 海鲜大礼包',
    price: 199.00,
    status: 'pending',
    statusText: '待发货',
    thumbnail: 'https://picsum.photos/id/21/80/80',
    date: '2025-04-18'
  },
  {
    id: 'ORD_005',
    productName: '🍰 手工蛋糕',
    price: 68.00,
    status: 'delivered',
    statusText: '已签收',
    thumbnail: 'https://picsum.photos/id/106/80/80',
    date: '2025-04-17'
  }
];

export function getMockOrders(userId) {
  const recent = mockOrders.slice(0, 3);
  const all = mockOrders;
  return { recent, all };
}

const logisticsDB = {
  ORD_001: {
    orderId: 'ORD_001',
    carrier: '顺丰速运',
    trackingNumber: 'SF1234567890',
    status: '运输中',
    events: [
      { time: '2025-04-21 08:30', location: '上海市', description: '快件已发车' },
      { time: '2025-04-20 22:15', location: '上海市', description: '快件已到达【上海总部分拨中心】' },
      { time: '2025-04-20 18:00', location: '杭州市', description: '商家已发货' },
    ],
    estimatedDelivery: '2025-04-23'
  },
  ORD_002: {
    orderId: 'ORD_002',
    carrier: '中通快递',
    trackingNumber: 'ZTO987654321',
    status: '已签收',
    events: [
      { time: '2025-04-20 14:20', location: '北京市', description: '已签收，签收人：本人' },
      { time: '2025-04-19 09:00', location: '北京市', description: '快递员正在派送' },
      { time: '2025-04-18 20:00', location: '天津市', description: '快件已到达【天津分拨中心】' },
    ],
    deliveredTime: '2025-04-20 14:20'
  },
  ORD_003: {
    orderId: 'ORD_003',
    carrier: '京东物流',
    trackingNumber: 'JD55667788',
    status: '运输中',
    events: [
      { time: '2025-04-20 10:00', location: '广州市', description: '快件已发车' },
      { time: '2025-04-19 16:30', location: '深圳市', description: '快件已到达【深圳转运中心】' },
      { time: '2025-04-19 10:00', location: '东莞市', description: '商家已发货' },
    ],
    estimatedDelivery: '2025-04-22'
  },
  ORD_004: {
    orderId: 'ORD_004',
    carrier: '圆通速递',
    trackingNumber: 'YT11223344',
    status: '待发货',
    events: [
      { time: '2025-04-18 20:00', location: '南京市', description: '订单已提交，等待商家发货' },
    ],
    estimatedDelivery: '2025-04-24'
  },
  ORD_005: {
    orderId: 'ORD_005',
    carrier: '申通快递',
    trackingNumber: 'ST99887766',
    status: '已签收',
    events: [
      { time: '2025-04-17 11:30', location: '成都市', description: '已签收，签收人：门卫' },
      { time: '2025-04-16 15:00', location: '成都市', description: '快递员正在派送' },
      { time: '2025-04-15 22:00', location: '重庆市', description: '快件已到达【重庆分拨中心】' },
    ],
    deliveredTime: '2025-04-17 11:30'
  }
};

export function getMockLogistics(orderId) {
  return logisticsDB[orderId] || {
    orderId,
    carrier: '未知快递',
    trackingNumber: '暂无',
    status: '暂无信息',
    events: [{ time: new Date().toLocaleString(), location: '未知', description: '暂无物流信息' }]
  };
}
