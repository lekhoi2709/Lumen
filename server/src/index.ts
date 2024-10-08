import { Request, Response } from "express";
import ExpressConfig from "./express.config";
import MongooseConnection from "./database";
import * as dotenv from "dotenv";
import ApiRoute from "./routes/api";
if (process.env.NODE_ENV != "production") {
  dotenv.config();
}
import { rateLimit } from "express-rate-limit";

const port = process.env.PORT || 5000;
var dbUrl: string = process.env.DB_URL!;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
});

async function main() {
  try {
    const dbConnection = MongooseConnection.getInstance();
    dbConnection.connect(dbUrl).then(() => {
      const app = ExpressConfig();
      app.use(limiter);
      app.use("/api", ApiRoute);
      app.use("/admin", ApiRoute);
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
