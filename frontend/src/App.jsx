import { useState, useRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble.jsx";
import OrderSelectorModal from "./components/OrderSelectorModal.jsx";
import LogisticsCard from "./components/LogisticsCard.jsx";
import Suggestions from "./components/Suggestions.jsx";
import RefundReasonModal from "./components/RefundReasonModal.jsx";
import CouponListModal from "./components/CouponListModal.jsx";
import InvoiceTypeModal from "./components/InvoiceTypeModal.jsx";
import ProgressModal from "./components/ProgressModal.jsx";

const thinkingMessages = [
  "正在分析您的问题...",
  "查询相关数据中...",
  "整理回复内容...",
  "稍等片刻，马上为您解答..."
];

const welcomeScenarios = [
  {
    type: "order_issue",
    content: "您好！我注意到您最近有一笔订单【新疆阿克苏苹果 10斤装】还在运输中，预计明天送达。需要帮您查询物流详情吗？",
    suggestions: ["查物流", "申请退款", "开发票"],
    context: { orderId: "QJL98765432102", issue: "shipping" }
  },
  {
    type: "order_delivered",
    content: "您好！看到您最近购买的【云南高山冰糖橙】已经签收了，商品还满意吗？如果有任何问题随时告诉我~",
    suggestions: ["申请退款", "开发票", "再次购买"],
    context: { orderId: "QJL98765432101", issue: "delivered" }
  },
  {
    type: "withdraw_pending",
    content: "您好！检测到您有一笔提现申请（¥2,850.00）正在审核中，需要帮您查看提现进度或了解审核流程吗？",
    suggestions: ["查看提现进度", "继续提现", "联系客服"],
    context: { type: "withdraw", status: "pending" }
  },
  {
    type: "coupon_available",
    content: "您好！您有4张优惠券即将到期，需要帮您查看并领取吗？",
    suggestions: ["领取优惠券", "查看我的优惠券", "使用规则"],
    context: { type: "coupon", count: 4 }
  },
  {
    type: "general",
    content: "您好！我是群接龙 AI 客服小群~ 今天有什么可以帮您的？",
    suggestions: ["查订单", "申请退款", "提现"],
    context: { type: "general" }
  },
  {
    type: "order_help",
    content: "嗨~ 您最近在群接龙上购买了一些商品，需要帮您查询订单状态或者处理售后问题吗？",
    suggestions: ["查订单", "申请退款", "开发票"],
    context: { type: "order_help" }
  },
  {
    type: "withdraw_reminder",
    content: "您好！您的账户余额可提现金额为 ¥2,850.00，需要帮您发起提现申请吗？",
    suggestions: ["立即提现", "查看余额", "提现规则"],
    context: { type: "withdraw_reminder", amount: 2850 }
  },
  {
    type: "returning_user",
    content: "欢迎回来！上次您咨询的订单问题解决了吗？还有什么需要帮助的？",
    suggestions: ["查订单", "申请退款", "提现"],
    context: { type: "returning" }
  }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderModalPurpose, setOrderModalPurpose] = useState("");
  const [showRefundReasonModal, setShowRefundReasonModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showInvoiceTypeModal, setShowInvoiceTypeModal] = useState(false);
  const [showInvoiceFormModal, setShowInvoiceFormModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showRepurchaseModal, setShowRepurchaseModal] = useState(false);
  const [progressType, setProgressType] = useState("");
  const [orders, setOrders] = useState({ recent: [], all: [] });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("");
  const [refundReasons, setRefundReasons] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [invoiceStep, setInvoiceStep] = useState(0);
  const [showingOrderHelp, setShowingOrderHelp] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [gid, setGid] = useState(null);
  const messagesEndRef = useRef(null);
  const thinkingInterval = useRef(null);
  const hasSentWelcome = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeApp();
    }
  }, []);

  const initializeApp = async () => {
    await detectGid();
    await Promise.all([
      fetchOrders(),
      fetch("/api/coupons").then(res => res.json()).then(data => setCoupons(data)),
      fetchProgress("withdraw").then(data => {
        determineScenario(data);
      })
    ]);
  };

  const detectGid = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlGid = urlParams.get('gid');
    if (urlGid) {
      setGid(urlGid);
    } else {
      setGid("QJL_DEMO_USER");
    }
  };

  const fetchOrders = async () => {
    const response = await fetch(`/api/orders${gid ? `?gid=${gid}` : ''}`);
    const data = await response.json();
    setOrders(data);
    return data;
  };

  const fetchProgress = async (type) => {
    const response = await fetch(`/api/progress/${type}${gid ? `?gid=${gid}` : ''}`);
    return response.json();
  };

  const determineScenario = (withdrawData) => {
    const availableCoupons = coupons.filter(c => c.status === "available").length;
    const pendingOrders = orders.recent?.filter(o => o.status === "shipping") || [];
    const deliveredOrders = orders.recent?.filter(o => o.status === "delivered") || [];

    const scenarios = [];
    
    if (withdrawData && withdrawData.status === "审核中") {
      scenarios.push({ weight: 30, scenario: welcomeScenarios.find(s => s.type === "withdraw_pending") });
    }
    
    if (withdrawData && withdrawData.amount && parseFloat(withdrawData.amount.replace(/[^0-9.]/g, '')) > 0) {
      scenarios.push({ weight: 20, scenario: welcomeScenarios.find(s => s.type === "withdraw_reminder") });
    }
    
    if (pendingOrders.length > 0) {
      scenarios.push({ weight: 25, scenario: welcomeScenarios.find(s => s.type === "order_issue") });
    }
    
    if (deliveredOrders.length > 0) {
      scenarios.push({ weight: 15, scenario: welcomeScenarios.find(s => s.type === "order_delivered") });
    }
    
    if (availableCoupons > 0) {
      scenarios.push({ weight: 10, scenario: welcomeScenarios.find(s => s.type === "coupon_available") });
    }
    
    scenarios.push({ weight: 10, scenario: welcomeScenarios.find(s => s.type === "general") });
    
    const totalWeight = scenarios.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedScenario = welcomeScenarios.find(s => s.type === "general");
    
    for (const s of scenarios) {
      random -= s.weight;
      if (random <= 0) {
        selectedScenario = s.scenario;
        break;
      }
    }
    
    if (!hasSentWelcome.current) {
      hasSentWelcome.current = true;
      setCurrentScenario(selectedScenario);
      setMessages([{ id: 1, type: "ai", content: selectedScenario.content, suggestions: selectedScenario.suggestions }]);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      setThinkingText(thinkingMessages[index]);
      thinkingInterval.current = setInterval(() => {
        index = (index + 1) % thinkingMessages.length;
        setThinkingText(thinkingMessages[index]);
      }, 2500);
    } else {
      if (thinkingInterval.current) {
        clearInterval(thinkingInterval.current);
      }
    }
    return () => {
      if (thinkingInterval.current) {
        clearInterval(thinkingInterval.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAttachMenu && !event.target.closest('.attach-menu-container')) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAttachMenu]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { id: Date.now(), type: "user", content }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content }], gid })
      });
      const data = await response.json();
      
      if (data.type === "action") {
        await handleAction(data.action, data.suggestions);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: data.content, suggestions: data.suggestions }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: "抱歉，系统暂时无法响应~", suggestions: ["查询订单", "帮助中心"] }]);
    } finally { setIsLoading(false); }
  };

  const handleAction = async (action, suggestions) => {
    switch (action.type) {
      case "show_orders": {
        const purpose = action.purpose || "";
        setOrderModalPurpose(purpose);
        setInvoiceStep(0);
        const ordersResponse = await fetch(`/api/orders?purpose=${purpose}${gid ? `&gid=${gid}` : ''}`);
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: action.content || "请选择您的订单", suggestions }]);
        setTimeout(() => setShowOrderModal(true), 300);
        break;
      }
      case "show_refund_reasons": {
        const reasonsResponse = await fetch("/api/refund-reasons");
        const reasonsData = await reasonsResponse.json();
        setRefundReasons(reasonsData);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: action.content || "请选择退款原因", suggestions }]);
        setTimeout(() => setShowRefundReasonModal(true), 300);
        break;
      }
      case "show_coupons": {
        const couponsResponse = await fetch(`/api/coupons${gid ? `?gid=${gid}` : ''}`);
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: action.content || "您的优惠券列表", suggestions }]);
        setTimeout(() => setShowCouponModal(true), 300);
        break;
      }
      case "show_invoice_type": {
        setInvoiceStep(2);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: action.content || "请选择发票类型", suggestions }]);
        setTimeout(() => setShowInvoiceTypeModal(true), 300);
        break;
      }
      case "show_progress": {
        setProgressType(action.typeName);
        const progressResponse = await fetch(`/api/progress/${action.typeName}${gid ? `?gid=${gid}` : ''}`);
        const progressData = await progressResponse.json();
        
        if (action.typeName === "withdraw") {
          handleWithdrawProgress(progressData, suggestions);
        } else {
          const typeText = action.typeName === "refund" ? "退款" : "开票";
          setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: `${typeText}进度查询结果：\n\n当前状态：${progressData.status}\n当前步骤：${progressData.step}\n预计时间：${progressData.estimated}`, suggestions }]);
          setTimeout(() => setShowProgressModal(true), 300);
        }
        break;
      }
      case "transfer_human": {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: "正在为您转接人工客服，请稍候...\n\n客服小美将在3分钟内为您服务~", suggestions: ["继续排队", "取消排队", "留言"] }]);
        break;
      }
      default:
        break;
    }
  };

  const handleWithdrawProgress = async (progressData, suggestions) => {
    let analysisContent = `💰 提现进度查询结果：\n\n`;
    analysisContent += `当前状态：${progressData.status}\n`;
    analysisContent += `当前步骤：${progressData.step}\n`;
    analysisContent += `提现金额：${progressData.amount}\n`;
    analysisContent += `提现方式：${progressData.method}\n`;
    analysisContent += `预计到账：${progressData.estimated}\n\n`;

    if (progressData.status === "审核中" && progressData.currentStep === 2) {
      analysisContent += `⏳ 温馨提示：审核通常需要1-2个工作日，请耐心等待。\n\n`;
      analysisContent += `常见审核延迟原因：\n`;
      analysisContent += `• 提交时间在非工作时段（周末/节假日）\n`;
      analysisContent += `• 账户信息需要进一步核实\n`;
      analysisContent += `• 大额提现需要额外风控审核\n\n`;
      analysisContent += `如需加急处理，建议联系人工客服。`;
    }

    setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: analysisContent, suggestions: ["查看详情", "继续提现", "联系客服"] }]);
    setTimeout(() => setShowProgressModal(true), 300);
  };

  const handleDirectAction = async (actionType) => {
    switch (actionType) {
      case "orders": {
        setOrderModalPurpose("");
        const ordersResponse = await fetch(`/api/orders${gid ? `?gid=${gid}` : ''}`);
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setShowOrderModal(true);
        break;
      }
      case "refund": {
        if (selectedOrder) {
          await handleRefundForSelectedOrder();
        } else {
          setOrderModalPurpose("refund");
          const ordersResponse = await fetch(`/api/orders${gid ? `?gid=${gid}` : ''}`);
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
          setShowOrderModal(true);
        }
        break;
      }
      case "invoice": {
        if (selectedOrder) {
          handleInvoiceForSelectedOrder();
        } else {
          setOrderModalPurpose("invoice");
          setInvoiceStep(1);
          const ordersResponse = await fetch(`/api/orders?purpose=invoice${gid ? `&gid=${gid}` : ''}`);
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
          setShowOrderModal(true);
        }
        break;
      }
      case "coupons": {
        const couponsResponse = await fetch(`/api/coupons${gid ? `?gid=${gid}` : ''}`);
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);
        setShowCouponModal(true);
        break;
      }
      case "withdraw": {
        setProgressType("withdraw");
        const progressResponse = await fetch(`/api/progress/withdraw${gid ? `?gid=${gid}` : ''}`);
        const progressData = await progressResponse.json();
        handleWithdrawProgress(progressData, ["查看详情", "继续提现", "联系客服"]);
        break;
      }
      case "transfer_human": {
        setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "正在为您转接人工客服，请稍候...\n\n客服小美将在3分钟内为您服务~", suggestions: ["继续排队", "取消排队", "留言"] }]);
        break;
      }
      default:
        break;
    }
  };

  const handleRefundForSelectedOrder = async () => {
    const reasonsResponse = await fetch("/api/refund-reasons");
    const reasonsData = await reasonsResponse.json();
    setRefundReasons(reasonsData);
    setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "已选择订单：" + selectedOrder.productName + "\n订单号：" + selectedOrder.id + "\n金额：" + selectedOrder.price + " 元\n\n请选择退款原因", suggestions: ["修改订单", "取消申请"] }]);
    setTimeout(() => setShowRefundReasonModal(true), 300);
  };

  const handleInvoiceForSelectedOrder = () => {
    setInvoiceStep(2);
    setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "已选择订单：" + selectedOrder.productName + "\n订单号：" + selectedOrder.id + "\n\n请选择发票类型", suggestions: ["返回修改", "取消申请"] }]);
    setTimeout(() => setShowInvoiceTypeModal(true), 300);
  };

  const handleOrderSelect = async (order) => {
    setShowOrderModal(false);
    setSelectedOrder(order);
    setShowingOrderHelp(true);
    
    if (orderModalPurpose === "logistics") {
      const response = await fetch(`/api/logistics/${order.id}${gid ? `?gid=${gid}` : ''}`);
      const logistics = await response.json();
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "", logistics, suggestions: ["申请退款", "再次购买", "联系商家"] }]);
    } else if (orderModalPurpose === "refund") {
      await handleRefundForSelectedOrder();
    } else if (orderModalPurpose === "invoice") {
      handleInvoiceForSelectedOrder();
    } else {
      const issueAnalysis = analyzeOrderIssue(order);
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: issueAnalysis.content, suggestions: issueAnalysis.suggestions }]);
    }
  };

  const analyzeOrderIssue = (order) => {
    let content = `您选择了订单【${order.productName}】\n`;
    content += `订单号：${order.id}\n`;
    content += `金额：¥${order.price.toFixed(2)}\n`;
    content += `状态：${order.statusText}\n`;
    content += `下单时间：${order.date}\n\n`;
    
    const suggestions = [];
    
    if (order.status === "shipping") {
      content += `📦 订单正在运输中，预计很快就能收到啦！\n\n`;
      content += `需要我帮您查物流轨迹，还是有其他问题呢？`;
      suggestions.push("查物流", "申请退款", "开发票");
    } else if (order.status === "delivered") {
      content += `✅ 订单已签收，商品还满意吗？\n\n`;
      content += `如果商品有任何问题，可以随时联系我们处理哦~`;
      suggestions.push("申请退款", "开发票", "再次购买");
    } else {
      content += `需要我帮您查询订单详情或处理其他问题吗？`;
      suggestions.push("查物流", "申请退款", "开发票");
    }
    
    return { content, suggestions };
  };

  const handleRefundReasonSelect = (reason) => {
    setShowRefundReasonModal(false);
    const amount = selectedOrder?.price || 89.00;
    
    let content = "退款申请已提交！\n\n";
    content += `订单号：${selectedOrder?.id}\n`;
    content += `商品：${selectedOrder?.productName}\n`;
    content += `金额：¥${amount.toFixed(2)}\n`;
    content += `原因：${reason.reason}\n\n`;
    content += `预计1-3个工作日内原路退回\n\n`;
    content += `温馨提示：\n`;
    content += `• 退款将按原支付方式退回\n`;
    content += `• 银行卡退款可能需要1-3个工作日到账\n`;
    content += `• 如有疑问可随时联系客服\n\n`;
    content += `您可以随时查看退款进度`;
    
    setMessages(prev => [...prev, { id: Date.now(), type: "ai", content, suggestions: ["查看退款进度", "修改退款原因", "取消退款"] }]);
  };

  const handleCouponClaim = (coupon) => {
    if (coupon.status === "available") {
      coupon.status = "claimed";
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "已成功领取【" + coupon.name + "】！\n\n优惠信息：" + coupon.discount + "\n有效期至：" + coupon.expire + "\n\n可在\"我的优惠券\"中查看和使用", suggestions: ["领取更多优惠", "我的优惠券", "使用规则"] }]);
    }
  };

  const handleInvoiceTypeSelect = (type) => {
    setShowInvoiceTypeModal(false);
    setSelectedInvoiceType(type);
    setInvoiceStep(3);
    const typeText = type === "personal" ? "个人电子发票" : "企业电子发票";
    setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "已选择" + typeText + "，请填写相关信息", suggestions: ["返回修改", "取消申请"] }]);
    setTimeout(() => setShowInvoiceFormModal(true), 300);
  };

  const handleInvoiceFormClose = () => {
    setShowInvoiceFormModal(false);
  };

  const handleInvoiceBack = () => {
    if (invoiceStep === 3) {
      setShowInvoiceFormModal(false);
      setInvoiceStep(2);
      setTimeout(() => setShowInvoiceTypeModal(true), 100);
    } else if (invoiceStep === 2) {
      setShowInvoiceTypeModal(false);
      setInvoiceStep(1);
      setTimeout(() => setShowOrderModal(true), 100);
    }
  };

  const handleInvoiceSubmit = (formData) => {
    setShowInvoiceFormModal(false);
    
    if (selectedInvoiceType === "personal") {
      if (!formData.email) {
        setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "请填写邮箱地址~", suggestions: ["重新填写", "取消申请"] }]);
        return;
      }
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "发票申请已提交！\n\n订单号：" + selectedOrder?.id + "\n商品：" + selectedOrder?.productName + "\n发票类型：个人电子发票\n接收邮箱：" + formData.email + "\n\n预计24小时内发送至您的邮箱\n\n您可以随时查看开票进度", suggestions: ["查看开票进度", "修改发票信息", "取消申请"] }]);
    } else {
      if (!formData.companyName || !formData.email) {
        setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "请填写完整的企业信息~", suggestions: ["重新填写", "取消申请"] }]);
        return;
      }
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "发票申请已提交！\n\n订单号：" + selectedOrder?.id + "\n商品：" + selectedOrder?.productName + "\n发票类型：企业电子发票\n企业名称：" + formData.companyName + (formData.taxId ? "\n税号：" + formData.taxId : "") + "\n接收邮箱：" + formData.email + "\n\n预计24小时内发送至您的邮箱\n\n您可以随时查看开票进度", suggestions: ["查看开票进度", "修改发票信息", "取消申请"] }]);
    }
  };

  const handleViewProgress = async (type) => {
    const response = await fetch(`/api/progress/${type}${gid ? `?gid=${gid}` : ''}`);
    const progress = await response.json();
    
    if (type === "withdraw") {
      handleWithdrawProgress(progress, ["查看详情", "继续提现", "联系客服"]);
    } else {
      setProgressType(type);
      setShowProgressModal(true);
    }
  };

  const handleViewLogistics = async () => {
    if (selectedOrder) {
      const response = await fetch(`/api/logistics/${selectedOrder.id}${gid ? `?gid=${gid}` : ''}`);
      const logistics = await response.json();
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "", logistics, suggestions: ["申请退款", "再次购买", "联系商家"] }]);
    }
  };

  const handleRepurchase = async () => {
    if (selectedOrder) {
      const response = await fetch(`/api/product/${selectedOrder.id}`);
      const product = await response.json();
      setCurrentProduct(product);
      setShowRepurchaseModal(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.includes("退款进度")) {
      handleViewProgress("refund");
    } else if (suggestion.includes("开票进度")) {
      handleViewProgress("invoice");
    } else if (suggestion.includes("提现")) {
      handleDirectAction("withdraw");
    } else if (suggestion === "查物流" && selectedOrder && showingOrderHelp) {
      handleViewLogistics();
    } else if (suggestion === "申请退款" && selectedOrder && showingOrderHelp) {
      handleDirectAction("refund");
    } else if (suggestion === "开发票" && selectedOrder && showingOrderHelp) {
      handleDirectAction("invoice");
    } else if (suggestion === "再次购买" && selectedOrder && showingOrderHelp) {
      handleRepurchase();
    } else if (suggestion === "返回修改" && invoiceStep > 1) {
      handleInvoiceBack();
    } else {
      handleSendMessage(suggestion);
    }
  };

  const quickActions = [
    { label: "一键帮卖", icon: "🚀", action: "navigate", url: "https://qunjielong.com" },
    { label: "查订单", icon: "📦", action: "direct", type: "orders" },
    { label: "申请退款", icon: "💰", action: "direct", type: "refund" },
    { label: "开发票", icon: "🧾", action: "direct", type: "invoice" },
    { label: "提现", icon: "💳", action: "direct", type: "withdraw" },
    { label: "人工客服", icon: "👩‍💼", action: "direct", type: "transfer_human" }
  ];

  const handleQuickAction = (item) => {
    if (item.action === "navigate") {
      window.open(item.url, "_blank");
    } else if (item.action === "direct") {
      handleDirectAction(item.type);
    }
  };

  const handleSend = () => {
    handleSendMessage(inputValue);
  };

  const handleAttachSelect = (type) => {
    setShowAttachMenu(false);
    switch (type) {
      case "order":
        handleDirectAction("orders");
        break;
      case "image":
        handleImageUpload();
        break;
      case "video":
        handleVideoUpload();
        break;
      default:
        break;
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setMessages(prev => [...prev, { id: Date.now(), type: "user", content: "", image: event.target.result }]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setMessages(prev => [...prev, { id: Date.now(), type: "user", content: "", video: event.target.result }]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const attachOptions = [
    { icon: "📦", label: "订单", type: "order" },
    { icon: "🖼️", label: "图片", type: "image" },
    { icon: "🎬", label: "视频", type: "video" }
  ];

  const handleRepurchaseSubmit = (selectedSpec, selectedPrice) => {
    setShowRepurchaseModal(false);
    setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: `已成功加入购物车！\n\n商品：${currentProduct.name}\n规格：${selectedSpec}\n价格：¥${selectedPrice.toFixed(2)}\n\n您可以前往购物车结算~`, suggestions: ["继续购买", "去结算", "查看订单"] }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[393px] h-[852px] bg-white/50 backdrop-blur-xl rounded-[24px] shadow-xl overflow-hidden flex flex-col" style={{ boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)" }}>
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 px-5 h-[64px] flex items-center justify-center shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-white">群接龙 AI 客服</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              <MessageBubble message={msg}/>
              {msg.suggestions && <Suggestions suggestions={msg.suggestions} onSelect={handleSuggestionClick}/>}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/60 backdrop-blur-lg rounded-xl rounded-bl-md px-4 py-3 shadow-sm border border-white/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{thinkingText}</span>
                </div>
                <div className="flex gap-1.5 ml-9 mt-2">
                  <span className="thinking-dot w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="thinking-dot w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="thinking-dot w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef}/>
        </div>
        
        <div className="bg-white/40 backdrop-blur-lg border-t border-white/30 px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {quickActions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(item)}
                className={"px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 " + (item.action === "navigate" ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95" : "bg-white/70 text-gray-600 border border-gray-200/50 hover:bg-white hover:border-teal-200 hover:text-teal-600")}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-white/40 backdrop-blur-lg border-t border-white/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="w-10 h-10 bg-white/70 backdrop-blur border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-200 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="有什么可以帮到您？"
                className="w-full px-4 py-2.5 bg-white/70 backdrop-blur border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}
              />
              {inputValue && (
                <button onClick={() => setInputValue("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {showAttachMenu && (
            <div className="attach-menu-container absolute bottom-[140px] left-1/2 -translate-x-1/2 w-[393px] max-w-[90vw]">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-fade-slide-up">
                <div className="grid grid-cols-3 gap-3">
                  {attachOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleAttachSelect(option.type)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl">
                        {option.icon}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showOrderModal && (
        <OrderSelectorModal
          title={orderModalPurpose === "refund" ? "选择要退款的订单" : orderModalPurpose === "invoice" ? "选择要开发票的订单" : "选择您的订单"}
          recentOrders={orders.recent}
          allOrders={orders.all}
          onSelect={handleOrderSelect}
          onClose={() => setShowOrderModal(false)}
        />
      )}
      
      {showRefundReasonModal && (
        <RefundReasonModal
          reasons={refundReasons}
          onSelect={handleRefundReasonSelect}
          onClose={() => setShowRefundReasonModal(false)}
        />
      )}
      
      {showCouponModal && (
        <CouponListModal
          coupons={coupons}
          onClaim={handleCouponClaim}
          onClose={() => setShowCouponModal(false)}
        />
      )}
      
      {showInvoiceTypeModal && (
        <InvoiceTypeModal
          onSelect={handleInvoiceTypeSelect}
          onClose={() => setShowInvoiceTypeModal(false)}
          onBack={() => handleInvoiceBack()}
        />
      )}
      
      {showInvoiceFormModal && (
        <InvoiceFormModal
          type={selectedInvoiceType}
          onSubmit={handleInvoiceSubmit}
          onClose={() => handleInvoiceFormClose()}
          onBack={() => handleInvoiceBack()}
        />
      )}
      
      {showProgressModal && (
        <ProgressModal
          type={progressType}
          onClose={() => setShowProgressModal(false)}
        />
      )}
      
      {showRepurchaseModal && currentProduct && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-[393px] max-h-[80vh] overflow-y-auto animate-fade-slide-up">
            <div className="sticky top-0 bg-white/95 backdrop-blur p-4 border-b border-gray-100 flex justify-between items-center">
              <button onClick={() => setShowRepurchaseModal(false)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">返回</span>
              </button>
              <h3 className="font-semibold text-gray-800">再次购买</h3>
              <button onClick={() => setShowRepurchaseModal(false)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="flex gap-4 mb-4">
                <img src={currentProduct.image} alt={currentProduct.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{currentProduct.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{currentProduct.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>产地：{currentProduct.origin}</span>
                    <span>|</span>
                    <span>保质期：{currentProduct.shelfLife}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">选择规格</h5>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.specs.map((spec, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleRepurchaseSubmit(spec, currentProduct.prices[index]);
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                    >
                      {spec} - ¥{currentProduct.prices[index].toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <h5 className="text-xs text-gray-500 mb-1">温馨提示</h5>
                <p className="text-xs text-gray-600">{currentProduct.storage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceFormModal({ type, onSubmit, onClose, onBack }) {
  const [formData, setFormData] = useState({ email: "", companyName: "", taxId: "" });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-[393px] max-h-[80vh] overflow-y-auto animate-fade-slide-up">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-4 border-b border-gray-100 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </button>
          <h3 className="font-semibold text-gray-800">填写{type === "personal" ? "个人" : "企业"}发票信息</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          {type === "company" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">企业名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="请输入企业名称"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">税号</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => handleChange("taxId", e.target.value)}
                  placeholder="请输入税号（选填）"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">接收邮箱 <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="请输入接收发票的邮箱"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            提交发票申请
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
