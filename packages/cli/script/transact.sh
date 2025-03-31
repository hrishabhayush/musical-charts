#!/bin/bash

set -e

source ../../config.sh
source ../common/print.sh
source ../common/wallet.sh

contract_address=$(cat ../contract/out/deploy.txt)

prelude() {
    echo -e "${BLUE}Transact with an encrypted contract in <1m.${NC}"
    echo -e "It'll increment by 3, try to read it, but get back ??? because 3 < 5."
    echo -e "Then it'll increment by 2, try to read it, and succeed because 5 >= 5."
    echo -ne "Press Enter to continue..."
    read -r
}

prelude

dev_wallet
address=$DEV_WALLET_ADDRESS
privkey=$DEV_WALLET_PRIVKEY

bun run src/index.ts $RPC_URL $EXPLORER_URL $contract_address $privkey