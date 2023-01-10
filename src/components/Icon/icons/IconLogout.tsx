import { FC, ReactElement } from 'react';

import { SvgIconProps } from '../Icon';

const IconLogout: FC<SvgIconProps> = ({ className = '' }): ReactElement => (
  <svg
    className={className}
    viewBox="0 0 20 19"
  >
    {/* eslint-disable max-len */}
    <path
      d="M15 4.47266L13.59 5.88266L16.17 8.47266H6V10.4727H16.17L13.59 13.0527L15 14.4727L20 9.47266L15 4.47266ZM2 2.47266H10V0.472656H2C0.9 0.472656 0 1.37266 0 2.47266V16.4727C0 17.5727 0.9 18.4727 2 18.4727H10V16.4727H2V2.47266Z"
      fill="white"
    />
  </svg>
);

export default IconLogout;
