import express from 'express';
import apiRouter from './API/src/backend/routers/apiRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use('/api', apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// отдаём фронт через use, catch-all
app.use(express.static(path.join(__dirname, 'front/dist')));
app.use('/api/upload', express.static(path.join(__dirname, 'API/src/backend/upload')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'front/dist/index.html'));
});

app.listen(3011, () => {
    console.log('Server + Front running on port http://localhost:3011');
});
