function Suggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2.5">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="group relative px-4 py-1.75 rounded-full bg-white/60 backdrop-blur-sm border border-gray-100/80 text-xs font-medium text-gray-600 hover:text-teal-600 hover:border-teal-200 hover:bg-white/80 hover:shadow-sm transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {suggestion}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      ))}
    </div>
  );
}

export default Suggestions;
