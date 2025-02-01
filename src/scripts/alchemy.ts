import { Network, Alchemy } from "alchemy-sdk";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ALCHEMY_API_KEY) {
    throw new Error("Missing ALCHEMY_API_KEY in environment variables");
}

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA  // Using testnet for development
};

const alchemy = new Alchemy(settings);

interface PriceData {
    timestamp: number;
    price: string;
    blockNumber: number;
}

// Function to get logs with proper error handling
async function getLogs(contractAddress: string) {
    try {
        const logs = await alchemy.core.getLogs({
            address: contractAddress,
            fromBlock: "latest",
            toBlock: "latest"
        });
        return logs;
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw error;
    }
}

// Function to fetch price data from AMM contract
async function getPriceData(contractAddress: string): Promise<PriceData[]> {
    try {
        const logs = await getLogs(contractAddress);
        const blockNumbers = logs.map(log => Number(log.blockNumber));
        const timestamps = await Promise.all(
            blockNumbers.map(blockNumber => 
                alchemy.core.getBlock(blockNumber).then(block => block.timestamp)
            )
        );
        return logs.map((log, index) => ({
            timestamp: Number(timestamps[index]),
            price: log.data, // encrypted price
            blockNumber: Number(log.blockNumber)
        }));
    } catch (error) {
        console.error("Error fetching price data:", error);
        throw error;
    }
}

export { alchemy, getLogs, getPriceData, PriceData };