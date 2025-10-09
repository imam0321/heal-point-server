import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { router } from './app/routes';
import { envVars } from './app/config/env';


const app: Application = express();
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Server...",
    });
});


app.use(globalErrorHandler)
app.use(notFound);

export default app;