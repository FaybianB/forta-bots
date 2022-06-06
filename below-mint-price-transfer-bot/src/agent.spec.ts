import {
    FindingType,
    FindingSeverity,
    Finding,
    HandleTransaction,
    createTransactionEvent,
    ethers,
} from "forta-agent";
import agent, {
    ERC721_TRANSFER_EVENT,
    ETHER_ROYALE_ADDRESS,
    MINT_PRICE,
} from "./agent";

// Equivalent to 0.069 ETH
const HEX_MINT_PRICE = "0xf5232269808000";

describe("Ether Royale NFT transfer agent", () => {
    let handleTransaction: HandleTransaction;

    beforeAll(() => {
        handleTransaction = agent.handleTransaction;
    });

    describe("handleTransaction", () => {
        it("returns empty findings if there are no Ether Royale NFT transfers", async () => {
            let transaction: { value: string } = {value: HEX_MINT_PRICE};
            const mockTxEvent = createTransactionEvent({transaction} as any);
            mockTxEvent.filterLog = jest.fn().mockReturnValue([]);
            const findings = await handleTransaction(mockTxEvent);

            expect(findings).toStrictEqual([]);
            expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
            expect(mockTxEvent.filterLog).toHaveBeenCalledWith(ERC721_TRANSFER_EVENT, ETHER_ROYALE_ADDRESS);
        });

        it("returns empty findings if there is a NFT transfer w/ ether value equal to mint price",async () => {
            let transaction: { value: string } = {value: HEX_MINT_PRICE};
            const mockTxEvent = createTransactionEvent({transaction} as any);
            const mockEtherRoyaleTransferEvent = {
                args: {
                    from: ethers.constants.AddressZero,
                    to: "0xdef",
                    value: MINT_PRICE,
                },
            };
            mockTxEvent.filterLog = jest.fn().mockReturnValue([mockEtherRoyaleTransferEvent]);
            const findings = await handleTransaction(mockTxEvent);

            expect(findings).toStrictEqual([]);
            expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
            expect(mockTxEvent.filterLog).toHaveBeenCalledWith(ERC721_TRANSFER_EVENT, ETHER_ROYALE_ADDRESS);
        });

        it("returns a finding if there is a NFT transfer w/ ether value less than mint price", async () => {
            let transaction: { value: string } = {value: "0x0"};
            const mockTxEvent = createTransactionEvent({transaction} as any);
            const mockEtherRoyaleTransferEvent = {
                args: {
                    from: ethers.constants.AddressZero,
                    to: "0xdef",
                    value: 0,
                },
            };
            mockTxEvent.filterLog = jest.fn().mockReturnValue([mockEtherRoyaleTransferEvent]);
            const findings = await handleTransaction(mockTxEvent);

            expect(findings).toStrictEqual([
                Finding.fromObject({
                name: "Ether Royale NFT Mint Price Agent",
                description: "An Ether Royale NFT was minted for less than mint price",
                alertId: "FORTA-1",
                severity: FindingSeverity.High,
                type: FindingType.Suspicious,
                addresses: [mockEtherRoyaleTransferEvent.args.to],
                }),
            ]);
            expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
            expect(mockTxEvent.filterLog).toHaveBeenCalledWith(ERC721_TRANSFER_EVENT, ETHER_ROYALE_ADDRESS);
        });
    });
});
