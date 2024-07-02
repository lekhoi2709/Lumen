import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const ExpressConfig = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/", express.static(path.join(__dirname, "public")));
  app.use(cookieParser());

  app.use(
    cors({
      origin: ["http://localhost:1420", "https://lumen-omega.vercel.app"],
      credentials: true,
    })
  );

  return app;
};

export default ExpressConfig;
