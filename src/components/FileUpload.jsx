import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileContext } from "../context/FileContext";
import ProgressBar from "./ProgressBar";
import axios from "axios";
import FileList from "./FileList";

const FileUpload = () => {
  const { uploadFiles, files, deleteFile, getAllFiles, setFiles, totalSize } =
    useFileContext();
  const [localFiles, setLocalFiles] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  useEffect(() => {
    getAllFiles();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };
  const handleDragEnter = (e, targetItem) => {
    if (draggedItem === null) return;

    // create a shallow copy of your localFiles
    const newItems = [...localFiles];

    const draggedIndex = localFiles.findIndex((item) => item === draggedItem);
    const targetIndex = localFiles.findIndex((item) => item === targetItem);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setLocalFiles(newItems);
    setFiles(newItems);
    setDraggedItem(null);
  };
  const downloadFile = async (fileName) => {
    const response = await axios.get(
      `https://file-upload-management-api-production.up.railway.app/api/file/download/${fileName}`,
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
    multiple: true,
  });

  return (
    <div className=" flex justify-start bg-slate-100 items-center h-screen flex-col">
      <div
        {...getRootProps()}
        className={`border-dashed border-4 md:text-2xl p-4 rounded-lg mt-10 m-10 ${
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
      <p className="text-md">Total: {totalSize}MB</p>
      <p className="text-md">Remaning: {(15.0 - totalSize).toFixed(2)}GB</p>
      <FileList
        localFiles={localFiles}
        handleDragEnter={handleDragEnter}
        handleDragStart={handleDragStart}
        draggedItem={draggedItem}
        downloadFile={downloadFile}
        deleteFile={deleteFile}
      />
    </div>
  );
};

export default FileUpload;
