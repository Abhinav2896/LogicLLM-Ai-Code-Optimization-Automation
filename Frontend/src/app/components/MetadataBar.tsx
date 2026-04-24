//Backend details
//Component: MetadataBar
//Purpose: Displays language, score, time taken, and action buttons (reanalyze/clear)
//Backend Connected: YES (receives metadata from backend)
//Backend Function ID: FN-006 (via metadata from POST /api/analyze response)
//API Endpoint: POST /api/analyze
//Trigger: Receives metadata object from parent (OutputPanel) which originates from backend response
//Input: metadata (object with language, score, time), onReanalyze, onClearResults
//Process: Displays metadata badges; score color is calculated based on value (green/amber/red)
//Output: Renders metadata badges with appropriate colors and action buttons
//Notes: Receives data from FN-006 response parser; metadata is extracted separately from result
import React from 'react';
import { Code2, BarChart2, Clock, RefreshCw, X } from 'lucide-react';

interface Metadata {
  language: string;
  score: number;
  time: string;
}

interface MetadataBarProps {
  metadata: Metadata | null;
  onReanalyze: () => void;
  onClearResults: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return {
    text: "text-green-400",
    bg: "bg-green-900/40",
    border: "border-green-800/50"
  };
  if (score >= 50) return {
    text: "text-amber-400",
    bg: "bg-amber-900/40",
    border: "border-amber-800/50"
  };
  return {
    text: "text-red-400",
    bg: "bg-red-900/40",
    border: "border-red-800/50"
  };
};

export default function MetadataBar({ metadata, onReanalyze, onClearResults }: MetadataBarProps) {
  if (!metadata) return null;

  const scoreColors = getScoreColor(metadata.score);

  return (
    <div className="flex flex-row justify-between items-center mb-4 gap-3 flex-wrap">
      <div className="flex flex-row gap-3 flex-wrap items-center">
        <div className="flex items-center bg-blue-900/40 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-800/50">
          <Code2 className="w-2.5 h-2.5 mr-1" />
          <span>Detected: {metadata.language}</span>
        </div>

        <div className={`flex items-center ${scoreColors.bg} ${scoreColors.text} ${scoreColors.border} text-xs px-3 py-1 rounded-full border`}>
          <BarChart2 className="w-2.5 h-2.5 mr-1" />
          <span>Score: {metadata.score}/100</span>
        </div>

        <div className="flex items-center bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
          <Clock className="w-2.5 h-2.5 mr-1" />
          <span>Time: {metadata.time}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onReanalyze}
          className="flex items-center gap-1 text-gray-500 hover:text-white text-xs transition-colors duration-150 bg-transparent hover:bg-white/5 px-2 py-1 rounded-md"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Re-analyze</span>
        </button>
        
        <button
          onClick={onClearResults}
          className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-xs transition-colors duration-150 bg-transparent hover:bg-white/5 px-2 py-1 rounded-md"
        >
          <X className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
