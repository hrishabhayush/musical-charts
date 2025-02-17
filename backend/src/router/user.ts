import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middleware";
import { JWT_SECRET } from "../config";

const prismaClient = new PrismaClient();
const router = Router();

export default router;

router.post("/signin", authMiddleware, async(req, res) => {
    const { userId } = req.body; 
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId
        }
    })

    if (user) {
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)

        res.json({
            token
        })
    } else {
        const createUser = await prismaClient.user.create({
            data: {
                userId: userId
            }
        })

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)

        res.json({
            token
        })
    }
});