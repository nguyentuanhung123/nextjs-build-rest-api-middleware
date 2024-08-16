import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1) {
        console.log("Already connected");
    }

    if(connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "restapinext14",
            bufferCommands: false
        })
        console.log("Connected");
    } catch (error) {
        console.log("Error in connecting to database: ", error);
        throw new Error("Error connecting to database");
    }
}

export default connect;

