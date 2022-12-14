import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchBalances } from './balancesApi';

export const configureBalancesSubscriber = () => {
  let tokenKeysString: string;

  store.subscribe(() => {
    const { metadata, web3 } = store.getState();

    const newTokenKeys = Object.keys(metadata.tokens);
    const newTokenKeysString = newTokenKeys.toString();

    if (
      tokenKeysString !== newTokenKeysString
      && newTokenKeys.length
      && web3.chainId
      && web3.account
    ) {
      tokenKeysString = newTokenKeysString;

      const library = getLibrary(web3.chainId);

      store.dispatch(fetchBalances({
        chainId: web3.chainId,
        provider: library,
        tokenAddresses: Object.keys(metadata.tokens),
        walletAddress: web3.account,
      }));
    }
  });
};
