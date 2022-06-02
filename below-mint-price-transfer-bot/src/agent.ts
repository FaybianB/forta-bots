import BigNumber from 'bignumber.js'
import {
    Finding,
    HandleTransaction,
    TransactionEvent,
    FindingSeverity,
    FindingType,
    ethers
} from "forta-agent";

export const ERC721_TRANSFER_EVENT =
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)";
export const ETHER_ROYALE_ADDRESS = "0xd3dbbade0b048e811b8dea2b7b3f71dd5e4dfee8";
export const ETHER_DECIMALS = 18;
// Ether Royale NFT mint price represented in ETH, not WEI
export const MINT_PRICE = 0.069;

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
    // Shift decimals of transfer value so the values appear in ETH format
    const normalizedValue = new BigNumber(txEvent.transaction.value).div(10 ** ETHER_DECIMALS);
    // Filter the transaction logs for Ether Royale NFT transfer events
    const etherRoyaleTransferEvents = txEvent.filterLog(ERC721_TRANSFER_EVENT, ETHER_ROYALE_ADDRESS);
    let nftsMinted = 0;
    let addresses: string[] = [];

    etherRoyaleTransferEvents.forEach((transferEvent) => {
        // extract transfer event arguments
        const { to, from } = transferEvent.args;

        if (from === ethers.constants.AddressZero) {
            // Add the minters address to the list of involved addresses, if not already included
            if(!addresses.includes(to)) {
                addresses.push(to);
            }

            nftsMinted++;
        }
    });

    // Report if the amount of ether sent is less than the cost of minting the number of NFTs in the transaction
    if (normalizedValue.isLessThan(MINT_PRICE * nftsMinted)) {
        return [
            Finding.fromObject({
                name: "Ether Royale NFT Mint Price Agent",
                description: `An Ether Royale NFT was minted for less than mint price`,
                alertId: "FORTA-1",
                severity: FindingSeverity.High,
                type: FindingType.Suspicious,
                addresses,
            }),
        ];
    }

    return [];
};

export default {
    handleTransaction,
};
