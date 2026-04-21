import express from 'express';
import axios from 'axios';
import { getMockOrders, getMockLogistics } from './mockData.js';
import fs from 'fs';

const router = express.Router();

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

const knowledgeBase = fs.readFileSync('./backend/knowledge.txt', 'utf-8');

const SYSTEM_PROMPT = `
你是群接龙平台的智能客服"小群"。你的职责是处理用户咨询，严格按以下规则：

【核心原则】
- 简单问题直接回答（L1）
- 需要用户数据时，先确认（L2）
- 复杂流程逐步引导（L3）

【订单查询规则】
当用户询问"我的订单""查物流""到哪了"且没有明确指定订单时：
- 输出 JSON: {"action":"show_orders", "message":"请选择您的订单"}

【退款规则】
当用户要求退款时：
- 先让用户选择订单（输出show_orders）
- 再让选择原因（输出show_refund_reasons）
- 最后确认金额（输出confirm_refund）

【转人工】
无法处理或用户要求转人工时：输出 {"action":"transfer_human"}

【知识库内容】
${knowledgeBase}

【人设】
专业、亲切、高效。使用少量功能性emoji（📦✅❌）。末尾主动预判需求。
`;

function getMockReply(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('订单') || msg.includes('物流') || msg.includes('快递') || msg.includes('包裹') || msg.includes('到哪') || msg.includes('运输')) {
    return '{"action":"show_orders", "message":"请选择您的订单"}';
  }
  
  if (msg.includes('退款') || msg.includes('退货')) {
    return '{"action":"show_orders", "message":"请选择您要退款的订单"}';
  }
  
  if (msg.includes('提现')) {
    return '您好！提现路径：【我的】-【钱包】-【提现】。提现申请后，工作日【24小时内】到账，周末及节假日顺延。注意：提现金额需满10元，每人每天限提3次哦~';
  }
  
  if (msg.includes('发票')) {
    return '您好！电子发票在下单时勾选，订单完成后自动发送到您的邮箱。如需纸质发票，请联系商家客服~';
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('你好') || msg.includes('您好') || msg.includes('哈喽')) {
    return '您好！我是群接龙 AI 客服，很高兴为您服务~ 请问有什么可以帮助您的？';
  }
  
  return '感谢您的提问！如果您需要查询订单物流，请告诉我，我可以帮您查看~';
}

router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1]?.content || '';
  
  try {
    if (!DASHSCOPE_API_KEY || DASHSCOPE_API_KEY === 'sk-your-api-key-here') {
      console.log('Using mock response for:', userMessage);
      const reply = getMockReply(userMessage);
      
      try {
        const parsed = JSON.parse(reply);
        return res.json({ type: "action", action: { type: parsed.action, content: parsed.message }, suggestions: ["查订单", "申请退款", "提现"] });
      } catch {
        return res.json({ content: reply, suggestions: ["查订单", "申请退款", "提现"] });
      }
    }
    
    const response = await axios.post(
      `${DASHSCOPE_BASE_URL}/chat/completions`,
      {
        model: 'qwen-max',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const reply = response.data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(reply);
      return res.json({ type: "action", action: { type: parsed.action, content: parsed.message }, suggestions: ["查订单", "申请退款", "提现"] });
    } catch {
      return res.json({ content: reply, suggestions: ["查订单", "申请退款", "提现"] });
    }
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    const fallbackReply = getMockReply(userMessage);
    
    try {
      const parsed = JSON.parse(fallbackReply);
      return res.json({ type: "action", action: { type: parsed.action, content: parsed.message }, suggestions: ["查订单", "申请退款", "提现"] });
    } catch {
      return res.json({ content: fallbackReply, suggestions: ["查订单", "申请退款", "提现"] });
    }
  }
});

router.get('/orders', (req, res) => {
  const { userId } = req.query;
  const orders = getMockOrders(userId);
  res.json(orders);
});

router.get('/logistics/:orderId', (req, res) => {
  const { orderId } = req.params;
  const logistics = getMockLogistics(orderId);
  res.json(logistics);
});

export default router;
