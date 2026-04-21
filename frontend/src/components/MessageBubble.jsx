import LogisticsCard from "./LogisticsCard.jsx";

function MessageBubble({ message }) {
  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-md">
            {message.image && (
              <div className="mb-2 rounded-xl overflow-hidden">
                <img src={message.image} alt="图片" className="max-w-[250px] max-h-[200px] object-contain" />
              </div>
            )}
            {message.video && (
              <div className="mb-2 rounded-xl overflow-hidden relative">
                <video src={message.video} className="max-w-[250px] max-h-[200px] object-contain" controls />
              </div>
            )}
            {message.content && <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">群接龙 AI</span>
          </div>
        </div>
        
        {message.logistics ? (
          <LogisticsCard logistics={message.logistics} />
        ) : (
          <div className="bg-white/70 backdrop-blur rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-white/60">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
