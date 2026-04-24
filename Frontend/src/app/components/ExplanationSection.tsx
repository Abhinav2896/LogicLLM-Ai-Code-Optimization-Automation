//Backend details
//Component: ExplanationSection
//Purpose: Displays paragraph explanation of the code with blue accent styling
//Backend Connected: YES (receives data from backend)
//Backend Function ID: FN-006 (via result.explanation from POST /api/analyze)
//API Endpoint: POST /api/analyze
//Trigger: Receives explanation string from parent (OutputPanel) which originates from backend response
//Input: explanation (string)
//Process: Renders explanation text with scrolling if content overflows
//Output: Renders explanation paragraph with blue accent styling
//Notes: Receives data from FN-006 response parser; has max-height with overflow scroll
import React from 'react';
import { BookOpen } from 'lucide-react';
import ResultSection from './ResultSection';

interface ExplanationSectionProps {
  explanation: string;
}

export default function ExplanationSection({ explanation }: ExplanationSectionProps) {
  return (
    <ResultSection
      title="Code Explanation"
      icon={<BookOpen className="w-3.5 h-3.5" />}
      accentColorClass="text-blue-400"
      accentBorderClass="border-l-blue-500"
      delayClass="[animation-delay:150ms]"
    >
      {explanation ? (
        <p className="text-[13px] sm:text-[14px] text-gray-300 leading-[1.75] mt-2 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {explanation}
        </p>
      ) : (
        <p className="text-gray-500 italic text-[13px] mt-2">
          No explanation available for this snippet.
        </p>
      )}
    </ResultSection>
  );
}
