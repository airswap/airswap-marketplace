import { FC, ReactElement } from 'react';

import { SvgIconProps } from '../Icon';

const IconLaunch: FC<SvgIconProps> = ({ className = '' }): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 18 18"
  >
    {/* eslint-disable max-len */}
    <path
      d="M16 16H2V2H9V0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C17.1 18 18 17.1 18 16V9H16V16ZM11 0V2H14.59L4.76 11.83L6.17 13.24L16 3.41V7H18V0H11Z"
    />
  </svg>
);
export default IconLaunch;
