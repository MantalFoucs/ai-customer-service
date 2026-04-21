function CouponListModal({ coupons, onClaim, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-[393px] max-h-[70vh] overflow-y-auto animate-fade-slide-up" style={{ boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.15)" }}>
        <div className="sticky top-0 bg-white/95 backdrop-blur p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">我的优惠券</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div>
                <p className="font-medium text-gray-800">{coupon.name}</p>
                <p className="text-sm text-green-600 font-semibold">{coupon.discount}</p>
                <p className="text-xs text-gray-400">有效期至 {coupon.expire}</p>
              </div>
              <button
                onClick={() => onClaim(coupon)}
                disabled={coupon.status === "claimed"}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  coupon.status === "claimed"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 shadow-md active:scale-[0.97]"
                }`}
              >
                {coupon.status === "claimed" ? "已领取" : "领取"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CouponListModal;
