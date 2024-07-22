import { Request, Response } from "express";
import upload from "../config/multer-config"; 
import supabase from "../supabaseClient";
import { v4 as uuidv4 } from 'uuid';

export const uploadFiles = [
  upload.array("files", 10), // Cho phép tải lên tối đa 10 tệp cùng lúc
  async (req: Request, res: Response) => {
    try {
      console.log('User:', req.user);
      if (!req.user || typeof req.user === 'string') {
        return res.status(403).json({ error: "User information is missing or invalid" });
      }

      const role = req.user.role;
      console.log('User role:', role);

      if (role !== "Teacher" && role !== "Admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log('Files:', files);

      const userId = req.user.id;
      const urls = [];

      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`${userId}/${uuidv4()}_${file.originalname}`, file.buffer);

        if (error) {
          console.error('Supabase error:', error);
          return res.status(500).json({ error: error.message });
        }

        console.log('Supabase data:', data);

        const publicUrlResponse = supabase.storage.from("uploads").getPublicUrl(data.path);
        const publicUrl = publicUrlResponse.data.publicUrl;
        console.log('Public URL:', publicUrl);

        urls.push(publicUrl);
      }

      res.status(200).json({ urls });
    } catch (error) {
      console.error('Catch error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  },
];
