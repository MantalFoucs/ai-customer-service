function RefundReasonModal({ reasons, onSelect, onClose }) {
  const iconMap = {
    "X": "❌",
    "Clock": "⏰",
    "Think": "🤔",
    "Broken": "💔",
    "Doc": "📝",
    "Help": "❓"
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-[393px] max-h-[70vh] overflow-y-auto animate-fade-slide-up" style={{ boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.15)" }}>
        <div className="sticky top-0 bg-white/95 backdrop-blur p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">选择退款原因</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => onSelect(reason)}
                className="p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:border-red-200 border border-transparent transition-all duration-200 text-left group active:scale-[0.98]"
              >
                <span className="text-xl block mb-2">{iconMap[reason.icon] || "❓"}</span>
                <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">{reason.reason}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundReasonModal;
