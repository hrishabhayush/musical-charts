import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decodedjwt = jwt.verify(authHeader, JWT_SECRET);
        console.log(decodedjwt);

        // @ts-ignore
        if (decodedjwt.userId) {
            // @ts-ignore
            req.userId = decodedjwt.userId;
            next();
        } else {
            return res.status(403).json({
                message: "Error while logging in"
            })
        }
    } catch(e) {
        console.log("You're not logged in");
        return res.status(403).json({
            message: "You're not logged in"
        });
    }
}