import React, { FC } from 'react';

import {
  IconAirswap,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconBars,
  IconBin,
  IconCampaign,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUpDown,
  IconClose,
  IconCloseCircleOutline,
  IconCode,
  IconContactSupport,
  IconCopy,
  IconCopy2,
  IconDarkModeSwitch,
  IconDeny,
  IconDiscord,
  IconEdit,
  IconForbidden,
  IconGithub,
  IconLaunch,
  IconLibrary,
  IconLink,
  IconLogout,
  IconMedium,
  IconMenu,
  IconPending,
  IconPlus,
  IconStar,
  IconSwap,
  IconSwapHorizontal,
  IconTelegram,
  IconTransaction,
  IconTwitter,
  IconVote,
  IconX,
} from './icons';

import './Icon.scss';

export interface SvgIconProps {
  className?: string;
}

export type IconSet = {
  [key: string]: FC<IconProps>;
};

export const icons: IconSet = {
  learn: IconLibrary,
  airswap: IconAirswap,
  'arrow-down': IconArrowDown,
  'arrow-right': IconArrowRight,
  'arrow-left': IconArrowLeft,
  bars: IconBars,
  bin: IconBin,
  'button-x': IconX,
  campaign: IconCampaign,
  check: IconCheck,
  'chevron-down': IconChevronDown,
  'chevron-right': IconChevronRight,
  'chevron-up-down': IconChevronUpDown,
  close: IconClose,
  'close-circle-outline': IconCloseCircleOutline,
  code: IconCode,
  copy: IconCopy,
  copy2: IconCopy2,
  'contact-support': IconContactSupport,
  'dark-mode-switch': IconDarkModeSwitch,
  deny: IconDeny,
  discord: IconDiscord,
  edit: IconEdit,
  launch: IconLaunch,
  logout: IconLogout,
  // 'exit-modal': HiX,
  forbidden: IconForbidden,
  github: IconGithub,
  // 'information-circle-outline': IoMdInformationCircleOutline,
  menu: IconMenu,
  medium: IconMedium,
  plus: IconPlus,
  // settings: IoMdSettings,
  star: IconStar,
  swap: IconSwap,
  'swap-horizontal': IconSwapHorizontal,
  telegram: IconTelegram,
  // 'transaction-completed': BiCheck,
  // 'transaction-failed': HiX,
  'transaction-pending': IconPending,
  'transaction-link': IconLink,
  transaction: IconTransaction,
  twitter: IconTwitter,
  'wallet-link': IconLink,
  vote: IconVote,
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, className = '' }) => {
  const IconComponent = icons[name];

  return IconComponent
    ? <IconComponent name={name} className={`icon-component ${className}`} />
    : null;
};

export default Icon;
