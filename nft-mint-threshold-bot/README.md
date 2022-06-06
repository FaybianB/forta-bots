# NFT Mint Threshold Agent

## Description

This agent detects when a certain percentage of a NFT collection has been minted, by examining
mint transactions for a given NFT contract and comparing the token id of the minted NFT to
the max supply.

For example, the Open Head NFT project (https://www.openheadnft.com/) has a maximum supply of `10,000` NFTs and has minted 3069 NFTs at the time
of writing. The agent is configured to raise an alert when the mint thresholds reach 25%, 50%, 75%
and 100% of the collection. Given the equation (`10,000 * mint threshold percentage`), the corresponding
token ids of the mint thresholds are `2500`, `5000`, `7500` and `10,000`. When a new NFT is minted,
the token id of the mint transaction is compared with these values and an alert is raised if a match is found.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
    - Fired when a transaction contains a transfer from the ethereum zero address with a token id that
  matches the 25% mint threshold.
    - Severity is always set to "info"
    - Type is always set to "info"
    - The `address` attribute contains the recipient address of the NFT transfer.

- FORTA-2
    - Fired when a transaction contains a transfer from the ethereum zero address with a token id that
    matches the 50% mint threshold.
    - Severity is always set to "info"
    - Type is always set to "info"
    - The `address` attribute contains the recipient address of the NFT transfer.

- FORTA-3
    - Fired when a transaction contains a transfer from the ethereum zero address with a token id that
    matches the 75% mint threshold.
    - Severity is always set to "info"
    - Type is always set to "info"
    - The `address` attribute contains the recipient address of the NFT transfer.

- FORTA-4
    - Fired when a transaction contains a transfer from the ethereum zero address with a token id that
    matches the 100% mint threshold.
    - Severity is always set to "info"
    - Type is always set to "info"
    - The `address` attribute contains the recipient address of the NFT transfer.

## Test Data

The agent behaviour can be verified with the following transaction:

- 0x680d31f31404581c7a66a850c1b318e6236893c3f354c785d1351295cd5c8059 (25% threshold match)
