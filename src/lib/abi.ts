import { getAddress } from 'viem';

export const CONTRACT_ADDRESS = getAddress('0x8196d7C6296D7b47C70c85B98620D9bAea9719eb');
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'; // Arc USDC Address
export const USDC_DECIMALS = 6;

export const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ESCROW_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint256", "name": "_deliveryDays", "type": "uint256" }
    ],
    "name": "createDeal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_dealId", "type": "uint256" }],
    "name": "acceptDeal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_dealId", "type": "uint256" },
      { "internalType": "string", "name": "_proofIpfs", "type": "string" }
    ],
    "name": "submitProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_dealId", "type": "uint256" }],
    "name": "approveRelease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_dealId", "type": "uint256" }],
    "name": "dispute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeals",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "buyer", "type": "address" },
          { "internalType": "address", "name": "seller", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "deliveryDays", "type": "uint256" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "acceptedAt", "type": "uint256" },
          { "internalType": "string", "name": "proofIpfs", "type": "string" },
          { "internalType": "enum Escrow.Status", "name": "status", "type": "uint8" }
        ],
        "internalType": "struct Escrow.Deal[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
