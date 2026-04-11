export enum DealStatus {
  Funded         = 0,  // open — seller can browse and accept
  Accepted       = 1,  // seller accepted — delivery clock running
  ProofSubmitted = 2,  // seller submitted proof — 24h buyer review window
  Disputed       = 3,  // buyer opened dispute — 48h resolution window
  Completed      = 4,  // funds released to seller (2% fee taken)
  Cancelled      = 5,  // buyer cancelled before acceptance (3% fee taken)
  Refunded       = 6   // buyer won dispute — refunded
}

export interface Deal {
  buyer:            string
  seller:           string
  descriptionIPFS:  string
  amount:           bigint   // raw 6-decimal USDC (divide by 1e6 for display)
  deliveryDays:     bigint
  createdAt:        bigint   // unix timestamp
  acceptedAt:       bigint
  proofSubmittedAt: bigint
  disputeOpenedAt:  bigint
  proofIPFS:        string
  status:           DealStatus
  disputeBond:      bigint
}

export interface DealWithId extends Deal {
  id: number
}

export type UserRole = 'buyer' | 'seller' | null
