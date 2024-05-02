import React, { useRef } from "react";
import axios from "axios";
import useFileUpload from "react-use-file-upload";
import StyledButton from "../MainPages/StyledButton";

const UploadFiles = ({bgColor, txtColor, textValue}) => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = createFormData();

    try {
      axios.post("https://some-api.com", formData, {
        "content-type": "multipart/form-data",
      });
    } catch (error) {
      console.error("Failed to submit files.");
    }
  };

  return (
    <div>
      <div className="form-container">
        {/* Display the files to be uploaded */}
        <div>
          <ul>
            {fileNames.map((name) => (
              <li key={name}>
                <span>{name}</span>

                <span onClick={() => removeFile(name)}>
                  <i className="fa fa-times" />
                </span>
              </li>
            ))}
          </ul>

          {files.length > 0 && (
            <ul>
              <li>File types found: {fileTypes.join(", ")}</li>
              <li>Total Size: {totalSize}</li>
              <li>Total Bytes: {totalSizeInBytes}</li>

              <li className="clear-all">
                <button onClick={() => clearAllFiles()}>Clear All</button>
              </li>
            </ul>
          )}
        </div>

        {/* Provide a drop zone and an alternative button inside it to upload files. */}
        <div
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            handleDragDropEvent(e);
            setFiles(e, "a");
          }}
        >
          <StyledButton
            variant="main"
            sx={{ backgroundColor: bgColor, color: txtColor }}
            onClick={() => inputRef.current.click()}
          >
            {textValue}
          </StyledButton>

          {/* Hide the crappy looking default HTML input */}
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              setFiles(e, "a");
              inputRef.current.value = null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
