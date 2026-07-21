import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/user.routes.js";

dotenv.config({
    path: "./.env"
});

import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));




const PORT = process.env.PORT || 5000;

app.use('/api/users',router);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error starting server:", error);
    });

