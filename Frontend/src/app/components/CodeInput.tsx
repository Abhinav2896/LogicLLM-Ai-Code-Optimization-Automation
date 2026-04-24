//Backend details
//Component: CodeInput
//Purpose: Handles the textarea for code input and the line/character counter
//Backend Connected: NO
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: User types in textarea; onChange event triggers state update in parent (App.tsx)
//Input: code (string), setCode (function), disabled (boolean)
//Process: Forwards user input to parent state via setCode; calculates line/char counts locally
//Output: Renders textarea with code content and statistics
//Notes: No direct backend connection; parent component (App.tsx) manages API calls
import React from 'react';

interface CodeInputProps {
  code: string;
  setCode: (val: string) => void;
  disabled: boolean;
}

export default function CodeInput({ code, setCode, disabled }: CodeInputProps) {
  const lineCount = code === "" ? 0 : code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col flex-1 w-full relative">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={disabled}
        placeholder={`// Paste your code here...\n// JavaScript, Python, TypeScript, C++, Java, and more\n// AI will automatically detect the language`}
        className="w-full min-h-[340px] max-h-[500px] flex-1 bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 sm:p-5 font-mono text-[13px] sm:text-[14px] leading-[1.7] text-[#E2E8F0] resize-y outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none placeholder:text-gray-600 placeholder:italic caret-blue-500 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        spellCheck="false"
      />
      <div className="text-right mt-2 text-[11px] text-gray-600">
        {lineCount} lines &middot; {charCount} characters
      </div>
    </div>
  );
}
