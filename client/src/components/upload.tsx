import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import axios from "axios";

const UploadButton: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleShowUploadModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseUploadModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setError("No files selected");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const token = sessionStorage.getItem("token"); // Lấy token từ sessionStorage

    if (!token) {
      setError("Token not found. Please log in again.");
      setUploading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      setUploadedUrls(response.data.urls);
      setFiles([]);
      handleCloseUploadModal();
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred while uploading"
      );
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleShowUploadModal}
        className="flex items-center justify-center bg-gray-800 text-white w-10 h-10 rounded-md"
      >
        <Upload size={24} />
      </button>
      <dialog
        ref={dialogRef}
        className="bg-transparent h-screen w-full sm:px-8 md:px-16 sm:py-8"
      >
        <main className="container mx-auto max-w-screen-lg h-full">
          <article
            aria-label="File Upload Modal"
            className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
            onDrop={(event) => {
              event.preventDefault();
              const newFiles = Array.from(event.dataTransfer.files);
              setFiles((prevFiles) => [...prevFiles, ...newFiles]);
              overlayRef.current?.classList.remove("draggedover");
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() =>
              overlayRef.current?.classList.remove("draggedover")
            }
            onDragEnter={() => overlayRef.current?.classList.add("draggedover")}
          >
            <div
              id="overlay"
              ref={overlayRef}
              className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
            >
            </div>
            <section className="h-full overflow-auto p-8 w-full flex flex-col">
              <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                  <span>Drag and drop your</span>&nbsp;
                  <span>files anywhere or</span>
                </p>
                <input
                  id="hidden-input"
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  id="button"
                  className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                  onClick={handleUploadClick}
                >
                  Upload a file
                </button>
              </header>
              <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
                To Upload
              </h1>
              <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                {files.length === 0 && (
                  <li
                    id="empty"
                    className="h-full w-full text-center flex flex-col justify-center items-center"
                  >
                    <img
                      className="mx-auto w-32"
                      src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                      alt="no data"
                    />
                    <span className="text-small text-gray-500">
                      No files selected
                    </span>
                  </li>
                )}
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24"
                  >
                    <article className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer shadow-sm">
                      <img
                        alt="upload preview"
                        className="img-preview hidden w-full h-full object-cover rounded-md"
                      />
                      <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                        <h1 className="flex-1 group-hover:text-blue-800">
                          {file.name}
                        </h1>
                        <div className="flex">
                          <span className="p-1 text-blue-800">
                            <i>
                              <svg
                                className="fill-current w-4 h-4 ml-auto pt-1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                              </svg>
                            </i>
                          </span>
                          <p className="p-1 size text-xs text-gray-700">
                            {file.size > 1024
                              ? file.size > 1048576
                                ? Math.round(file.size / 1048576) + "mb"
                                : Math.round(file.size / 1024) + "kb"
                              : file.size + "b"}
                          </p>
                          <button
                            className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                            onClick={() => {
                              setFiles((prevFiles) =>
                                prevFiles.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <svg
                              className="pointer-events-none fill-current w-4 h-4 ml-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                className="pointer-events-none"
                                d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                              />
                            </svg>
                          </button>
                        </div>
                      </section>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
            <footer className="flex justify-end px-8 pb-8 pt-4">
              <button
                id="submit"
                className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                onClick={handleUploadFiles}
              >
                {uploading ? "Uploading..." : "Upload now"}
              </button>
              <button
                id="cancel"
                className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={handleCloseUploadModal}
              >
                Cancel
              </button>
            </footer>
            {error && <p className="text-red-500">{error}</p>}
            {uploadedUrls.length > 0 && (
              <ul>
                {uploadedUrls.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </main>
      </dialog>
    </div>
  );
};

export default UploadButton;
