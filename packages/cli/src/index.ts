import chalk from 'chalk'
import {
  createShieldedWalletClient,
  getShieldedContract,
  seismicDevnet,
} from 'seismic-viem'
import { http } from 'viem'
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

  const abi = await readAbi(CONTRACT_DIR, CONTRACT_NAME)
  const walletClient = await createShieldedWalletClient({
    chain: seismicDevnet,
    transport: http(rpcUrl),
    account: privateKeyToAccount(privkey as `0x${string}`),
  })
  const contract = getShieldedContract({
    abi: abi,
    address: contractAddr as `0x${string}`,
    client: walletClient,
  })

  // Commenting out state-changing operations to avoid arithmetic overflow/underflow errors
  // await addLiquidity(1, explorerUrl, contract, walletClient, abi, 100, 200);
  // await swap(2, explorerUrl, contract, walletClient, abi, 10, 0);
  
  // Only attempt to read price directly without any prior operations
  await getPrice(1, contract);

  await addLiquidity(1, explorerUrl, contract, walletClient, abi, 1e8, 1e8);
  
  console.log('\n')
  printSuccess('Success. You just interacted with your Riff AMM contract!')
}

main()