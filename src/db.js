import mongoose from "mongoose";
import {MONGO_DB_URI} from "../config.js";

export const dbConnect = () =>{
    return mongoose.connect(MONGO_DB_URI);
}