import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFileContext } from "../context/FileContext";
import ProgressBar from "./ProgressBar";
import { FcCheckmark } from "react-icons/fc";
import { RxDragHandleDots2 } from "react-icons/rx";
import { AiOutlineCloudDownload, AiFillDelete } from "react-icons/ai";
import axios from "axios";

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
      <p className="text-md">Remaning: {(15.0 - totalSize).toFixed(2)}MB</p>
      <ul className="w-96 h-screen overflow-scroll p-2 ">
        {localFiles &&
          localFiles?.map((file, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onDragEnter={(e) => handleDragEnter(e, file)}
              style={{
                transform:
                  draggedItem && draggedItem === file
                    ? "translateY(-10px)" // Adjust the animation effect as needed
                    : "none",
                background: draggedItem && draggedItem === file ? "gray" : "",
              }}
              className="flex items-center mb-2 justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-center  gap-2 md:text-2xl">
                <FcCheckmark size={20} />
                <span>
                  {file.split("*")[1].split(".")[0].substring(0, 15) +
                    "." +
                    file.split("*")[1].split(".")[1]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AiOutlineCloudDownload
                  size={25}
                  onClick={() => downloadFile(file)}
                  className="text-green-600 hover:text-red-100"
                />
                <AiFillDelete
                  opacity="60%"
                  size={20}
                  onClick={() => deleteFile(file)}
                  className="hover:text-slate-600"
                />
                <RxDragHandleDots2 size={20} />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FileUpload;
