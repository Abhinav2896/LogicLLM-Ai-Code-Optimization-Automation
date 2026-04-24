//Backend details
//Component: OutputPanel
//Purpose: Wrapper container for all analysis results; manages view modes and orchestrates child components
//Backend Connected: YES (receives data from backend via props from App.tsx)
//Backend Function ID: FN-006 (receives parsed result from App.tsx which calls POST /api/analyze)
//API Endpoint: POST /api/analyze (triggered via App.tsx)
//Trigger: Receives loading, result, metadata from App.tsx; these originate from POST /api/analyze response
//Input: loading, result, metadata, processingStep, viewMode, setViewMode, onDownload, onReanalyze, onClearResults
//Process: Conditionally renders EmptyState/SkeletonLoader/ThinkingPanel/result sections based on state
//Output: Renders appropriate content based on loading/result state; manages formatted vs raw JSON view
//Notes: Central hub for displaying results; result prop contains parsed data from FN-006
import React from 'react';
import { Activity, Download, List, Braces } from 'lucide-react';
import EmptyState from './EmptyState';
import ThinkingPanel from './ThinkingPanel';
import MetadataBar from './MetadataBar';
import BugsSection from './BugsSection';
import ImprovementsSection from './ImprovementsSection';
import ExplanationSection from './ExplanationSection';
import OptimizedCode from './OptimizedCode';

interface OutputPanelProps {
  loading: boolean;
  result: any;
  metadata: any;
  processingStep: string;
  viewMode: 'formatted' | 'raw';
  setViewMode: (mode: 'formatted' | 'raw') => void;
  onDownload: () => void;
  onReanalyze: () => void;
  onClearResults: () => void;
}

export default function OutputPanel({ 
  loading, 
  result, 
  metadata,
  processingStep,
  viewMode, 
  setViewMode, 
  onDownload,
  onReanalyze,
  onClearResults
}: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#111827] border border-[#374151] rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent relative min-h-[500px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Activity className="w-[18px] h-[18px] text-violet-400" />
          <h2 className="text-[15px] font-semibold text-white">Analysis Results</h2>
        </div>

        {result && !loading && (
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-transparent hover:bg-gray-800 text-gray-500 hover:text-gray-300 rounded-md text-[12px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Report
            </button>
            <div className="flex items-center bg-gray-800 rounded-full p-0.5 shadow-inner">
              <button
                onClick={() => setViewMode('formatted')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  viewMode === 'formatted'
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Formatted
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Braces className="w-3.5 h-3.5" />
                Raw JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {loading ? (
          <ThinkingPanel processingStep={processingStep} />
        ) : result && viewMode === 'raw' ? (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 mt-2 max-h-full overflow-y-auto animate-in fade-in duration-400 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <pre className="font-mono text-[12px] text-[#34D399] leading-[1.7] whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : result ? (
          <div className="flex flex-col space-y-3 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <MetadataBar 
              metadata={metadata} 
              onReanalyze={onReanalyze} 
              onClearResults={onClearResults} 
            />
            <BugsSection bugs={result.bugs} />
            <ImprovementsSection improvements={result.improvements} />
            <ExplanationSection explanation={result.explanation} />
            <OptimizedCode code={result.optimized_code} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
