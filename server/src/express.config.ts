import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";

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
      saveUninitialized: true,
      proxy: true,
      name: "sid",
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );
  app.use(
    cors({
      origin: ["http://localhost:1420", "https://lumen-omega.vercel.app"],
      credentials: true,
      methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
      ],
      exposedHeaders: ["Content-Type"],
    })
  );

  return app;
};

export default ExpressConfig;
