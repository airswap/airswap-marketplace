import React, { FC, ReactNode } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import WalletConnector from '../../widgets/WalletConnector/WalletConnector';

import './Page.scss';

interface PageProps {
  children?: ReactNode;
}

const Page: FC<PageProps> = ({ children }) => {
  const { active } = useWeb3React<Web3Provider>();

  return (
    <div className="page">
      {/* top menu here */}
      {!active && <WalletConnector />}
      {children}
    </div>
  );
};

export default Page;
