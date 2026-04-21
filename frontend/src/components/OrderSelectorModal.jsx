import { useState } from "react";

function OrderSelectorModal({ title, recentOrders, allOrders, onSelect, onClose }) {
  const [showAll, setShowAll] = useState(false);

  const ordersToShow = showAll ? allOrders : recentOrders;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-[393px] max-h-[70vh] overflow-hidden animate-fade-slide-up">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-4 border-b border-gray-100 flex justify-between items-center">
          <button onClick={onClose} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </button>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setShowAll(false)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${!showAll ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            最近订单
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${showAll ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            全部订单
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3">
          {ordersToShow.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">暂无订单</p>
            </div>
          ) : (
            ordersToShow.map((order) => (
              <button
                key={order.id}
                onClick={() => onSelect(order)}
                className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-3 flex gap-3 transition-colors text-left"
              >
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                  {order.image ? (
                    <img src={order.image} alt={order.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate mb-1">{order.productName}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{order.id}</span>
                    <span className="text-sm font-semibold text-teal-600">¥{order.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      order.status === 'refunded' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.statusText}
                    </span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSelectorModal;
