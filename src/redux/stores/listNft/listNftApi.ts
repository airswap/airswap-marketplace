import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

export const getUserOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('listNft/getUserOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  const localFilter = filter;
  if (!localFilter.excludeNonces?.length) {
    delete localFilter.excludeNonces;
  }

  try {
    return await getOrdersFromIndexers(localFilter, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
