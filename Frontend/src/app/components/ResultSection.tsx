//Backend details
//Component: ResultSection
//Purpose: Reusable colored section card for analysis results
//Backend Connected: NO (used by child components)
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: Receives props from parent components (BugsSection, ImprovementsSection, etc.)
//Input: title, icon, accentColorClass, accentBorderClass, badge, children, delayClass
//Process: Wraps child content in styled container with consistent layout
//Output: Renders styled section card with title and content
//Notes: Reusable UI wrapper; actual data comes from backend response via parent components
import React from 'react';

interface ResultSectionProps {
  title: string;
  icon: React.ReactNode;
  accentColorClass: string;
  accentBorderClass: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  delayClass?: string;
}

export default function ResultSection({
  title,
  icon,
  accentColorClass,
  accentBorderClass,
  badge,
  children,
  delayClass = '',
}: ResultSectionProps) {
  return (
    <div
      className={`bg-[#1A2236] border border-[#1E293B] border-l-2 ${accentBorderClass} rounded-xl p-4 mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both ${delayClass}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={accentColorClass}>{icon}</div>
          <h3 className="text-[13px] font-semibold text-white">{title}</h3>
        </div>
        {badge && <div>{badge}</div>}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
