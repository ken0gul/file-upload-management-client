import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

// Let's export it as a hook
export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isDeletionComplete, setIsDeletionComplete] = useState(false);

  const onUploadProgress = (progressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    return progress;
    // setUploadProgress(progress); // Update the progress state
  };

  const getAllFiles = async () => {
    try {
      const result = await axios.get(
        "https://file-upload-cloud-production.up.railway.app/api/file/getAllFiles"
      );
      setTotalSize(totalSize);
      if (result) {
        setFiles(result.data);
      }
      const totalSize = await getTotalSize();
    } catch (error) {
      console.log("No files found");
    }
  };
  const uploadFiles = async (files) => {
    setIsUploadComplete(false);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "https://file-upload-cloud-production.up.railway.app/api/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = onUploadProgress(progressEvent);
            setUploadProgress(progress);
            setIsUploadComplete(true);
          },
        }
      );
      getAllFiles();

      setIsUploadComplete(false);
      return response.data;
    } catch (error) {
      console.log("Could not upload file!", error);
    }
  };
  const deleteFile = async (fileName) => {
    setIsDeletionComplete(false);
    await axios.delete(
      "https://file-upload-cloud-production.up.railway.app/api/file/delete/" +
        fileName
    );
    getAllFiles();

    setIsDeletionComplete(true);
  };

  const getSingleFileInfo = async (fileName) => {
    try {
      const response = await axios.get(
        "https://file-upload-cloud-production.up.railway.app/api/file/getFileInfo/" +
          fileName
      );
      if (response?.data) {
        return response.data;
      }
    } catch (error) {}
  };

  const getTotalSize = async () => {
    try {
      const response = await axios.get(
        "https://file-upload-cloud-production.up.railway.app/api/file/getTotalSize"
      );
      const roundedTotal = (response.data / 1024.0 / 1000.0).toFixed(2);
      return roundedTotal;
    } catch (error) {
      console.log("Could not get total size", error);
    }
  };

  const values = {
    uploadFiles,
    uploadProgress,
    getAllFiles,
    files,
    isUploadComplete,
    deleteFile,
    isDeletionComplete,
    setFiles,
    getSingleFileInfo,
    totalSize,
  };

  return <FileContext.Provider value={values}>{children}</FileContext.Provider>;
};
