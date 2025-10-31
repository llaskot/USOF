import express from 'express';
import cookieParser from "cookie-parser";
import apiRouter from "./src/backend/routers/apiRouter.js";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.listen(3001, () => {
    console.log('Server running on port 3001');
    console.log('CLICK HERE to open html http://localhost:3001/');
    console.log('Ctrl + C to stop');
});