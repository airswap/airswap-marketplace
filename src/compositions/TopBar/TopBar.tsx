import React, { FC } from 'react';

import classNames from 'classnames';

import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';

import './TopBar.scss';

interface TopBarProps {
  mobileMenuIsVisible: boolean;
  onMobileMenuButtonClick: () => void;
  className?: string;
}

const TopBar: FC<TopBarProps> = ({ mobileMenuIsVisible, onMobileMenuButtonClick, className = '' }) => {
  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);

  return (
    <div className={containerClassName}>
      <IconButton
        hideLabel
        icon="airswap"
        text="AirSwap button"
        className="top-bar__airswap-button"
      />
      <IconButton
        hideLabel
        icon={!mobileMenuIsVisible ? 'menu' : 'close'}
        text="Menu button"
        onClick={onMobileMenuButtonClick}
        className="top-bar__menu-button"
        iconClassName="top-bar__menu-button-icon"
      />
      <IconNavLink
        icon="plus"
        text="List"
        to={`/${AppRoutes.listNft}`}
        className="top-bar__list-button"
        iconClassName="top-bar__list-button-icon"
      />
    </div>
  );
};

export default TopBar;
