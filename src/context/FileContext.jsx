import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

// Let's export it as a hook
export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

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
        "http://localhost:8080/api/file/getAllFiles"
      );
      if (result) {
        setFiles(result.data);
      }
    } catch (error) {
      console.log("No files found");
    }
  };
  const uploadFiles = async (files) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:8080/api/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = onUploadProgress(progressEvent);
            setUploadProgress(progress);
            setUploadComplete(true);
          },
        }
      );

      setUploadComplete(false);
      return response.data;
    } catch (error) {
      console.log("Could not upload file!", error);
    }
  };

  const values = {
    uploadFiles,
    uploadProgress,
    getAllFiles,
    files,
    uploadComplete,
  };

  return <FileContext.Provider value={values}>{children}</FileContext.Provider>;
};
