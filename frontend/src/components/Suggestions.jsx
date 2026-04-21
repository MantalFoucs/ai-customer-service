function Suggestions({ suggestions, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-11">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-3.5 py-1.5 bg-white/60 backdrop-blur border border-gray-200/50 text-gray-600 rounded-full text-xs font-medium hover:bg-white hover:border-emerald-200 hover:text-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default Suggestions;
