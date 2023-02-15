import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import BuyNftWidget from '../../widgets/BuyNftWidget/BuyNftWidget';
import NftDetailWidget from '../../widgets/NftDetailWidget/NftDetailWidget';

const NftDetailPage: FC = () => (
  // Logic for 404 page here

  // Else go to widget
  <Page>
    <NftDetailWidget />
    <BuyNftWidget />
  </Page>
);

export default NftDetailPage;
