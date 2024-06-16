import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

const ExpressConfig = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: ["http://localhost:1420", "https://lumen-omega.vercel.app"],
      credentials: true,
    })
  );

  return app;
};

export default ExpressConfig;
