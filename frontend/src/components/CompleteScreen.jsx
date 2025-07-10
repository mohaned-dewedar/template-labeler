import React from "react";
import {Download, Check , RotateCcw } from "lucide-react";

export default function CompleteScreen({ onRestart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/25">
          <Check className="w-12 h-12 text-white" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Review Complete!</h2>
          <p className="text-purple-200 text-lg">
            Your frame review has been completed successfully.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/api/download"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <span>Download Accepted Images</span>
          </a>

          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-2 bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
}
