//Backend details
//Component: OptimizedCode
//Purpose: Displays optimized code block with copy functionality and violet accent styling
//Backend Connected: YES (receives data from backend)
//Backend Function ID: FN-006 (via result.optimized_code from POST /api/analyze)
//API Endpoint: POST /api/analyze
//Trigger: Receives optimized_code string from parent (OutputPanel) which originates from backend response
//Input: code (string)
//Process: Renders code block with copy-to-clipboard functionality
//Output: Renders code block with violet accent; copy button triggers clipboard write
//Notes: Receives data from FN-006 response parser; has local copy state (not backend connected)
import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import ResultSection from './ResultSection';

interface OptimizedCodeProps {
  code: string;
}

export default function OptimizedCode({ code }: OptimizedCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ResultSection
      title="Optimized Code"
      icon={<Sparkles className="w-3.5 h-3.5" />}
      accentColorClass="text-violet-400"
      accentBorderClass="border-l-violet-500"
      delayClass="[animation-delay:225ms]"
    >
      {!code ? (
        <p className="text-gray-500 italic text-center py-4 text-[13px]">
          No optimized version was returned for this code.
        </p>
      ) : (
        <div className="relative mt-2">
          <div className="flex justify-end mb-2 absolute right-2 top-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all duration-200 shadow-sm ${
                copied
                  ? 'bg-green-900/40 text-green-400'
                  : 'bg-gray-700/60 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 pt-10 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <pre className="font-mono text-[12px] sm:text-[13px] text-green-400 leading-relaxed whitespace-pre-wrap break-words">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </ResultSection>
  );
}
