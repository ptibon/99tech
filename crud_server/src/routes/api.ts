import express from "express";
import userRouter from "./user.api";

const router = express();

router.use("/users", userRouter);

export default router;

