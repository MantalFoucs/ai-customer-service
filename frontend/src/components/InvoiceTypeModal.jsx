function InvoiceTypeModal({ onSelect, onClose, onBack }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-[393px] max-h-[70vh] overflow-y-auto animate-fade-slide-up" style={{ boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.15)" }}>
        <div className="sticky top-0 bg-white/95 backdrop-blur p-5 border-b border-gray-100 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </button>
          <h3 className="font-semibold text-gray-800">选择发票类型</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3">
          <button
            onClick={() => onSelect("personal")}
            className="w-full p-4 bg-blue-50 rounded-xl hover:bg-blue-100 border border-blue-100 transition-all duration-200 text-left active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-700">个人电子发票</p>
                <p className="text-sm text-gray-500">适用于个人消费</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => onSelect("company")}
            className="w-full p-4 bg-green-50 rounded-xl hover:bg-green-100 border border-green-100 transition-all duration-200 text-left active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-700">企业电子发票</p>
                <p className="text-sm text-gray-500">适用于企业报销</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTypeModal;
