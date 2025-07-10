import React from "react";

export default function Loader() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6 w-full max-w-2xl px-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
        </div>
        <div className="text-white space-y-2">
          <h2 className="text-2xl font-bold">Processing Frames</h2>
          <p className="text-purple-200">Please wait while we analyze your content...</p>
        </div>
      </div>
    </div>
  );
}
