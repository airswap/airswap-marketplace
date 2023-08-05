import { FullOrder } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { getErc721Logs } from './nftDetailHelpers';
import { setTokenId } from './nftDetailSlice';

export const getNftOrderByTokenId = createAsyncThunk<
FullOrder | undefined,
number,
AppThunkApiConfig
>('nftDetail/getNftOrderByTokenId', async (tokenId, { dispatch, getState }) => {
  const { config, indexer } = getState();

  dispatch(setTokenId(tokenId));

  const orders = await getOrdersFromIndexers(
    {
      signerTokens: [config.collectionToken],
      offset: 0,
      limit: 999,
    },
    indexer.urls,
  );

  return orders.find((order) => order.signer.id === tokenId.toString());
});

interface GetNftTransactionHistoryParams {
  provider: Web3Provider;
  tokenId: number;
}

export const getNftTransactionReceipts = createAsyncThunk<
NftTransactionLog[],
GetNftTransactionHistoryParams,
AppThunkApiConfig
>('nftDetail/getNftTransactionReceipts', async ({ provider, tokenId }, { getState }) => {
  const { chainId, collectionToken } = getState().config;

  const logs = await getErc721Logs(
    chainId,
    collectionToken,
    provider,
    tokenId,
  );

  logs.reverse();

  return logs;
});
