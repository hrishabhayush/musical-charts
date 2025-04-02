import chalk from 'chalk'
import {
  createShieldedWalletClient,
  getShieldedContract,
  seismicDevnet,
} from 'seismic-viem'
import { http, getContract } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { CONTRACT_DIR, CONTRACT_NAME } from '../lib/constants.js'
import {
  displayTransaction,
  printFail,
  printSuccess,
  readAbi,
} from '../lib/utils.js'
import { base } from 'viem/chains'
import { parseUnits } from 'viem'

const ABI = [
  {
    name: 'addLiquidity',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'baseAmount', type: 'uint256' },
      { name: 'quoteAmount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'swap',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'baseIn', type: 'uint256' },
      { name: 'quoteIn', type: 'uint256' }
    ],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  }
] as const;

/*
 * Add liquidity to the AMM pool
 */
async function addLiquidity(
  step: number, 
  explorerUrl: string, 
  contract: any, 
  walletClient: any, 
  abi: any, 
  baseAmount: number,
  quoteAmount: number) {
  console.log(chalk.blue(`\n\nStep ${step}: Adding liquidity to the AMM`));
  const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.addLiquidity([
    baseAmount,
    quoteAmount,
  ]);
  displayTransaction(plaintextTx, abi[2]);
  displayTransaction(shieldedTx, undefined, true);
  await walletClient.waitForTransactionReceipt({ hash: txHash });
  printSuccess(`Liquidity added: ${chalk.green(`${explorerUrl}/tx/${txHash}`)}`);
}

/*
 * Attempt to read counter value. Only succeeds if counter is above the
 * threshold.
 */
async function swap(
  step: number, 
  explorerUrl: string,
  contract: any,
  walletClient: any,
  abi: any,
  baseIn: number, 
  quoteIn: number
) {
  console.log(chalk.blue(`\n\nStep ${step}: Performing swap`))
  const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.swap([ baseIn, quoteIn ])

  displayTransaction(plaintextTx, abi[2])
  displayTransaction(shieldedTx, undefined, true)

  await walletClient.waitForTransactionReceipt({
    hash: txHash,
  })

  printSuccess(
    `Transaction confirmed: ${chalk.green(`${explorerUrl}/tx/${txHash}`)}`
  )
}

/*
 * Get price of quote asset
 */
async function getPrice(step: number, contract: any) {
  console.log(chalk.blue(`\n\nStep ${step}: Retrieving quote asset price`));
  let price;
  try {
    price = Number(await contract.read.getPrice([]));
  } catch (_) {
    price = '???';
  }
  printSuccess(`Quote Asset Price: ${chalk.green(price)}`);
}


async function main() {
  const [rpcUrl, explorerUrl, contractAddr, privkey] = process.argv.slice(2)

  const walletClient = await createShieldedWalletClient({
    chain: seismicDevnet,
    transport: http(rpcUrl),
    account: privateKeyToAccount(privkey as `0x${string}`),
  })
  const contract = getShieldedContract({
    abi: ABI,
    address: contractAddr as `0x${string}`,
    client: walletClient,
  })

  console.log(chalk.blue('\n=== Testing Riff AMM Contract ==='));
  console.log('Wallet Address:', walletClient.account.address);
  console.log('Contract Address:', contractAddr);

  // Step 1: Approve tokens for the contract
  try {
    console.log(chalk.blue('\nStep 1: Approving tokens'));
    const baseAmount = BigInt(1e18); // 1 RIFF
    const quoteAmount = BigInt(1e18); // 1 USDC
    
    // Get base and quote token addresses from the contract
    const baseToken = await contract.read.baseAsset();
    const quoteToken = await contract.read.quoteAsset();
    
    console.log('Token addresses:', {
      baseToken,
      quoteToken,
    });

    // Approve base token
    const baseTokenContract = getContract({
      abi: [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ type: 'bool' }]
        }
      ],
      address: baseToken as `0x${string}`,
      client: walletClient,
    });
    
    const baseTxHash = await baseTokenContract.write.approve([contractAddr as `0x${string}`, baseAmount]);
    
    console.log(chalk.green('Base Token Approval Hash:', baseTxHash));
    await walletClient.waitForTransactionReceipt({ hash: baseTxHash });
    console.log(chalk.green('Base token approved!'));

    // Approve quote token
    const quoteTokenContract = getContract({
      abi: [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ type: 'bool' }]
        }
      ],
      address: quoteToken as `0x${string}`,
      client: walletClient,
    });
    
    const quoteTxHash = await quoteTokenContract.write.approve([contractAddr as `0x${string}`, quoteAmount]);
    
    console.log(chalk.green('Quote Token Approval Hash:', quoteTxHash));
    await walletClient.waitForTransactionReceipt({ hash: quoteTxHash });
    console.log(chalk.green('Quote token approved!'));
  } catch (error) {
    console.error(chalk.red('Error approving tokens:', error));
    return; // Exit if approvals fail
  }

  // Step 2: Add liquidity
  try {
    console.log(chalk.blue('\nStep 2: Adding initial liquidity'));
    const baseAmount = BigInt(1e18); // 1 RIFF
    const quoteAmount = BigInt(1e18); // 1 USDC
    console.log('Adding liquidity:', {
      baseAmount: baseAmount.toString(),
      quoteAmount: quoteAmount.toString()
    });
    
    const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.addLiquidity([
      baseAmount,
      quoteAmount,
    ]);
    
    console.log(chalk.green('Transaction Hash:', txHash));
    await walletClient.waitForTransactionReceipt({ hash: txHash });
    console.log(chalk.green('Liquidity added successfully!'));
  } catch (error) {
    console.error(chalk.red('Error adding liquidity:', error));
    return; // Exit if liquidity addition fails
  }

  // Step 3: Get initial price
  try {
    console.log(chalk.blue('\nStep 3: Getting initial price'));
    const initialPrice = await contract.read.getPrice() as bigint;
    console.log(chalk.green('Initial Price:', initialPrice.toString()));
  } catch (error) {
    console.error(chalk.red('Error getting initial price:', error));
  }

  // Step 4: Try a small swap (1 USDC to RIFF)
  try {
    console.log(chalk.blue('\nStep 4: Testing USDC to RIFF swap'));
    const amount = BigInt(1e18); // 1 USDC
    console.log('Amount:', amount.toString());
    
    const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.swap([BigInt(0), amount]);
    console.log(chalk.green('Transaction Hash:', txHash));
    
    await walletClient.waitForTransactionReceipt({ hash: txHash });
    console.log(chalk.green('Transaction confirmed!'));
  } catch (error) {
    console.error(chalk.red('Error during swap:', error));
  }

  // Step 5: Get final price
  try {
    console.log(chalk.blue('\nStep 5: Getting final price'));
    const finalPrice = await contract.read.getPrice() as bigint;
    console.log(chalk.green('Final Price:', finalPrice.toString()));
  } catch (error) {
    console.error(chalk.red('Error getting final price:', error));
  }

  console.log('\n');
  printSuccess('Testing completed!');
}

main()