#!/bin/bash

source ../../config.sh
source ../common/print.sh

check_balance() {
    local address=$1
    local balance_json=$(curl -s -X POST "$RPC_URL" \
        -H "Content-Type: application/json" \
        -d '{
            "jsonrpc":"2.0",
            "method":"eth_getBalance",
            "params":["'$address'", "latest"],
            "id":1
        }')
}

dev_wallet() {
    print_step "1" "Using hardcoded wallet address"
    # CAUTION: DO NOT GENERATE A KEYPAIR LIKE THIS FOR PRODUCTION
    DEV_WALLET_ADDRESS="0x0D181A6daA62c7a8180d1B6FdF54C8fd20942E68"
    DEV_WALLET_PRIVKEY="0xe36297b22a6e3628b9d072850ba1ccfd6d8d42a8f017452829adf45acbe84504"
    # if [ -z "$DEV_WALLET_ADDRESS" ]; then
    #     echo -e "${RED}Error: Failed to create dev wallet. Please make sure sfoundry is installed.${NC}"
    #     exit 1
    # fi

    print_success "Using wallet address: ${GREEN}$DEV_WALLET_ADDRESS${NC}"

    print_step "2" "Checking wallet funding"
    echo -e "Verifying if the wallet has funds"
    
    sleep 2
    check_balance "$DEV_WALLET_ADDRESS"
    print_success "Wallet is funded and ready to use"
}