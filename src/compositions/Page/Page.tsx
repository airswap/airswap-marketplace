import React, { FC, ReactNode, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import WalletConnector from '../../widgets/WalletConnector/WalletConnector';
import MobileMenu from '../MobileMenu/MobileMenu';
import TopBar from '../TopBar/TopBar';

import './Page.scss';

interface PageProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const Page: FC<PageProps> = ({ className = '', contentClassName = '', children }) => {
  const { active } = useWeb3React<Web3Provider>();

  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState<boolean>(false);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={`page ${className}`}>
      <TopBar
        mobileMenuIsVisible={mobileMenuIsVisible}
        onMobileMenuButtonClick={handleIconButtonClick}
        className="page__top-bar"
      />

      <MobileMenu
        isHidden={!mobileMenuIsVisible}
        className="page__mobile-menu"
      />
      {!active && <WalletConnector className="page__wallet-connector" />}

      <div className={`page__content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Page;
