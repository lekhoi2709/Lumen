import { Request, Response } from "express";
import ExpressConfig from "./express.config";
import MongooseConnection from "./database";
import * as dotenv from "dotenv";
import AuthRoute from "./routes/auth";
if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

const port = process.env.PORT || 5000;
var dbUrl: string = process.env.DB_URL!;

async function main() {
  try {
    const dbConnection = MongooseConnection.getInstance();
    dbConnection.connect(dbUrl).then(() => {
      const app = ExpressConfig();
      app.use("/api/auth", AuthRoute);

      app.get("/", (req: Request, res: Response) => {
        res.send("Lumen Server");
      });

      app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
process.on("SIGINT", () => {
  const dbConnection = MongooseConnection.getInstance();
  dbConnection.disconnect();
  process.exit(0);
});
