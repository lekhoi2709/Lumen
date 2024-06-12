import express, { Application } from "express";

const ExpressConfig = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

export default ExpressConfig;
