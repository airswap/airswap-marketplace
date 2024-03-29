import React, { FC, useEffect } from 'react';

import { AppErrorType } from '../../errors/appError';
import useCollectionToken from '../../hooks/useCollectionToken';
import useDefaultProvider from '../../hooks/useDefaultProvider';
import { useAppSelector } from '../../redux/hooks';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  tokenId: string;
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ tokenId, className = '' }) => {
  const { chainId, collectionToken } = useAppSelector(state => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { isLoadingBalances, tokenIdsWithBalance } = useAppSelector(state => state.balances);
  const { currencyTokenInfo, isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);
  const library = useDefaultProvider(chainId);

  const [collectionTokenInfo, isLoadingCollectionTokenInfo, error] = useCollectionToken(collectionToken, tokenId);
  const isLoading = isMetadataLoading || isLoadingCollectionTokenInfo || isLoadingBalances;
  const accountIsOwner = !!tokenIdsWithBalance[tokenId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isLoadingCollectionTokenInfo
    && !isMetadataLoading
    && isInitialized
    && collectionTokenInfo
    && currencyTokenInfo
    && library
  ) {
    return (
      <ConnectedNftDetailWidget
        accountIsOwner={accountIsOwner}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        library={library}
        className={className}
      />
    );
  }

  return (
    <DisconnectedNftDetailWidget
      isLoading={isLoading}
      isNftNotFound={error?.type === AppErrorType.notFound}
      isNetworkError={error?.type === AppErrorType.networkError}
      id={tokenId}
      className={className}
    />
  );
};

export default NftDetailWidget;
