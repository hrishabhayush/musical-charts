import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log('before auth')
    const authHeader = req.headers["authorization"] ?? "";

    console.log(authHeader);
    console.log('after auth')
    try {
        console.log('reaches here');
        const decodedjwt = jwt.verify(authHeader, JWT_SECRET);
        console.log(decodedjwt);

        // @ts-ignore
        if (decodedjwt.userId) {
            // @ts-ignore
            req.userId = decodedjwt.userId;
            next();
        } else {
            res.status(403).json({
                error: "Error while logging in"
            });
        }
    } catch(e) {
        console.log("You're not logged in");
        res.status(403).json({
            error: "You're not logged in"
        });
    }
}