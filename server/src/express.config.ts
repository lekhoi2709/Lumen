import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";

const ExpressConfig = (): Application => {
  const app = express();
  var dbUrl: string = process.env.DB_URL!;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/", express.static(path.join(__dirname, "public")));
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
      },
      store: MongoStore.create({
        mongoUrl: dbUrl,
        autoRemove: "native",
      }),
    })
  );

  app.use(
    cors({
      origin: ["http://localhost:1420", "https://lumen-omega.vercel.app"],
      credentials: true,
    })
  );

  return app;
};

export default ExpressConfig;
