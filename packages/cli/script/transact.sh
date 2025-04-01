#!/bin/bash

set -e

source ../../config.sh
source ../common/print.sh
source ../common/wallet.sh

contract_address=$(cat ../contract/out/deploy.txt)

prelude() {
    echo -e "${BLUE}Transact with an encrypted contract in <1m.${NC}"
    echo -e "It'll show a transaction of swapping on an ecrypted AMM."
    echo -e "The transactions happen but the price is never revealed."
    echo -ne "Press Enter to continue..."
    read -r
}

prelude

dev_wallet
address=$DEV_WALLET_ADDRESS
privkey=$DEV_WALLET_PRIVKEY

bun run src/index.ts $RPC_URL $EXPLORER_URL $contract_address $privkey