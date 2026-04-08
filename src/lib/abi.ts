export const ESCROW_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint256", "name": "_deliveryDays", "type": "uint256" }
    ],
    "name": "createDeal",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "deliveryDays", "type": "uint256" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "enum Escrow.Status", "name": "status", "type": "uint8" },
          { "internalType": "string", "name": "proofIpfs", "type": "string" }
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

export const CONTRACT_ADDRESS = "0x6041B51aB82E006AB6870D2Dfbf66aA32228617";
