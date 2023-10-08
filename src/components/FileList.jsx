import React from "react";
import { AiFillDelete, AiOutlineCloudDownload } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import { RxDragHandleDots2 } from "react-icons/rx";

const FileList = ({
  localFiles,
  handleDragStart,
  handleDragEnter,
  draggedItem,
  downloadFile,
  deleteFile,
}) => {
  return (
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
  );
};

export default FileList;
