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
export const OPEN_HEAD_ADDRESS = "0xca6788C8eFa6A1c8Bc97FA98938fa361d51eF823";
export const OPEN_HEAD_MAX_SUPPLY = 10000;

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
    // Filter the transaction logs for NFT transfer events
    const openHeadTransferEvents = txEvent.filterLog(ERC721_TRANSFER_EVENT, OPEN_HEAD_ADDRESS);
    const findings: Finding[] = [];

    openHeadTransferEvents.forEach((transferEvent) => {
        // extract transfer event arguments
        const { to, from, tokenId } = transferEvent.args;
        let normalizedTokenId = tokenId.toNumber();

        if (from === ethers.constants.AddressZero) {
            if (normalizedTokenId === Math.floor(OPEN_HEAD_MAX_SUPPLY * .25) ) {
                console.log(tokenId);
                findings.push(
                    Finding.fromObject({
                        name: "Open Head Mint Threshold Agent",
                        description: "25% of Open Head collection has been minted",
                        alertId: "FORTA-1",
                        severity: FindingSeverity.Info,
                        type: FindingType.Info,
                        addresses: [to],
                    })
                );
            } else if (normalizedTokenId === Math.floor(OPEN_HEAD_MAX_SUPPLY * .5) ) {
                findings.push(
                    Finding.fromObject({
                        name: "Open Head Mint Threshold Agent",
                        description: "50% of Open Head collection has been minted",
                        alertId: "FORTA-2",
                        severity: FindingSeverity.Info,
                        type: FindingType.Info,
                        addresses: [to],
                    })
                );
            } else if (normalizedTokenId === Math.floor(OPEN_HEAD_MAX_SUPPLY * .75) ) {
                findings.push(
                    Finding.fromObject({
                        name: "Open Head Mint Threshold Agent",
                        description: "75% of Open Head collection has been minted",
                        alertId: "FORTA-3",
                        severity: FindingSeverity.Info,
                        type: FindingType.Info,
                        addresses: [to],
                    })
                );
            } else if (normalizedTokenId === OPEN_HEAD_MAX_SUPPLY) {
                findings.push(
                    Finding.fromObject({
                        name: "Open Head Mint Threshold Agent",
                        description: "100% of Open Head collection has been minted",
                        alertId: "FORTA-4",
                        severity: FindingSeverity.Info,
                        type: FindingType.Info,
                        addresses: [to],
                    })
                );
            }
        }
    });

    return findings;
};

export default {
    handleTransaction,
};
