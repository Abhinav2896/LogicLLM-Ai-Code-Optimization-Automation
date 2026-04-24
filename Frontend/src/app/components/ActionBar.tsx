//Backend details
//Component: ActionBar
//Purpose: Handles Clear, Try Sample Code, and Analyze actions
//Backend Connected: YES (indirect via App.tsx)
//Backend Function ID: FN-004 (via handleAnalyze in App.tsx)
//API Endpoint: POST /api/analyze (triggered via App.tsx)
//Trigger: Button clicks - onClear, onSample, onAnalyze
//Input: loading (boolean), onClear (function), onSample (function), onAnalyze (function), hasCode (boolean)
//Process: onAnalyze triggers App.tsx handleAnalyze which calls POST /api/analyze
//Output: Renders action buttons; state changes handled by parent
//Notes: Action buttons control frontend state; only onAnalyze triggers backend call to FN-004
import React from 'react';
import { Trash2, Lightbulb, Play, Zap, Loader2 } from 'lucide-react';

interface ActionBarProps {
  loading: boolean;
  onClear: () => void;
  onSample: () => void;
  onAnalyze: () => void;
  hasCode: boolean;
}

export default function ActionBar({ loading, onClear, onSample, onAnalyze, hasCode }: ActionBarProps) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={onClear}
          disabled={loading || !hasCode}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-800 rounded-xl text-[13px] transition-all duration-150 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-700 flex-1 sm:flex-none"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
        
        <button
          onClick={onSample}
          disabled={loading}
          title="Load a sample to try the reviewer"
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-transparent sm:bg-gray-800/50 border border-gray-700 text-blue-400 hover:bg-gray-800 hover:text-blue-300 rounded-xl text-[13px] transition-all duration-150 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1 sm:flex-none group"
        >
          <Lightbulb className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
          <span className="hidden sm:inline">Try Sample</span>
          <span className="sm:hidden">Sample</span>
        </button>
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading || !hasCode}
        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 text-white font-semibold text-[14px] rounded-xl transition-all duration-200 shadow-none hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5" />
            Analyze Code
          </>
        )}
      </button>
    </div>
  );
}
