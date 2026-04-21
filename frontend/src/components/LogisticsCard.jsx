function LogisticsCard({ logistics }) {
  const handleViewDetails = () => {
    window.open("http://localhost:3001/logistics/" + logistics.orderId, "_blank");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "运输中":
        return "bg-blue-500";
      case "已签收":
        return "bg-emerald-500";
      case "待发货":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "运输中":
        return "bg-blue-50";
      case "已签收":
        return "bg-emerald-50";
      case "待发货":
        return "bg-gray-50";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "运输中":
        return "text-blue-600";
      case "已签收":
        return "text-emerald-600";
      case "待发货":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl rounded-bl-sm shadow-card overflow-hidden border border-white/50">
      <div className="p-4 border-b border-gray-100/80">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-800">物流信息</span>
          <span className={`text-xs px-3 py-1.5 rounded-full ${getStatusBgColor(logistics.status)} ${getStatusTextColor(logistics.status)} font-medium`}>
            {logistics.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>{logistics.carrier}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{logistics.trackingNumber}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-teal-300 to-teal-100"></div>
          
          <div className="space-y-4">
            {logistics.events && logistics.events.map((event, index) => (
              <div key={index} className={`relative pl-7 ${index === 0 ? "font-medium" : ""}`}>
                <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? `${getStatusColor(logistics.status)}` : "bg-white border-2 border-teal-200"}`}>
                  {index === 0 ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-300"></div>
                  )}
                </div>
                
                <div className="bg-gray-50/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${index === 0 ? "text-gray-900" : "text-gray-600"}`}>{event.description}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {logistics.estimatedDelivery && logistics.status === "运输中" && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-700">预计送达</div>
                <div className="text-xs text-blue-500">{logistics.estimatedDelivery}</div>
              </div>
            </div>
          </div>
        )}
        
        {logistics.deliveredTime && logistics.status === "已签收" && (
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-700">已签收</div>
                <div className="text-xs text-emerald-500">签收时间：{logistics.deliveredTime}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleViewDetails}
        className="w-full py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-2 text-teal-600 text-sm font-semibold"
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
