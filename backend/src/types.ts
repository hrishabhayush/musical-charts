import z from "zod";

// input validation 
export const createTradeOption = z.object({
    
});

export const createTradeSubmission = z.object({
    tradeId: z.string()
})