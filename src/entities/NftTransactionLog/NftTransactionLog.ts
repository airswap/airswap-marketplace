export interface NftTransactionLog {
  key: string;
  blockNumber: number;
  from: string;
  recipient: string;
  timestamp?: number,
  to: string;
  tokenId: string;
  transactionHash: string;
}
