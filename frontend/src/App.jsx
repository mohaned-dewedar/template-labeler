import React, { useState, useEffect } from "react";
import { Upload, Video, Archive, Download, Check, X, ArrowRight } from "lucide-react";

function App() {
  const [step, setStep] = useState("upload");
  const [imgData, setImgData] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [inputType, setInputType] = useState("video");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (step !== "review") return;
      if (e.key.toLowerCase() === "a") act("accept");
      if (e.key.toLowerCase() === "p") act("pass");
      if (e.key.toLowerCase() === "d") act("decline");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  const handleUpload = async () => {
    const contentFile = document.getElementById("contentFile").files[0];
    const templateFile = document.getElementById("templateFile").files[0];
    
    if (!contentFile || !templateFile) {
      alert("Please select both files");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append(inputType === "video" ? "video" : "zip", contentFile);
    formData.append("template", templateFile);
    formData.append("inputType", inputType);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTotal(data.total);
      await fetchFrame();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFrame = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/frame");
      const data = await res.json();
      if (data.done) {
        setStep("complete");
      } else {
        setImgData(data.img_data);
        setIndex(data.index + 1);
        setTotal(data.total);
        setStep("review");
      }
    } catch (err) {
      console.error("Frame fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const act = async (action) => {
    setLoading(true);
    try {
      await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchFrame();
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (step === "upload") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Frame Review Tool
            </h1>
            <p className="text-purple-200 text-lg">Upload your content and start reviewing frames with AI-powered assistance</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="block text-white text-lg font-medium">Choose Input Type</div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`relative cursor-pointer transition-all duration-300 ${
                      inputType === "video" 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 scale-105" 
                        : "bg-white/10 hover:bg-white/20"
                    } rounded-2xl p-6 border border-white/20 hover:border-purple-400/50`}
                    onClick={() => setInputType("video")}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Video className="w-8 h-8 text-white" />
                      <span className="text-white font-medium">Video File</span>
                    </div>
                  </div>
                  
                  <div
                    className={`relative cursor-pointer transition-all duration-300 ${
                      inputType === "zip" 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 scale-105" 
                        : "bg-white/10 hover:bg-white/20"
                    } rounded-2xl p-6 border border-white/20 hover:border-purple-400/50`}
                    onClick={() => setInputType("zip")}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Archive className="w-8 h-8 text-white" />
                      <span className="text-white font-medium">ZIP Folder</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="block text-white text-lg font-medium">
                  {inputType === "video" ? "Select Video File" : "Select ZIP File"}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept={inputType === "video" ? "video/*" : ".zip"}
                    id="contentFile"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="block text-white text-lg font-medium">Template Image</div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="templateFile"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                onClick={handleUpload}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Start Review</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "review") {
    const progress = ((index / total) * 100).toFixed(1);
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/25">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Review Complete!</h2>
          <p className="text-purple-200 text-lg">Your frame review has been completed successfully.</p>
        </div>
        
        <a
          href="/api/download"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>Download Accepted Images</span>
        </a>
      </div>
    </div>
  );
}

export default App;