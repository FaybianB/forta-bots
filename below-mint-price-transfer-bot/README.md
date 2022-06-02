# Ether Royale Mint Price Detection Agent

## Description

This agent fires an alert if it detects a mint transaction with an ether value less than the
cost to mint (mint price * number of NFTs minted). For example, given a mint price of 0.069 ether, if
2 NFTs are minted in the transaction then the amount of ether sent to the contract should be 0.138 ether (excluding
gas), otherwise, raise an alert.

The inspiration for this bot came from a real-world exploit of the Ether Royale NFT (https://etherroyale.io/)
project's contract (https://etherscan.io/address/0xd3dbbade0b048e811b8dea2b7b3f71dd5e4dfee8#code) that allowed
users to mint NFTs for FREE! The problem was that the contract author omitted the custom modifier (`correctPayment`)
from the custom mint function (`saleMint`) that validated that the correct ether amount was sent to the contract.

## Supported Chains

- Ethereum

## Alerts

This agent only fires a single alert per transaction.

- FORTA-1
  - Severity is always set to "High"
  - Type is always set to "Suspicious"
  - "addresses" contains the list of addresses that received a transfer from address zero in
  the transaction.

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x936c7ebc91101157e5b61b410643020ead62e1d887d80220e8a7e1ffbadb79a2 (1 Ether Royale NFT minted
for mint price - 0.069 ether)
- 0xd47a75d602f429aefa990ddf81b59b91763875ad8fda590c72157b6a04726574 (10 Ether Royale NFTs minted
for below mint price - 0 ether)
