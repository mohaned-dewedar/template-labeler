import React, { useState } from "react"; 
import { Upload, Video, Archive, ArrowRight } from "lucide-react";

export default function UploadForm({ inputType, setInputType, onUploadSubmit }) {
    const [contentFile, setContentFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);

  const handleSubmit = () => {
    if (!contentFile || !templateFile) {
      alert("Please select both files"); // Or a more refined UI notification
      return;
    }
    // Call the parent's handler with the files
    onUploadSubmit(contentFile, templateFile);
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Frame Review Tool
          </h1>
          <p className="text-purple-200 text-lg">
            Upload your content and start reviewing frames with AI-powered assistance
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-6">
            {/* Input Type Selector */}
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

            {/* File Inputs */}
            <div className="space-y-4">
              <div className="block text-white text-lg font-medium">
                {inputType === "video" ? "Select Video File" : "Select ZIP File"}
              </div>
              <div className="relative">
                <input
                   type="file"
                    accept={inputType === "video" ? "video/*" : ".zip"}
                    onChange={(e) => setContentFile(e.target.files[0])} // Add onChange
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="block text-white text-lg font-medium">Template Image</div>
              <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTemplateFile(e.target.files[0])} // Add onChange
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all duration-200"
                />
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleSubmit} // Call internal handleSubmit
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
