import React from "react";
import { useFileContext } from "../context/FileContext";

const ProgressBar = () => {
  const { uploadProgress } = useFileContext();
  return (
    <div>
      {uploadProgress > 0 && (
        <div className="w-80 border-2 relative mb-12 rounded-md bg-slate-100">
          <p className="text-white z-10 absolute translate-x-[350%] translate-y-1">
            {uploadProgress}%
          </p>
          <div
            style={{
              width: `${uploadProgress}%`,
              height: "30px",
              top: "0",
              left: "0",
              position: "absolute",
              backgroundColor: "#003262",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
