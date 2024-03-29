import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INDEXER_ORDERS_OFFSET } from '../../../constants/indexer';
import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { getUniqueArrayChildren } from '../../../helpers/array';
import { getCollectionOrders } from './collectionApi';

export interface CollectionState {
  hasServerError: boolean;
  isTotalOrdersReached: boolean;
  offset: number;
  orders: ExtendedFullOrder[];
  isLoading: boolean;
}

const initialState: CollectionState = {
  hasServerError: false,
  isTotalOrdersReached: false,
  offset: 0,
  orders: [],
  isLoading: false,
};

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: (): CollectionState => ({
      ...initialState,
    }),
    setOffset: (state, action: PayloadAction<number>): CollectionState => ({
      ...state,
      offset: action.payload,
    }),
    setOrders: (state, action: PayloadAction<ExtendedFullOrder[]>): CollectionState => ({
      ...state,
      orders: action.payload,
    }),
    startLoading: (state): CollectionState => ({
      ...state,
      isLoading: true,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getCollectionOrders.fulfilled, (state, action: PayloadAction<ExtendedFullOrder[]>): CollectionState => {
      const newOrders = getUniqueArrayChildren([
        ...state.orders,
        ...action.payload,
      ], 'nonce');
      const isTotalOrdersReached = action.payload.length < INDEXER_ORDERS_OFFSET;

      return {
        ...state,
        isLoading: false,
        isTotalOrdersReached,
        orders: newOrders,
      };
    });
    builder.addCase(getCollectionOrders.pending, (state): CollectionState => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getCollectionOrders.rejected, (state): CollectionState => ({
      ...state,
      hasServerError: true,
      isTotalOrdersReached: true,
      isLoading: false,
    }));
  },
});

export const {
  reset,
  setOffset,
  setOrders,
  startLoading,
} = collectionSlice.actions;

export default collectionSlice.reducer;
