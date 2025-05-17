import React, { JSX } from 'react';
import { Progress } from 'antd';
import { useIntl } from 'react-intl';

import { t, TIntl } from '/imports/utils/i18n.util';

export type TStrengthProps = {
  meterValue: number;
  className?: string;
};

type TStrength = {
  text: string;
  colors: string[];
};

/**
 * Component that displays a meter of password strength
 *
 * @example
 * <Strength meterValue={2} />
 *
 * @param {number} props.meterValue - The value of the meter (0-4)
 * @param {string} [props.className] - Optional class name to add to the component
 * @returns {JSX.Element}
 */
const Strength: React.FC<TStrengthProps> = (
  props: TStrengthProps,
): JSX.Element => {
  const intl: TIntl = useIntl();

  const { meterValue, className } = props;

  const strength: TStrength[] = [
    {
      text: t(intl, 'auth.pwdStrengthWorst'),
      colors: ['#1a301f', '#fd1d1d'],
    },
    {
      text: t(intl, 'auth.pwdStrengthBad'),
      colors: ['#fd1d1d', '#fd7c1d'],
    },
    {
      text: t(intl, 'auth.pwdStrengthWeak'),
      colors: ['#fd7c1d', '#fdfc1d'],
    },
    {
      text: t(intl, 'auth.pwdStrengthGood'),
      colors: ['#fdfc1d', '#1dfd4b'],
    },
    {
      text: t(intl, 'auth.pwdStrengthStrong'),
      colors: ['#1dfd4b', '#1d36fd'],
    },
  ];

  const _strength = strength[meterValue];
  const percent = (meterValue + 1) * 20;

  return (
    <div className={className}>
      <Progress
        strokeColor={{ '0%': _strength.colors[0], '100%': _strength.colors[1] }}
        status={'active'}
        showInfo={false}
        percent={percent}
      />
      <span>{_strength.text}</span>
    </div>
  );
};

export default Strength;
