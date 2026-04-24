//Backend details
//Component: SkeletonLoader
//Purpose: Animated skeleton blocks for the loading state
//Backend Connected: NO
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: Rendered inside ThinkingPanel when loading is true
//Input: NONE (static skeleton structure)
//Process: NONE (purely visual loading indicator)
//Output: Renders animated skeleton UI blocks
//Notes: No backend connection; purely visual placeholder during loading state
import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* Block 1 - Bugs */}
      <div className="bg-gray-800/50 rounded-xl p-4 animate-pulse" style={{ animationDelay: "0ms" }}>
        <div className="w-20 h-2.5 bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[80%] h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[65%] h-2 bg-gray-700/60 rounded"></div>
        </div>
      </div>

      {/* Block 2 - Improvements */}
      <div className="bg-gray-800/50 rounded-xl p-4 animate-pulse" style={{ animationDelay: "100ms" }}>
        <div className="w-28 h-2.5 bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[75%] h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[55%] h-2 bg-gray-700/60 rounded"></div>
        </div>
      </div>

      {/* Block 3 - Explanation */}
      <div className="bg-gray-800/50 rounded-xl p-4 animate-pulse" style={{ animationDelay: "200ms" }}>
        <div className="w-24 h-2.5 bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-700/60 rounded"></div>
          <div className="w-full h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[90%] h-2 bg-gray-700/60 rounded"></div>
          <div className="w-[60%] h-2 bg-gray-700/60 rounded"></div>
        </div>
      </div>

      {/* Block 4 - Optimized Code */}
      <div className="bg-gray-800/50 rounded-xl p-4 animate-pulse" style={{ animationDelay: "300ms" }}>
        <div className="w-32 h-2.5 bg-gray-700 rounded mb-3"></div>
        <div className="h-28 bg-gray-800 rounded-xl border border-gray-700/50"></div>
      </div>
    </div>
  );
}
