import BigNumber from 'bignumber.js'
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
  OPEN_HEAD_ADDRESS,
} from "./agent";

describe("NFT mint threshold agent", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if no NFTs were minted with token ids that match a threshold ", async () => {
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(ERC721_TRANSFER_EVENT, OPEN_HEAD_ADDRESS);
    });

    it("returns a finding if a NFT was minted with a token id that matches a threshold ", async () => {
      const mockTetherTransferEvent = {
        args: {
          from: ethers.constants.AddressZero,
          to: "0xdef",
          tokenId: new BigNumber(5000)
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockTetherTransferEvent]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
            Finding.fromObject({
              name: "Open Head Mint Threshold Agent",
              description: "50% of Open Head collection has been minted",
              alertId: "FORTA-2",
              severity: FindingSeverity.Info,
              type: FindingType.Info,
              addresses: [mockTetherTransferEvent.args.to],
            }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(ERC721_TRANSFER_EVENT, OPEN_HEAD_ADDRESS);
    });
  });
});
