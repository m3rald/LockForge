export const LOCKFORGE_ABI = [
  // ── Write Functions ──────────────────────────────────
  {
    name: "createDeal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "descriptionIPFS", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "deliveryDays", type: "uint256" }
    ],
    outputs: [{ name: "dealId", type: "uint256" }]
  },
  {
    name: "acceptDeal",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    name: "submitProof",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "proofIPFS", type: "string" }
    ],
    outputs: []
  },
  {
    name: "approveRelease",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    name: "openDispute",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    name: "claimAutoRelease",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    name: "resolveDisputeAuto",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    name: "claimRefund",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  // ── Read Functions ───────────────────────────────────
  {
    name: "getDeal",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "buyer",            type: "address" },
          { name: "seller",           type: "address" },
          { name: "descriptionIPFS",  type: "string"  },
          { name: "amount",           type: "uint256" },
          { name: "deliveryDays",     type: "uint256" },
          { name: "createdAt",        type: "uint256" },
          { name: "acceptedAt",       type: "uint256" },
          { name: "proofSubmittedAt", type: "uint256" },
          { name: "disputeOpenedAt",  type: "uint256" },
          { name: "proofIPFS",        type: "string"  },
          { name: "status",           type: "uint8"   },
          { name: "disputeBond",      type: "uint256" }
        ]
      }
    ]
  },
  {
    name: "getBuyerDeals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "buyer", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    name: "getSellerDeals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "seller", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    name: "getFundedDeals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    name: "getBatchDeals",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "dealIds", type: "uint256[]" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "buyer",            type: "address" },
          { name: "seller",           type: "address" },
          { name: "descriptionIPFS",  type: "string"  },
          { name: "amount",           type: "uint256" },
          { name: "deliveryDays",     type: "uint256" },
          { name: "createdAt",        type: "uint256" },
          { name: "acceptedAt",       type: "uint256" },
          { name: "proofSubmittedAt", type: "uint256" },
          { name: "disputeOpenedAt",  type: "uint256" },
          { name: "proofIPFS",        type: "string"  },
          { name: "status",           type: "uint8"   },
          { name: "disputeBond",      type: "uint256" }
        ]
      }
    ]
  },
  {
    name: "getFeeBreakdown",
    type: "function",
    stateMutability: "pure",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [
      { name: "platformFee",    type: "uint256" },
      { name: "sellerPayout",   type: "uint256" },
      { name: "cancelFee",      type: "uint256" },
      { name: "cancelRefund",   type: "uint256" },
      { name: "disputeBond",    type: "uint256" },
      { name: "gasEstimate",    type: "uint256" },
      { name: "createTotalCost",type: "uint256" }
    ]
  },
  {
    name: "getReviewWindowStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      { name: "reviewDeadline",   type: "uint256" },
      { name: "secondsRemaining", type: "uint256" },
      { name: "canDispute",       type: "bool"    },
      { name: "canAutoRelease",   type: "bool"    }
    ]
  },
  {
    name: "getDisputeWindowStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      { name: "disputeDeadline",  type: "uint256" },
      { name: "secondsRemaining", type: "uint256" },
      { name: "canAutoResolve",   type: "bool"    },
      { name: "bondAmount",       type: "uint256" }
    ]
  },
  {
    name: "getDeliveryStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      { name: "deliveryDeadline", type: "uint256" },
      { name: "secondsRemaining", type: "uint256" },
      { name: "isOverdue",        type: "bool"    }
    ]
  },
  {
    name: "getPlatformStats",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "totalDeals",       type: "uint256" },
      { name: "fundedCount",      type: "uint256" },
      { name: "completedCount",   type: "uint256" },
      { name: "totalLockedUsdc6", type: "uint256" },
      { name: "totalFeesUsdc6",   type: "uint256" }
    ]
  },
  {
    name: "checkUsdcAllowance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "checkUsdcBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "getTotalDeals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const

export const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount",  type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner",   type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const
