import React, { useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

function UploadButton({
  files,
  setFiles,
  className,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const truncateFileName = (fileName: string) => {
    return fileName.split("/").pop() || fileName;
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    overlayRef.current?.classList.remove("draggedover");
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={twMerge(
            "flex items-center justify-center self-start rounded-md text-foreground",
            className,
          )}
        >
          <Upload size={22} />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto h-full max-h-screen w-full max-w-3xl overflow-y-auto rounded-none p-6 font-nunito md:h-fit">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription className="hidden">upload</DialogDescription>
        </DialogHeader>
        <main className="container mx-auto h-full max-w-screen-lg overflow-y-auto text-foreground">
          <article
            aria-label="File Upload Modal"
            className="relative flex h-full flex-col rounded-md bg-background"
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
              className="pointer-events-none absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center rounded-md"
            ></div>
            <section className="flex h-full w-full flex-col overflow-auto p-8">
              <header className="flex flex-col items-center justify-center border-2 border-dashed border-border py-12">
                <p className="mb-3 flex flex-wrap justify-center font-semibold text-muted-foreground">
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
                  className="focus:shadow-outline mt-2 rounded-sm bg-orange-500 px-3 py-1 text-foreground hover:bg-orange-600 focus:outline-none"
                  onClick={handleUploadClick}
                >
                  Upload a file
                </Button>
              </header>
              <h1 className="pb-3 pt-8 font-semibold text-muted-foreground sm:text-lg">
                To Upload
              </h1>
              <ul id="gallery" className="-m-1 flex flex-wrap">
                {files.length === 0 && (
                  <li
                    id="empty"
                    className="flex h-full w-full flex-col items-center justify-center text-center"
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
                    className="xl:w-1/8 block h-32 w-1/2 p-2 sm:w-1/3 md:w-1/4 lg:w-1/6"
                  >
                    <article className="focus:shadow-outline group relative h-full w-full cursor-pointer rounded-md bg-gray-100 shadow-sm focus:outline-none">
                      {isImageFile(file.name) && (
                        <img
                          alt="upload preview"
                          className="img-preview h-full w-full rounded-md object-cover"
                          src={URL.createObjectURL(file)}
                        />
                      )}
                      {isVideoFile(file.name) && (
                        <video
                          src={URL.createObjectURL(file)}
                          className="doc-preview h-full w-full rounded-md object-cover"
                        />
                      )}
                      {isDocumentFile(file.name) && (
                        <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">
                          <iframe
                            referrerPolicy="no-referrer"
                            src={URL.createObjectURL(file)}
                            className="doc-preview h-full w-full rounded-md object-cover"
                          />
                        </div>
                      )}
                      <section className="absolute bottom-0 z-20 flex h-fit w-full flex-col break-words rounded-md bg-background/20 px-3 py-2 text-xs backdrop-blur-md">
                        <div className="flex-1 truncate group-hover:text-blue-500">
                          {truncateFileName(file.name)}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="size text-xs text-muted-foreground hover:text-orange-500">
                            {file.size > 1024
                              ? file.size > 1048576
                                ? Math.round(file.size / 1048576) + "mb"
                                : Math.round(file.size / 1024) + "kb"
                              : file.size + "b"}
                          </p>
                          <button
                            className="delete ml-auto rounded-md p-1 text-muted-foreground hover:bg-destructive hover:text-white focus:outline-none"
                            onClick={() => {
                              setFiles((prevFiles) =>
                                prevFiles.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <svg
                              className="pointer-events-none ml-auto h-4 w-4 fill-current"
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
              <DialogClose asChild>
                <Button
                  id="submit"
                  className="focus:shadow-outline rounded-sm bg-orange-500 px-3 py-1 text-foreground hover:bg-orange-600 focus:outline-none"
                  onClick={() => {}}
                  disabled={files.length <= 0}
                >
                  Upload
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  id="cancel"
                  onClick={() => setFiles([])}
                  className="focus:shadow-outline ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </Button>
              </DialogClose>
            </footer>
          </article>
        </main>
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
