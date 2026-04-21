function OrderCard({ order, onSelect }) {
  const statusColors = {
    shipping: "bg-blue-100 text-blue-600",
    delivered: "bg-emerald-100 text-emerald-600",
    pending: "bg-gray-100 text-gray-600"
  };

  return (
    <button
      onClick={() => onSelect(order)}
      className="w-full flex gap-4 p-4 bg-white/80 backdrop-blur rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-left border border-white/60 active:scale-[0.99]"
    >
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
        <img src={order.thumbnail} alt={order.productName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{order.productName}</p>
        <p className="text-xs text-gray-400 mt-0.5">订单号：{order.id}</p>
        <p className="text-sm text-gray-600 mt-1">¥{order.price.toFixed(2)}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[order.status] || statusColors.pending}`}>
            {order.statusText}
          </span>
          <span className="text-xs text-gray-400">{order.date}</span>
        </div>
      </div>
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default OrderCard;
