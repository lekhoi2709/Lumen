import { Request, Response } from "express";
import upload from "../config/multer-config";
import supabase from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface UserType {
  _id: string;
  role: string;
  email: string;
}

export const uploadFiles = [
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    try {
      if (!req.user || typeof req.user === "string") {
        return res
          .status(403)
          .json({ error: "User information is missing or invalid" });
      }

      const user = req.user as UserType;
      console.log("User:", user);

      const role = user.role;
      console.log("User role:", role);

      if (role !== "Teacher" && role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log("Files:", files);

      const userId = user._id;
      console.log("User ID:", userId);

      const urls = [];

      for (const file of files) {
        const sanitizedFileName = file.originalname.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        );
        const filePath = `${userId}/${uuidv4()}_${sanitizedFileName}`;
        console.log("File Path:", filePath);

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file.buffer);

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({ error: error.message });
        }

        console.log("Supabase data:", data);

        const publicUrlResponse = supabase.storage
          .from("uploads")
          .getPublicUrl(data.path);
        const publicUrl = publicUrlResponse.data.publicUrl;
        console.log("Public URL:", publicUrl);

        urls.push(publicUrl);
      }

      res.status(200).json({ urls });
    } catch (error) {
      console.error("Catch error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  },
];
