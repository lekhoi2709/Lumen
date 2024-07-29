import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  console.log("Received file:", file);
  const filetypes = /jpeg|jpg|png|gif|mp4|avi|mkv|mov|video\/x-matroska/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    (file.originalname.split(".").pop() || "").toLowerCase()
  );

  console.log("File mimetype:", file.mimetype);
  console.log("File originalname:", file.originalname);
  console.log("File extname:", extname);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error("Only image and video files are allowed!");
    console.error("File filter error:", error.message);
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
