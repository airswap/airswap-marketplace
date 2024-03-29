import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/utils';
import { BaseProvider } from '@ethersproject/providers';
import { useSearchParams } from 'react-router-dom';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import Helmet from '../../../../compositions/Helmet/Helmet';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import OrdersContainer from '../../../../containers/OrdersContainer/OrdersContainer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import getOwnedTokensByAccountUrl from '../../../../helpers/airswap/getOwnedTokensByAccountUrl';
import useCollectionImage from '../../../../hooks/useCollectionImage';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import { useGetOrders } from '../../../../hooks/useGetOrders';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { useFilters } from '../../../../redux/stores/filters/filtersHooks';
import { getProfileOrders } from '../../../../redux/stores/profileOrders/profileOrdersApi';
import { reset, startLoading } from '../../../../redux/stores/profileOrders/profileOrdersSlice';
import ProfileHeader from '../../../ProfileWidget/subcomponents/ProfileHeader/ProfileHeader';
import getListCallToActionText from '../../helpers/getListCallToActionText';

interface ConnectedProfileOrdersWidgetProps {
  account?: string;
  currencyTokenInfo: TokenInfo;
  profileAccount: string;
  provider: BaseProvider;
  className?: string;
}

const ConnectedProfileOrdersWidget: FC<ConnectedProfileOrdersWidgetProps> = ({
  account,
  currencyTokenInfo,
  profileAccount,
  provider,
  className = '',
}): ReactElement => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { bannerImage } = useCollectionImage();
  const scrolledToBottom = useScrollToBottom();
  useFilters();

  const { chainId, collectionToken } = useAppSelector((state) => state.config);
  const { tokenIdsWithBalance: userTokenIdsWithBalance } = useAppSelector((state) => state.balances);
  const { activeTags } = useAppSelector((state) => state.filters);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const {
    hasServerError,
    isLoading,
    isTotalOrdersReached,
    offset,
    orders,
  } = useAppSelector((state) => state.profileOrders);

  const userTokens = Object.keys(userTokenIdsWithBalance);
  const highlightOrderNonce = searchParams.get('highlightOrderNonce');
  const [searchValue, setSearchValue] = useState('');

  const ensAddress = useEnsAddress(profileAccount);
  const accountUrl = useMemo(() => (
    profileAccount ? getOwnedTokensByAccountUrl(chainId, profileAccount, collectionToken) : undefined
  ), [profileAccount, chainId, collectionToken]);
  const tokenIds = useMemo(() => orders.map(order => order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);
  const filteredOrders = useMemo(() => (
    orders.filter(order => {
      const orderToken = tokens.find(token => token.id === order.signer.id);

      return orderToken ? filterCollectionTokenBySearchValue(orderToken, searchValue) : true;
    })), [orders, tokens, searchValue]);
  const userIsProfileAccount = account === profileAccount;
  const hasFilter = !!searchValue || !!activeTags.length;
  const listCallToActionText = getListCallToActionText(hasFilter, !!orders.length, hasServerError);

  const getOrders = (newOffset: number) => {
    dispatch(getProfileOrders({
      signerWallet: profileAccount,
      offset: newOffset,
      limit: INDEXER_ORDERS_OFFSET,
      provider,
      tags: activeTags,
    }));
  };

  useGetOrders(
    activeTags,
    getOrders,
    reset,
    startLoading,
  );

  useEffect(() => {
    if (scrolledToBottom && !isTotalOrdersReached && !isLoading) {
      getOrders(offset);
    }
  }, [scrolledToBottom]);

  return (
    <div className={`profile-orders-widget ${className}`}>
      <Helmet title={`Listed orders of ${ensAddress || profileAccount}`} />
      <ProfileHeader
        accountUrl={accountUrl}
        address={profileAccount}
        avatarUrl={avatarUrl}
        backgroundImage={bannerImage}
        ensAddress={ensAddress}
        className="profile-widget__header"
      />

      <div className="profile-orders-widget__content">
        <SearchInput
          placeholder="Search listings"
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue || ''}
          className="profile-orders-widget__search-input"
        />
        <OrdersContainer
          hasListCallToActionButton={!!userTokens.length && userIsProfileAccount && !hasServerError}
          isEndOfOrders={isTotalOrdersReached}
          isLoading={isLoading || offset === 0}
          showExpiryDate
          showSearchResults={hasFilter}
          currencyTokenInfo={currencyTokenInfo}
          highlightOrderNonce={highlightOrderNonce || undefined}
          listCallToActionText={listCallToActionText}
          orders={filteredOrders}
          tokens={tokens}
          className="profile-orders-widget__nfts-container"
        />
      </div>
    </div>
  );
};

export default ConnectedProfileOrdersWidget;
