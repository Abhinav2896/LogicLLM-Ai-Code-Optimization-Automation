//Backend details
//Component: Header
//Purpose: Displays the app title, icon, subtitle, and powered-by badge
//Backend Connected: NO
//Backend Function ID: NONE
//API Endpoint: NONE
//Trigger: Component mounts; purely presentational
//Input: NONE (static content)
//Process: NONE (purely visual component)
//Output: Renders header UI with title and branding
//Notes: No backend connection; serves as app branding/presentation layer
import React from 'react';
import { Code2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 w-full max-w-7xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center p-2.5 shadow-[0_0_20px_rgba(99,102,241,0.4)] shrink-0 mt-1">
          <Code2 className="w-full h-full text-white" />
        </div>
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent leading-tight tracking-tight">
            LogicLLM
          </h1>
          <p className="text-[14px] sm:text-[15px] text-gray-400 mt-1.5 font-normal">
            Paste your code. AI detects the language and reviews instantly.
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center">
        <div className="border border-gray-700 text-gray-500 rounded-full px-3 py-1 text-xs">
          Powered by Qwen
        </div>
      </div>
    </header>
  );
}
