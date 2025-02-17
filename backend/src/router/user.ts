import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../middleware";
import { JWT_SECRET } from "../config";

const prismaClient = new PrismaClient();
const router = Router();

export default router;

router.post("/signin", authMiddleware, async(req, res) => {

    // Add signin verification logic here later and then every user will have address to it
    const { userId } = req.body; 
    const existingUser = await prismaClient.user.findFirst({
        where: {
            id: userId
        }
    })

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser.id
        }, JWT_SECRET)

        res.json({
            token
        });
    } else {

        // create a user on the platform
        const user = await prismaClient.user.create({
            data: {
                id: userId,
                address: '0xaer1239483749kjdjkla' 
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