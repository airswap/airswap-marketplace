import { FullOrder } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOffset } from './collectionSlice';

interface GetCollectionOrdersParams {
  limit: number;
  offset: number;
  provider: BaseProvider;
}

export const getCollectionOrders = createAsyncThunk<
FullOrder[],
GetCollectionOrdersParams,
AppThunkApiConfig
>('collection/getCollectionOrders', async ({ provider, ...filter }, { dispatch, getState }) => {
  const { config, indexer } = getState();

  const { collectionToken, currencyToken } = config;
  // const { transactions } = transactionsState;
  // const orderTransactions = transactions.filter(isOrderTransaction);
  // const cancelTransactions = transactions.filter(isCancelOrderTransaction);
  // const excludeNonces = [...orderTransactions, ...cancelTransactions].map(transaction => transaction.order.nonce);

  dispatch(setOffset(filter.limit + filter.offset));

  try {
    return await getOrdersFromIndexers(
      {
        ...filter,
        signerToken: collectionToken,
        senderToken: currencyToken,
      },
      indexer.urls,
      provider,
    );
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
