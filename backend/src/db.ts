import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getNextTrade = async (userId: number) => {
    const trade = await prismaClient.trade.findFirst({
        where: {
            
        }
    })
} 