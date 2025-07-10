import React from "react";
import { Check } from "lucide-react";
import { ArrowRight, X } from "lucide-react";

export default function Review({ imgData, index, total, progress, act }) {
  return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Frame Review</h2>
                <p className="text-purple-200">Review each frame and make your decision</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">{index} / {total}</div>
                <div className="text-sm text-purple-200">{progress}% Complete</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                  <img
                    src={`data:image/jpeg;base64,${imgData}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    alt="Current Frame"
                  />
                </div>
              </div>
              
              <div className="lg:w-80 space-y-4">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => act("accept")}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Accept (A)</span>
                    </button>
                    
                    <button
                      onClick={() => act("pass")}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                      <span>Pass (P)</span>
                    </button>
                    
                    <button
                      onClick={() => act("decline")}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Decline (D)</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-3">Keyboard Shortcuts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-purple-200">
                      <span>Accept:</span>
                      <kbd className="bg-white/10 px-2 py-1 rounded">A</kbd>
                    </div>
                    <div className="flex justify-between text-purple-200">
                      <span>Pass:</span>
                      <kbd className="bg-white/10 px-2 py-1 rounded">P</kbd>
                    </div>
                    <div className="flex justify-between text-purple-200">
                      <span>Decline:</span>
                      <kbd className="bg-white/10 px-2 py-1 rounded">D</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}