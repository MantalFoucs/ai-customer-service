import { useState, useEffect } from "react";

function ProgressModal({ type, onClose }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetch("/api/progress/" + type)
      .then(res => res.json())
      .then(data => setProgress(data));
  }, [type]);

  const title = type === "refund" ? "退款进度" : "开票进度";
  const icon = type === "refund" ? "💰" : "🧾";
  const colorClass = type === "refund" ? "text-orange-600" : "text-blue-600";
  const bgColorClass = type === "refund" ? "bg-orange-50" : "bg-blue-50";
  const borderColorClass = type === "refund" ? "border-orange-200" : "border-blue-200";
  const circleBgClass = type === "refund" ? "bg-orange-100" : "bg-blue-100";
  const circleColorClass = type === "refund" ? "text-orange-500" : "text-blue-500";

  if (!progress) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50">
        <div className="bg-white rounded-t-3xl w-full max-w-[393px] p-4 animate-fade-slide-up">
          <div className="flex justify-center items-center py-8">
            <div className="flex gap-2">
              <span className="loading-dot w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="loading-dot w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="loading-dot w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-[393px] max-h-[70vh] overflow-y-auto animate-fade-slide-up" style={{ boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.15)" }}>
        <div className="sticky top-0 bg-white/95 backdrop-blur p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{icon} {title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <div className={`${bgColorClass} rounded-xl p-4 mb-4 border ${borderColorClass}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">当前状态</span>
              <span className={`font-medium ${colorClass}`}>{progress.status}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">当前步骤</span>
              <span className="font-medium text-gray-800">{progress.step}</span>
            </div>
            {progress.estimated && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">预计时间</span>
                <span className="font-medium text-gray-800">{progress.estimated}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">进度详情</h4>
            {progress.timeline && progress.timeline.length > 0 ? (
              <div className="relative">
                {progress.timeline.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full ${item.done ? circleBgClass : "bg-gray-100"} flex items-center justify-center`}>
                        {item.done ? (
                          <svg className={`w-4 h-4 ${circleColorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      {index < progress.timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[40px] ${item.done ? circleColorClass.replace("text-", "bg-") : "bg-gray-200"}`}></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${item.done ? "text-gray-800" : "text-gray-400"}`}>
                        {item.status}
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">暂无进度信息</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressModal;
