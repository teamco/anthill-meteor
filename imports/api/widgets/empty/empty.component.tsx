import React from 'react';
import classnames from 'classnames';

import styles from './empty.module.less';

type TProps = {
  content: string;
  className?: string;
};

/**
 * EmptyComponent is a React functional component that renders a div
 * with optional custom styling and content.
 *
 * @param {TProps} props - The properties for the component.
 * @param {string} props.content - The content to be displayed inside the div.
 * @param {string} [props.className] - Optional class name for custom styling.
 * @returns {React.JSX.Element} The rendered div element.
 */
export const EmptyComponent: React.FC<TProps> = (
  props: TProps,
): React.JSX.Element => {
  return (
    <div className={classnames(styles.empty, props.className)}>
      {props.content}
    </div>
  );
};
