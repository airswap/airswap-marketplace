import React, { FC, useEffect } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';

import Accordion from '../../../../components/Accordion/Accordion';
import { isFullOrderExpired } from '../../../../entities/FullOrder/FullOrderHelpers';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';
import useNftTokenOwners from '../../../../hooks/useNftTokenOwners';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getNftOrderByTokenId, getNftTransactionReceipts } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { reset } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { routes } from '../../../../routes';
import NftDetailActivity from '../NftDetailActivity/NftDetailActivity';
import NftDetailAttributes from '../NftDetailAttributes/NftDetailAttributes';
import NftDetailContentContainer from '../NftDetailContentContainer/NftDetailContentContainer';
import NftDetailList from '../NftDetailList/NftDetailList';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
import NftDetailProceedButton from '../NftDetailProceedButton/NftDetailProceedButton';
import NftDetailSaleInfo from '../NftDetailSaleInfo/NftDetailSaleInfo';

interface ConnectedNftDetailWidgetProps {
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  library: BaseProvider;
  className?: string;
}

const ConnectedNftDetailWidget: FC<ConnectedNftDetailWidgetProps> = ({
  collectionTokenInfo,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { account } = useAppSelector((state) => state.web3);

  const { protocolFee } = useAppSelector(state => state.metadata);
  const {
    isLoading: isPriceLoading,
    isLoadingTransactionReceipts,
    order,
    transactionLogs,
  } = useAppSelector(state => state.nftDetail);

  const [owners, isOwnerLoading] = useNftTokenOwners(collectionTokenInfo);
  const isLoading = isPriceLoading || isOwnerLoading;
  const isExpired = order ? isFullOrderExpired(order) : false;
  const readableOwnerAddress = useAddressOrEnsName(owners?.length ? owners[0] : undefined, true);
  const accountRoute = owners?.length ? routes.profile(owners[0]) : undefined;
  const orderRoute = order ? routes.orderDetail(order.signer.wallet, order.nonce) : undefined;
  const listRoute = (owners === account && !order) ? routes.listNft(collectionTokenInfo.id.toString()) : undefined;

  useEffect(() => {
    dispatch(getNftOrderByTokenId(collectionTokenInfo.id));
    dispatch(getNftTransactionReceipts({ provider: library, tokenId: collectionTokenInfo.id }));

    return () => {
      dispatch(reset());
    };
  }, [collectionTokenInfo]);

  return (
    <div className={`nft-detail-widget ${className}`}>
      <NftDetailContentContainer className="nft-detail-widget__mobile-view">
        <NftDetailMainInfo
          accountRoute={accountRoute}
          owner={readableOwnerAddress}
          ownersLength={owners?.length}
          title={collectionTokenInfo.name}
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={collectionTokenInfo.image || collectionImage}
          className="nft-detail-widget__portrait"
        />
        <NftDetailSaleInfo
          isLoading={isLoading}
          order={order}
          tokenInfo={currencyTokenInfo}
          className="nft-detail-widget__price"
        />
        <Accordion
          isDefaultOpen
          label="Description"
          content={(
            <p>{collectionTokenInfo.description}</p>
          )}
          className="nft-detail-widget__description-accordion"
        />
        {((orderRoute || listRoute) && owners && account && !isLoading) && (
          <NftDetailProceedButton
            accountIsOwner={owners.includes(account)}
            isExpired={isExpired}
            orderRoute={orderRoute}
            listRoute={listRoute}
          />
        )}
        <Accordion
          label="Properties"
          content={(
            <NftDetailAttributes attrs={collectionTokenInfo.attributes} />
          )}
          className="nft-detail-widget__properties-accordion"
          isDefaultOpen
        />
        <Accordion
          label="Details"
          content={(
            <NftDetailList
              address={collectionToken}
              id={collectionTokenInfo.id}
              chainId={chainId}
              standard={collectionTokenInfo.kind}
              fee={protocolFee / 100}
            />
          )}
          className="nft-detail-widget__description-accordion"
        />
        <Accordion
          label="Item Activity"
          content={(
            <NftDetailActivity
              isLoading={isLoadingTransactionReceipts}
              chainId={chainId}
              logs={transactionLogs}
            />
          )}
          className="nft-detail-widget__description-accordion"
        />
      </NftDetailContentContainer>
      <NftDetailContentContainer className="nft-detail-widget__desktop-view">
        <div className="nft-detail-widget__column">
          <NftDetailPortrait
            backgroundImage={collectionTokenInfo.image || collectionImage}
            className="nft-detail-widget__portrait"
          />
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Details</h2>
            <div className="accordion__content accordion__content--has-border">
              <NftDetailList
                address={collectionToken}
                id={collectionTokenInfo.id}
                chainId={chainId}
                standard={collectionTokenInfo.kind}
                fee={protocolFee / 100}
              />
            </div>
          </div>
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Item activity</h2>
            <div className="accordion__content accordion__content--has-border">
              <NftDetailActivity
                isLoading={isLoadingTransactionReceipts}
                chainId={chainId}
                logs={transactionLogs}
              />
            </div>
          </div>
          <div className="nft-detail-widget__meta-container">
            <NftDetailAttributes attrs={collectionTokenInfo.attributes} />
          </div>
        </div>
        <div className="nft-detail-widget__column">
          <NftDetailMainInfo
            accountRoute={accountRoute}
            owner={readableOwnerAddress}
            ownersLength={owners?.length}
            title={collectionTokenInfo.name}
            className="nft-detail-widget__main-info"
          />
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Description</h2>
            <p>{collectionTokenInfo.description}</p>
          </div>
          <NftDetailSaleInfo
            isLoading={isLoading}
            order={order}
            tokenInfo={currencyTokenInfo}
            className="nft-detail-widget__price"
          />
          {((orderRoute || listRoute) && owners && account && !isLoading) && (
            <NftDetailProceedButton
              accountIsOwner={owners.includes(account)}
              isExpired={isExpired}
              listRoute={listRoute}
              orderRoute={orderRoute}
            />
          )}
        </div>
      </NftDetailContentContainer>
    </div>
  );
};

export default ConnectedNftDetailWidget;
