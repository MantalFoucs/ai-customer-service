const fs = require('fs');

const writeFile = (path, content) => {
  fs.writeFileSync(path, content, { encoding: 'utf8' });
};

writeFile('src/App.jsx', `import { useState, useRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble.jsx";
import OrderSelectorModal from "./components/OrderSelectorModal.jsx";
import LogisticsCard from "./components/LogisticsCard.jsx";
function App() {
  const [messages, setMessages] = useState([{ id: 1, type: "ai", content: "您好！我是群接龙 AI 客服，很高兴为您服务~" }]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orders, setOrders] = useState({ recent: [], all: [] });
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { id: Date.now(), type: "user", content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] })
      });
      const data = await response.json();
      let replyContent = data.reply;
      let action = null;
      try { const parsed = JSON.parse(data.reply); action = parsed.action; replyContent = parsed.message || "请选择您的订单"; } catch {}
      setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: replyContent, action }]);
      if (action === "show_orders") {
        const ordersResponse = await fetch("/api/orders?userId=1");
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setTimeout(() => setShowOrderModal(true), 300);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: "ai", content: "抱歉，系统暂时无法响应~" }]);
    } finally { setIsLoading(false); }
  };
  const handleOrderSelect = async (order) => {
    setShowOrderModal(false);
    try {
      const response = await fetch("/api/logistics/" + order.id);
      const logistics = await response.json();
      setMessages(prev => [...prev, { id: Date.now(), type: "ai", content: "", logistics }]);
    } catch (error) { console.error("Error:", error); }
  };
  return (<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: "667px" }}>
      <div className="bg-green-500 text-white px-6 py-4 text-center shadow-md"><h1 className="text-lg font-semibold">群接龙 AI 客服</h1></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (<MessageBubble key={msg.id} message={msg}/>))}
        {isLoading && (<div className="flex justify-start"><div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3"><div className="flex gap-2"><span className="loading-dot w-2 h-2 bg-green-500 rounded-full"></span><span className="loading-dot w-2 h-2 bg-green-500 rounded-full"></span><span className="loading-dot w-2 h-2 bg-green-500 rounded-full"></span></div></div></div>)}
        <div ref={messagesEndRef}/>
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex gap-3">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter") handleSend(); }} placeholder="输入您的问题..." className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-green-500"/>
          <button onClick={handleSend} disabled={isLoading || !inputValue.trim()} className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 disabled:opacity-50">➤</button>
        </div>
      </div>
    </div>
    {showOrderModal && (<OrderSelectorModal recentOrders={orders.recent} allOrders={orders.all} onSelect={handleOrderSelect} onClose={() => setShowOrderModal(false)}/>)}
  </div>);
}
export default App;
`);

writeFile('src/components/MessageBubble.jsx', `import LogisticsCard from "./LogisticsCard.jsx";
function MessageBubble({ message }) {
  const isUser = message.type === "user";
  return (<div className={"flex " + (isUser ? "justify-end" : "justify-start") + " animate-fade-in"}>
    <div className={"max-w-[85%] rounded-2xl px-4 py-3 " + (isUser ? "bg-green-500 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md")}>
      {message.logistics ? (<LogisticsCard logistics={message.logistics}/>) : (<p className="text-sm leading-relaxed">{message.content}</p>)}
      {!isUser && !message.logistics && (<button onClick={() => alert("正在为您转接人工客服...")} className="mt-2 text-green-500 text-xs flex items-center gap-1 hover:underline">
        <span>👉</span> 转人工客服
      </button>)}
    </div>
  </div>);
}
export { MessageBubble as default };
`);

writeFile('src/components/OrderCard.jsx', `function OrderCard({ order, onSelect }) {
  const statusColors = { shipping: "bg-yellow-100 text-yellow-700", delivered: "bg-green-100 text-green-700", pending: "bg-gray-100 text-gray-700" };
  return (<div onClick={() => onSelect(order)} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
    <img src={order.thumbnail} alt={order.productName} className="w-16 h-16 rounded-lg object-cover"/>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{order.productName}</p>
      <p className="text-xs text-gray-500 mt-1">{order.date}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-green-600 font-semibold">¥" + "{order.price.toFixed(2)}</span>
        <span className={"text-xs px-2 py-1 rounded-full " + (statusColors[order.status] || statusColors.pending)}>{order.statusText}</span>
      </div>
    </div>
  </div>);
}
export { OrderCard as default };
`);

writeFile('src/components/OrderSelectorModal.jsx', `import { useState } from "react";
import OrderCard from "./OrderCard.jsx";
function OrderSelectorModal({ recentOrders, allOrders, onSelect, onClose }) {
  const [showAll, setShowAll] = useState(false);
  const ordersToShow = showAll ? allOrders : recentOrders;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[70vh] overflow-y-auto animate-fade-slide-up">
      <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">{showAll ? "所有订单" : "最近订单"}</h3>
        <button onClick={onClose} className="text-gray-400 text-2xl leading-5 hover:text-gray-600">&times;</button>
      </div>
      <div className="p-3">
        {ordersToShow.map(order => (<OrderCard key={order.id} order={order} onSelect={onSelect}/>))}
        {!showAll && allOrders.length > recentOrders.length && (<button onClick={() => setShowAll(true)} className="w-full text-center text-green-600 py-2 text-sm border-t mt-2 hover:bg-gray-50 transition-colors">
          + 查看全部订单 ({allOrders.length})
        </button>)}
      </div>
    </div>
  </div>);
}
export { OrderSelectorModal as default };
`);

writeFile('src/components/LogisticsCard.jsx', `function LogisticsCard({ logistics }) {
  const handleViewDetails = () => { window.open("http://localhost:3001/logistics/" + logistics.orderId, "_blank"); };
  return (<div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
    <div className="p-3 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">📦</span>
        <div>
          <p className="font-medium text-sm">{logistics.carrier}</p>
          <p className="text-xs text-gray-500">运单号：{logistics.trackingNumber}</p>
        </div>
      </div>
      <span className={"text-xs px-2 py-1 rounded-full " + (logistics.status === "shipping" ? "bg-yellow-100 text-yellow-700" : logistics.status === "delivered" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>{logistics.status}</span>
    </div>
    <div className="p-3">
      <div className="relative pl-4">
        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-green-200"></div>
        {logistics.events.slice(0, 3).map((event, index) => (<div key={index} className="relative mb-3 last:mb-0">
          <div className={"absolute left-0 top-1 w-2 h-2 rounded-full border-2 " + (index === 0 ? "bg-green-500 border-green-500" : "bg-white border-green-300")}></div>
          <div className="ml-3">
            <p className="text-xs text-gray-400">{event.time}</p>
            <p className="text-sm font-medium">{event.location}</p>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
        </div>))}
      </div>
      {logistics.estimatedDelivery && logistics.status === "shipping" && (<div className="mt-3 p-2 bg-green-50 rounded-lg text-green-700 text-xs text-center">预计送达：{logistics.estimatedDelivery}</div>)}
      {logistics.deliveredTime && logistics.status === "delivered" && (<div className="mt-3 p-2 bg-gray-50 rounded-lg text-gray-600 text-xs text-center">签收时间：{logistics.deliveredTime}</div>)}
    </div>
    <button onClick={handleViewDetails} className="w-full py-2 text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-1">
      <span>查看完整物流轨迹</span>
      <span>→</span>
    </button>
  </div>);
}
export { LogisticsCard as default };
`);

writeFile('index.html', '<!DOCTYPE html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>群接龙 AI 客服</title>\n    <script src="https://cdn.tailwindcss.com"></script>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>');

console.log('中文界面已更新！');
