import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import UploadForm from "./components/UploadForm";
import Review from "./components/Review";
import CompleteScreen from "./components/CompleteScreen";



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

  const handleUpload = async (contentFile, templateFile) => {

    
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
    return <Loader />;
  }

  if (step === "upload") {
  return (
    <UploadForm
      inputType={inputType}
      setInputType={setInputType}
      onUploadSubmit={handleUpload}
    />
  );
}


  if (step === "review") {
    const progress = ((index / total) * 100).toFixed(1);
    return (
      <Review
        imgData={imgData}
        index={index}
        total={total}
        progress={progress}
        act={act}
      />
    );
  
  }

 return <CompleteScreen onRestart={() => setStep("upload")} />;
    
}

export default App;