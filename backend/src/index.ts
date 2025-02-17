import express from "express";
import userRouter from "./router/user";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors())

app.use("/user", userRouter);

const port = 3000;
app.listen(port, () => {
console.log(`Server listening at port: ${port}`)
});