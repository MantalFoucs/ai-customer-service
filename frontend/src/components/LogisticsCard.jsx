function LogisticsCard({ logistics }) {
  const handleViewDetails = () => {
    window.open("http://localhost:3001/logistics/" + logistics.orderId, "_blank");
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl rounded-bl-sm shadow-sm border border-white/60 overflow-hidden">
      <div className="p-4 border-b border-gray-100/50">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-800">物流信息</span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${logistics.status === "运输中" ? "bg-blue-100 text-blue-600" : logistics.status === "已签收" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>
            {logistics.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{logistics.carrier}</span>
          <span className="text-gray-500">{logistics.trackingNumber}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="border-l-2 border-emerald-400 pl-4 space-y-4">
          {logistics.events && logistics.events.map((event, index) => (
            <div key={index} className={index === 0 ? "font-medium" : ""}>
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{event.description}</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{event.location}</span>
                <span>{event.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        {logistics.estimatedDelivery && logistics.status === "运输中" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">预计送达：{logistics.estimatedDelivery}</span>
            </div>
          </div>
        )}
        
        {logistics.deliveredTime && logistics.status === "已签收" && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">签收时间：{logistics.deliveredTime}</span>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleViewDetails}
        className="w-full py-3.5 bg-gray-50/80 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        查看完整轨迹
      </button>
    </div>
  );
}

export default LogisticsCard;
