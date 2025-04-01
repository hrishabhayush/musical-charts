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

/*
 * Send encrypted transaction to create liquidity to the pool. Waits for confirmation.
 */
async function addLiquidity(
  step: number,
  explorerUrl: string,
  contract: any,
  walletClient: any,
  abi: any,
  baseAmount: number,
  quoteAmount: number
) {
  console.log(chalk.blue(`\n\nStep ${step}: Adding liquidity to pool that is starting with baseAmount: ${baseAmount}, quoteAmount: ${quoteAmount}`))
  const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.addLiquidity([
    baseAmount, quoteAmount
  ])
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
  console.log(chalk.blue(`\n\nStep ${step}: Attempting to swap the assets with baseIn: ${baseIn}, quoteIn: ${quoteIn}`))
  try {
    const { plaintextTx, shieldedTx, txHash } = await contract.dwrite.swap([ baseIn, quoteIn ])

    displayTransaction(plaintextTx, abi[2])
    displayTransaction(shieldedTx, undefined, true)

    await walletClient.waitForTransactionReceipt({
      hash: txHash,
    })

    printSuccess(
      `Transaction confirmed: ${chalk.green(`${explorerUrl}/tx/${txHash}`)}`
    )
  } catch (error: any) {
    printFail(`Swap failed: ${error.message}`)
  }
}

async function readPrice(step: number, contract: any) {
  console.log(chalk.blue(`\n\nStep ${step}: Attempting to read the price of the token`))

  try {
    const price = await contract.read.getPrice();
    printSuccess(`Current price: ${chalk.green(price)}`)
    return price
  } catch (error: any) {
    printFail(`Failed to read price: ${error.message}`)
    printFail(`Note: This function requires violin access rights`)
    return null
  }
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

    // Check initial price (requires violin access)
    await readPrice(1, contract)
  
    // Add initial liquidity to the pool
    await addLiquidity(2, explorerUrl, contract, walletClient, abi, 1000000, 1000000)
    
    // Check price after adding liquidity
    await readPrice(3, contract)
    
    // Execute a swap (base asset in)
    await swap(4, explorerUrl, contract, walletClient, abi, 100000, 0)
    
    // Check price after swap
    await readPrice(5, contract)
    
    // Execute a reverse swap (quote asset in)
    await swap(6, explorerUrl, contract, walletClient, abi, 0, 50000)
    
    // Final price check
    await readPrice(7, contract)
  
    console.log('\n')
    printSuccess('Success. You just interacted with your Riff AMM contract!')
}

main()