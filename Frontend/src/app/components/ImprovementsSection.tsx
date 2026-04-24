//Backend details
//Component: ImprovementsSection
//Purpose: Displays suggestions/improvements list with amber accent styling
//Backend Connected: YES (receives data from backend)
//Backend Function ID: FN-006 (via result.improvements from POST /api/analyze)
//API Endpoint: POST /api/analyze
//Trigger: Receives improvements array from parent (OutputPanel) which originates from backend response
//Input: improvements (string[])
//Process: Maps through improvements array and renders each with line number parsing
//Output: Renders improvements list with amber accent; shows "well-structured" message if empty
//Notes: Receives data from FN-006 response parser; line numbers are parsed from strings
import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import ResultSection from './ResultSection';

interface ImprovementsSectionProps {
  improvements: string[];
}

export default function ImprovementsSection({ improvements }: ImprovementsSectionProps) {
  const hasImprovements = improvements && improvements.length > 0;

  return (
    <ResultSection
      title="Suggestions & Improvements"
      icon={<Lightbulb className="w-3.5 h-3.5" />}
      accentColorClass="text-amber-400"
      accentBorderClass="border-l-amber-500"
      delayClass="[animation-delay:75ms]"
      badge={
        hasImprovements && (
          <span className="bg-amber-900/40 text-amber-400 text-xs rounded-md px-2 py-0.5">
            {improvements.length} suggestion(s)
          </span>
        )
      }
    >
      {hasImprovements ? (
        <ul className="space-y-2.5 mt-2">
          {improvements.map((imp, i) => {
            const lineMatch = imp.match(/^(Line \d+:?)(.*)/i);
            return (
              <li
                key={i}
                className="flex items-start gap-2 p-1.5 -mx-1.5 hover:bg-white/5 rounded-lg transition-colors duration-150"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div className="text-[13px] sm:text-sm text-gray-300 leading-relaxed">
                  {lineMatch ? (
                    <>
                      <span className="text-amber-400 font-mono text-xs font-medium mr-1.5">{lineMatch[1]}</span>
                      {lineMatch[2]}
                    </>
                  ) : (
                    <span>{imp}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center gap-2 text-green-400 text-sm mt-2 p-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>✅ Code is already well-structured — no improvements needed!</span>
        </div>
      )}
    </ResultSection>
  );
}
