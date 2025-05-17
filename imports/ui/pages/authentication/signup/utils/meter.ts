/**
 * Password strength estimator inspired by password crackers
 * @link https://github.com/dropbox/zxcvbn
 * @type {{}}
 */
import zxcvbn from 'zxcvbn';

/**
 * Updates the password strength meter based on the input value
 * @param {{ e: React.ChangeEvent<HTMLSelectElement>, setMeterValue: (value: string | number) => void, setMeterText: (value: string | number) => void }} props
 * @returns {void}
 */
export const onUpdateMeter = ({
  value,
  setMeterValue,
}: {
  value: string;
  setMeterValue: (value: number) => void;
}): void => {
  const result = zxcvbn(value);

  const meterValue = value.length ? result.score : 0;

  // Update the password strength meter
  setMeterValue(meterValue);
};
