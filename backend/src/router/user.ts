import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prismaClient = new PrismaClient();
const router = Router();

export default router;