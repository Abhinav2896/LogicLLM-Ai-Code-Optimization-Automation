//Backend details
//Component: EmptyState
//Purpose: Placeholder when no analysis results are available
//Backend Connected: NO
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: Rendered when result is null and loading is false in OutputPanel
//Input: NONE (static content)
//Process: NONE (purely visual placeholder component)
//Output: Renders placeholder UI with feature descriptions
//Notes: No backend connection; shown when no analysis has been performed yet
import React from 'react';
import { Code2 } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px] w-full p-6 animate-in fade-in zoom-in-95 duration-400">
      <div className="bg-gray-800/60 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <Code2 className="w-10 h-10 text-gray-600" />
      </div>
      
      <h3 className="text-base font-medium text-gray-400 mt-3">
        Ready to analyze your code
      </h3>
      
      <p className="text-sm text-gray-600 leading-relaxed max-w-[220px] mx-auto mb-2">
        Paste your code on the left and click Analyze Code to get AI-powered insights, bug detection, and optimization.
      </p>

      <div className="flex flex-row flex-wrap justify-center gap-2 mt-3 max-w-[280px]">
        <span className="bg-gray-800/60 text-gray-500 rounded-full text-xs px-3 py-1 border border-gray-700">
          🐞 Bug Detection
        </span>
        <span className="bg-gray-800/60 text-gray-500 rounded-full text-xs px-3 py-1 border border-gray-700">
          💡 Suggestions
        </span>
        <span className="bg-gray-800/60 text-gray-500 rounded-full text-xs px-3 py-1 border border-gray-700">
          ✨ Optimization
        </span>
      </div>
    </div>
  );
}
