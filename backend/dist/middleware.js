"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
    var _a;
    console.log('before auth');
    const authHeader = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    console.log(authHeader);
    console.log('after auth');
    try {
        console.log('reaches here');
        const decodedjwt = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_SECRET);
        console.log(decodedjwt);
        // @ts-ignore
        if (decodedjwt.userId) {
            // @ts-ignore
            req.userId = decodedjwt.userId;
            next();
        }
        else {
            res.status(403).json({
                error: "Error while logging in"
            });
        }
    }
    catch (e) {
        console.log("You're not logged in");
        res.status(403).json({
            error: "You're not logged in"
        });
    }
}
