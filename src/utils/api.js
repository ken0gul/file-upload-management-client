import axios from "axios";
const onUploadProgress = (progressEvent) => {
  const progress = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  // setUploadProgress(progress); // Update the progress state
};
export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axios.post(
      "https://file-upload-management-api-production.up.railway.app/api/file/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = onUploadProgress(progressEvent);
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Could not upload file!", error);
  }
};
