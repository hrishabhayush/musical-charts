#!/bin/bash

set -e

source ../../config.sh
source ../common/print.sh
source ../common/wallet.sh

# Change the contract path to Riff contract
CONTRACT_PATH="src/Riff.sol:Riff"
DEPLOY_FILE="out/deploy.txt"

prelude() {
    echo -e "${BLUE}Deploy an encrypted Riff AMM contract.${NC}"
    echo -e "This AMM reveals price information through musical notes to the violin holder."
    echo -ne "Press Enter to continue..."
    read -r
}

prelude

dev_wallet
address=$DEV_WALLET_ADDRESS
privkey=$DEV_WALLET_PRIVKEY

print_step "1" "Deploying ViolinCoin tokens"
# First deploy the two tokens
BASE_DEPLOY=$(sforge create \
    --rpc-url "$RPC_URL" \
    --private-key "$privkey" \
    --broadcast \
    "src/ViolinCoin.sol:ViolinCoin" \
    --constructor-args "$address" "Base Asset" "BASE" 18)

QUOTE_DEPLOY=$(sforge create \
    --rpc-url "$RPC_URL" \
    --private-key "$privkey" \
    --broadcast \
    "src/ViolinCoin.sol:ViolinCoin" \
    --constructor-args "$address" "Quote Asset" "QUOTE" 18)

BASE_ADDRESS=$(echo "$BASE_DEPLOY" | grep "Deployed to:" | awk '{print $3}')
QUOTE_ADDRESS=$(echo "$QUOTE_DEPLOY" | grep "Deployed to:" | awk '{print $3}')

print_success "Base token deployed to: ${GREEN}$BASE_ADDRESS${NC}"
print_success "Quote token deployed to: ${GREEN}$QUOTE_ADDRESS${NC}"

print_step "2" "Deploying Riff AMM contract"
# Define the violin address (this should be an address that you control)
VIOLIN_ADDRESS="$address"  # Using the same wallet for simplicity, but you might want a separate one

# Deploy the Riff contract with the necessary constructor arguments
deploy_output=$(sforge create \
    --rpc-url "$RPC_URL" \
    --private-key "$privkey" \
    --broadcast \
    "$CONTRACT_PATH" \
    --constructor-args "$BASE_ADDRESS" "$QUOTE_ADDRESS" "1000000000000000000" "$address" "$VIOLIN_ADDRESS")

print_success "Success."

print_step "3" "Summarizing deployment"
contract_address=$(echo "$deploy_output" | grep "Deployed to:" | awk '{print $3}')
tx_hash=$(echo "$deploy_output" | grep "Transaction hash:" | awk '{print $3}')
echo "$contract_address" >"$DEPLOY_FILE"
echo -e "Riff AMM Contract Address: ${GREEN}$contract_address${NC}"
echo -e "Contract Link: ${GREEN}$EXPLORER_URL/address/$contract_address${NC}"
echo -e "Base Token Address: ${GREEN}$BASE_ADDRESS${NC}"
echo -e "Quote Token Address: ${GREEN}$QUOTE_ADDRESS${NC}"
echo -e "Violin Address: ${GREEN}$VIOLIN_ADDRESS${NC}"

echo -e "\n"
print_success "Success. You just deployed Riff AMM on Seismic!"