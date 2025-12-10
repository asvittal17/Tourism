import React from "react";

export default function DestinationCard({ dest, onView }) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full aspect-video sm:aspect-[4/3] overflow-hidden">
        <img 
          src={dest.image} 
          alt={dest.title} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
        <div className="absolute left-2 sm:left-3 bottom-2 sm:bottom-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-lg">
          📍 {dest.location}
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white line-clamp-1">{dest.title}</h3>
          <div className="text-xs sm:text-sm text-amber-500 font-semibold flex items-center gap-1">
            ★ {dest.rating}
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3">{dest.description}</p>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-sky-400">₹ {dest.price?.toLocaleString()}</div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onView}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              View
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium">
              Book
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
