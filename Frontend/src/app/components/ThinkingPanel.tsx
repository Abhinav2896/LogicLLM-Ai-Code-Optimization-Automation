//Backend details
//Component: ThinkingPanel
//Purpose: Displays AI thinking simulation during loading state
//Backend Connected: NO (purely visual state display)
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: Rendered when loading prop is true in OutputPanel
//Input: processingStep (string)
//Process: Renders loading animation and skeleton blocks during backend call
//Output: Renders animated loading UI with processing step text
//Notes: No backend connection; purely visual placeholder while waiting for API response
import React from 'react';
import { Loader2 } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface ThinkingPanelProps {
  processingStep: string;
}

export default function ThinkingPanel({ processingStep }: ThinkingPanelProps) {
  return (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
      <div className="flex flex-col items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
          <span className="text-sm text-gray-300 transition-all duration-300">
            {processingStep || "Starting analysis..."}
          </span>
        </div>
        <div className="text-gray-500 animate-pulse tracking-[0.3em] font-bold">· · ·</div>
      </div>
      
      <SkeletonLoader />
      
      <div className="text-center mt-6">
        <p className="text-[12px] text-gray-600">🤖 AI is reviewing your code...</p>
      </div>
    </div>
  );
}
