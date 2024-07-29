import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Video, Trash2 } from "lucide-react"; // Added Trash2 icon
import { uploadFiles, deleteFile } from "@/services/api/posts-api"; // Added deleteFile import

const UploadButton: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; url: string }[]
  >([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    newFiles.forEach((file) => {
      if (!isVideoFile(file)) {
        setPreviews((prevPreviews) => ({
          ...prevPreviews,
          [file.name]: URL.createObjectURL(file),
        }));
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setError("No files selected");
      return;
    }

    setUploading(true);
    setError(null);

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      setUploading(false);
      return;
    }

    try {
      const response = await uploadFiles(files, token);
      const newUploadedFiles = response.urls.map(
        (url: string, index: number) => ({
          name: files[index].name,
          url,
        })
      );
      setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
      setFiles([]);
      setPreviews({});
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred while uploading"
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileName: string, fileUrl: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    const userId = fileUrl.split("/")[4]; // Adjust according to your URL structure
    try {
      await deleteFile(userId, fileName, token);
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName)
      );
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred while deleting"
      );
      console.error(error);
    }
  };

  const truncateFileName = (fileName: string) =>
    fileName.split("/").pop() || fileName;

  const getFileNameAndExtension = (fileName: string) =>
    fileName.split("/").pop() || fileName;

  const isVideoFile = (file: { name: string }) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    return extension === "mp4" || extension === "mkv" || extension === "mov";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    newFiles.forEach((file) => {
      if (!isVideoFile(file)) {
        setPreviews((prevPreviews) => ({
          ...prevPreviews,
          [file.name]: URL.createObjectURL(file),
        }));
      }
    });
    overlayRef.current?.classList.remove("draggedover");
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center bg-gray-800 text-white w-10 h-10 rounded-md">
          <Upload size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl p-6 rounded-lg font-nunito mx-auto overflow-y-auto max-h-screen">
        <DialogTitle>Upload Files</DialogTitle>
        <main className="container mx-auto max-w-screen-lg h-full overflow-y-auto">
          <article
            aria-label="File Upload Modal"
            className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() =>
              overlayRef.current?.classList.remove("draggedover")
            }
            onDragEnter={() => overlayRef.current?.classList.add("draggedover")}
          >
            <div
              id="overlay"
              ref={overlayRef}
              className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
            ></div>
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
                <Button
                  id="button"
                  className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                  onClick={handleUploadClick}
                >
                  Upload a file
                </Button>
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
                    className="block p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-32"
                  >
                    <article className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer shadow-sm">
                      {isVideoFile(file) ? (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100 rounded-md">
                          <Video size={24} />
                        </div>
                      ) : (
                        <img
                          alt="upload preview"
                          className="img-preview w-full h-full object-cover rounded-md"
                          src={previews[file.name]}
                        />
                      )}
                      <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                        <div className="flex-1 group-hover:text-blue-800 truncate">
                          {truncateFileName(file.name)}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="size text-xs text-gray-700">
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
                              setPreviews((prevPreviews) => {
                                const newPreviews = { ...prevPreviews };
                                delete newPreviews[file.name];
                                return newPreviews;
                              });
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
              <Button
                id="submit"
                className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                onClick={handleUploadFiles}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload now"}
              </Button>
              <DialogClose asChild>
                <Button
                  id="cancel"
                  className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                >
                  Cancel
                </Button>
              </DialogClose>
            </footer>
            {error && <p className="text-red-500">{error}</p>}
            {uploadedFiles.length > 0 && (
              <ul className="mt-4 ml-2">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center space-x-4 mb-2">
                    {isVideoFile(file) ? (
                      <div className="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-100 rounded-md">
                        <Video size={24} />
                      </div>
                    ) : (
                      <img
                        className="w-12 h-12 object-cover rounded-md"
                        src={file.url}
                        alt={truncateFileName(file.name)}
                      />
                    )}
                    <div className="flex-1">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {getFileNameAndExtension(file.name)}
                      </a>
                    </div>
                    <button
                      className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                      onClick={() => handleDeleteFile(file.name, file.url)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
