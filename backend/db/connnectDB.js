import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionURl=process.env.ATLASH_DB_URL;
    const conn = await mongoose.connect(connectionURl);
    console.log(`MongoDB connected: ${connectionURl}`);
  } catch (error) {
    console.log(`Error MongoDB Connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;