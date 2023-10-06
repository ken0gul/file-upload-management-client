import React from "react";
import { useDropzone } from "react-dropzone";
import { useFileContext } from "../context/FileContext";

const FileUpload = () => {
  const { uploadProgress, uploadFiles } = useFileContext();
  console.log(uploadProgress);
  const onFileUpload = (acceptedFiles) => {
    uploadFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles);
    },
  });
  return (
    <div className=" flex justify-center items-center flex-col">
      <div
        {...getRootProps()}
        className={`border-dashed border-4 p-4 rounded-lg mt-10 m-10 ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop files here, or click to select files
          </p>
        )}
      </div>
      <div>
        {uploadProgress > 0 && (
          <div>
            <p className="text-black">Upload Progress: {uploadProgress}%</p>
            <div
              style={{
                width: `${uploadProgress}%px`,
                height: "10px",
                backgroundColor: "#003262",
                borderRadius: "10px",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
