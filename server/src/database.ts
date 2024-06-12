import mongoose, { ConnectOptions } from "mongoose";

export default class MongooseConnection {
  private static instance: MongooseConnection;
  private isConnected: boolean;

  private constructor() {
    this.isConnected = false;
  }

  public static getInstance(): MongooseConnection {
    if (!MongooseConnection.instance) {
      MongooseConnection.instance = new MongooseConnection();
    }
    return MongooseConnection.instance;
  }

  public async connect(dbUrl: string) {
    if (!this.isConnected) {
      try {
        await mongoose.connect(dbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as ConnectOptions);
        this.isConnected = true;
        console.log("Connected to MongoDB");
      } catch (e) {
        console.error(e);
      }
    }
  }

  public disconnect() {
    if (this.isConnected) {
      mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from MongoDB");
    }
  }
}
