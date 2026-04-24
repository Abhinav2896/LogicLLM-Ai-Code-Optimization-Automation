//Backend details
//Component: BugsSection
//Purpose: Displays list of bugs found in the code with red accent styling
//Backend Connected: YES (receives data from backend)
//Backend Function ID: FN-006 (via result.bugs from POST /api/analyze)
//API Endpoint: POST /api/analyze
//Trigger: Receives bugs array from parent (OutputPanel) which originates from backend response
//Input: bugs (string[])
//Process: Maps through bugs array and renders each bug with line number parsing
//Output: Renders bugs list with red accent; shows "No bugs" message if array is empty
//Notes: Receives data from FN-006 response parser; line numbers are parsed from bug strings
import React from 'react';
import { Bug, CheckCircle2 } from 'lucide-react';
import ResultSection from './ResultSection';

interface BugsSectionProps {
  bugs: string[];
}

export default function BugsSection({ bugs }: BugsSectionProps) {
  const hasBugs = bugs && bugs.length > 0;

  return (
    <ResultSection
      title="Bugs Found"
      icon={<Bug className="w-3.5 h-3.5" />}
      accentColorClass="text-red-400"
      accentBorderClass="border-l-red-500"
      delayClass="[animation-delay:0ms]"
      badge={
        hasBugs && (
          <span className="bg-red-900/40 text-red-400 text-xs rounded-md px-2 py-0.5">
            {bugs.length} issue(s)
          </span>
        )
      }
    >
      {hasBugs ? (
        <ul className="space-y-2.5 mt-2">
          {bugs.map((bug, i) => {
            const lineMatch = bug.match(/^(Line \d+:?)(.*)/i);
            return (
              <li
                key={i}
                className="flex items-start gap-2 p-1.5 -mx-1.5 hover:bg-white/5 rounded-lg transition-colors duration-150"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <div className="text-[13px] sm:text-sm text-gray-300 leading-relaxed">
                  {lineMatch ? (
                    <>
                      <span className="text-red-400 font-mono text-xs font-medium mr-1.5">{lineMatch[1]}</span>
                      {lineMatch[2]}
                    </>
                  ) : (
                    <span>{bug}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center gap-2 text-green-400 text-sm mt-2 p-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>✅ No bugs detected — your code looks clean!</span>
        </div>
      )}
    </ResultSection>
  );
}
