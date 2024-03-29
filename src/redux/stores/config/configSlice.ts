import { TokenKinds } from '@airswap/utils';
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { getCollectionTokenKind, getCurrencyTokenKind, getSwapContractAddress } from './configApi';
import {
  getCurrencyTokenAddress,
  getSwapContractAddressLocalStorageKey,
  getTokenKindFromLocalStorage,
  getTokenKindLocalStorageKey,
} from './configHelpers';

export interface ConfigState {
  hasFailedCollectionToken: boolean;
  hasFailedCurrencyToken: boolean;
  hasFailedSwapContract: boolean;
  isDemoAccount: boolean;
  isLoadingCollectionTokenKind: boolean;
  isLoadingCurrencyTokenKind: boolean;
  chainId: number;
  currencyToken: string;
  currencyTokenKind?: TokenKinds;
  collectionToken: string;
  collectionTokenKind?: TokenKinds;
  collectionName: string;
  collectionImage: string;
  impersonateAddress?: string;
  storageServerUrl: string;
  swapContractAddress?: string | null;
}

const collectionToken = (process.env.REACT_APP_COLLECTION_TOKEN || '').toLowerCase();
const chainIdFallback = 1;
const chainId = process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : chainIdFallback;
const currencyToken = getCurrencyTokenAddress(chainId);

const initialState: ConfigState = {
  hasFailedCollectionToken: false,
  hasFailedCurrencyToken: false,
  hasFailedSwapContract: false,
  isDemoAccount: !!process.env.REACT_APP_IMPERSONATE_ADDRESS,
  isLoadingCollectionTokenKind: false,
  isLoadingCurrencyTokenKind: false,
  chainId,
  currencyToken,
  currencyTokenKind: getTokenKindFromLocalStorage(localStorage.getItem(getTokenKindLocalStorageKey(currencyToken))),
  collectionToken,
  collectionTokenKind: getTokenKindFromLocalStorage(localStorage.getItem(getTokenKindLocalStorageKey(collectionToken))),
  collectionName: process.env.REACT_APP_COLLECTION_NAME || '',
  collectionImage: process.env.REACT_APP_COLLECTION_IMAGE || '',
  impersonateAddress: process.env.REACT_APP_IMPERSONATE_ADDRESS,
  storageServerUrl: process.env.REACT_APP_STORAGE_SERVER_URL || '',
  swapContractAddress: localStorage.getItem(getSwapContractAddressLocalStorageKey(chainId)),
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    reset: (): ConfigState => ({
      ...initialState,
    }),
    disableDemoAccount: (state): ConfigState => ({
      ...state,
      impersonateAddress: undefined,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getCollectionTokenKind.pending, (state): ConfigState => ({
      ...state,
      isLoadingCollectionTokenKind: true,
    }));
    builder.addCase(getCollectionTokenKind.fulfilled, (state, action): ConfigState => {
      if (action.payload) {
        localStorage.setItem(getTokenKindLocalStorageKey(collectionToken), action.payload);
      }

      return {
        ...state,
        isLoadingCollectionTokenKind: false,
        collectionTokenKind: action.payload,
      };
    });
    builder.addCase(getCollectionTokenKind.rejected, (state): ConfigState => ({
      ...state,
      isLoadingCollectionTokenKind: false,
      hasFailedCollectionToken: true,
    }));
    builder.addCase(getCurrencyTokenKind.pending, (state): ConfigState => ({
      ...state,
      isLoadingCurrencyTokenKind: true,
    }));
    builder.addCase(getCurrencyTokenKind.fulfilled, (state, action): ConfigState => {
      if (action.payload) {
        localStorage.setItem(getTokenKindLocalStorageKey(currencyToken), action.payload);
      }

      return {
        ...state,
        isLoadingCurrencyTokenKind: false,
        currencyTokenKind: action.payload,
      };
    });
    builder.addCase(getCurrencyTokenKind.rejected, (state): ConfigState => ({
      ...state,
      isLoadingCurrencyTokenKind: false,
      hasFailedCurrencyToken: true,
    }));
    builder.addCase(getSwapContractAddress.fulfilled, (state, action): ConfigState => {
      if (action.payload) {
        localStorage.setItem(getSwapContractAddressLocalStorageKey(chainId), action.payload);
      }

      return {
        ...state,
        swapContractAddress: action.payload,
      };
    });
    builder.addCase(getSwapContractAddress.rejected, (state): ConfigState => ({
      ...state,
      swapContractAddress: null,
      hasFailedSwapContract: true,
    }));
  },
});

export const { reset, disableDemoAccount } = configSlice.actions;

export const selectConfigFailed = ({ config }: RootState): boolean => config.hasFailedCurrencyToken
    || config.hasFailedSwapContract
    || config.hasFailedCollectionToken;

export default configSlice.reducer;
