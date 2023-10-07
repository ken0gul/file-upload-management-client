import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileContext } from "../context/FileContext";
import ProgressBar from "./ProgressBar";
import { FcCheckmark } from "react-icons/fc";
import axios from "axios";

const FileUpload = () => {
  const { uploadFiles, getAllFiles, files, uploadProgress, uploadComplete } =
    useFileContext();

  useEffect(() => {
    getAllFiles();
  }, [uploadComplete]);

  const downloadFile = async (fileName) => {
    console.log(fileName);
    const response = await axios.get(
      `http://localhost:8080/api/file/download/${fileName}`,
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data]);
    // Create a data URI from the blob
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    return url;
  };
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
      <ProgressBar />
      <ul>
        <h2 className="font-semibold italic mb-2">Click to download</h2>
        {files &&
          files?.map((file, index) => (
            <li
              key={index}
              onClick={() => downloadFile(file)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FcCheckmark size={20} />
              {file.split("*")[1]}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FileUpload;
