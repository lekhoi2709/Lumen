import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { isImageFile } from "@/lib/utils";
import { useChangeAvatar } from "@/services/mutations/user";

function ChangeAvatarDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const changeAvatarMutation = useChangeAvatar();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile && isImageFile(newFile.name)) {
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile && isImageFile(newFile.name)) {
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    } else {
      alert("Please drop a valid image file.");
    }
    handleDrag(event, false);
  };

  const handleDrag = (event: React.DragEvent, isOver: boolean) => {
    event.preventDefault();
    if (isOver) {
      overlayRef.current?.classList.add("draggedover");
    } else {
      overlayRef.current?.classList.remove("draggedover");
    }
  };

  const handleUploadAvatar = async () => {
    if (file) {
      setIsUploading(true);
      await changeAvatarMutation.mutateAsync(file);
      setFile(null);
      setPreview(null);
      setIsUploading(false);
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Dialog>
      <DialogTrigger className="absolute bottom-0 flex h-1/3 w-full cursor-pointer items-center justify-center gap-2 rounded-b-full bg-slate-500/10 text-orange-500 backdrop-blur-md transition-opacity duration-200 ease-in-out md:opacity-0 md:group-hover:opacity-100">
        <CameraIcon className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent className="mx-auto h-full max-h-screen w-full max-w-3xl overflow-y-auto rounded-none p-6 font-nunito md:h-fit">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription className="hidden">
            Upload an image
          </DialogDescription>
        </DialogHeader>
        <main className="container mx-auto h-full max-w-screen-lg overflow-y-auto text-foreground">
          <article
            aria-label="File Upload Modal"
            className="relative flex h-full flex-col rounded-md bg-background"
            onDrop={handleDrop}
            onDragOver={(event) => handleDrag(event, true)}
            onDragLeave={(event) => handleDrag(event, false)}
          >
            <div
              id="overlay"
              ref={overlayRef}
              className="pointer-events-none absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center rounded-md"
            ></div>
            <section className="flex h-full w-full flex-col overflow-hidden p-8">
              {!file && (
                <header className="flex flex-col items-center justify-center border-2 border-dashed border-border py-12">
                  <p className="mb-3 flex flex-wrap justify-center font-semibold text-muted-foreground">
                    <span>Drag and drop your image</span>&nbsp;
                    <span>or</span>
                  </p>
                  <input
                    id="hidden-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    id="button"
                    className="focus:shadow-outline mt-2 rounded-sm bg-orange-500 px-3 py-1 text-foreground hover:bg-orange-600 focus:outline-none"
                    onClick={handleUploadClick}
                  >
                    Upload an image
                  </Button>
                </header>
              )}
              <section id="gallery" className="-m-1 flex flex-wrap">
                {file && preview && (
                  <div className="w-full">
                    <article className="focus:shadow-outline group relative h-full w-full cursor-pointer rounded-md bg-gray-100 shadow-sm focus:outline-none">
                      {isImageFile(file.name) && (
                        <img
                          alt="upload preview"
                          className="img-preview h-full w-full rounded-md object-cover"
                          src={preview}
                        />
                      )}
                      <section className="absolute bottom-0 z-20 flex h-fit w-full flex-col break-words rounded-md bg-background/20 px-3 py-2 text-xs backdrop-blur-md">
                        <div className="flex-1 truncate group-hover:text-blue-500">
                          {file.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="size text-xs text-foreground hover:text-orange-500">
                            {file.size > 1024
                              ? file.size > 1048576
                                ? Math.round(file.size / 1048576) + "mb"
                                : Math.round(file.size / 1024) + "kb"
                              : file.size + "b"}
                          </p>
                          <button
                            className="delete ml-auto rounded-md p-1 text-muted-foreground hover:bg-destructive hover:text-white focus:outline-none"
                            onClick={() => {
                              setFile(null);
                              setPreview(null);
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
                  </div>
                )}
              </section>
            </section>
            <footer className="flex justify-end px-8 pb-8 pt-4">
              <Button
                id="submit"
                className="focus:shadow-outline rounded-sm bg-orange-500 px-3 py-1 text-foreground hover:bg-orange-600 focus:outline-none"
                onClick={handleUploadAvatar}
                disabled={!file}
              >
                {isUploading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Upload"
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  id="cancel"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
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

export default ChangeAvatarDialog;
