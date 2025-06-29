import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { beforeEachUtil, afterEachUtil } from '/__tests__/utils/hooks.utils';
import { EmptyComponent } from '../empty.component';

describe('EmptyComponent', () => {
  beforeEach(beforeEachUtil);
  afterEach(afterEachUtil);

  it('renders with default styles and content', () => {
    const content = 'Hello World1';
    const { getByText } = render(
      (<EmptyComponent content={content} />) as React.ReactElement,
    );
    expect(getByText(content)).toBeTruthy();
    expect(
      getByText(content).closest('div')?.classList.contains('_empty_8aab5e'),
    )?.toBeTruthy();
  });

  it('renders with custom class name', () => {
    const content = 'Hello World2';
    const customClassName = 'custom-class';
    const { getByText } = render(
      <EmptyComponent content={content} className={customClassName} />,
    );
    expect(getByText(content)).toBeInTheDocument();
    expect(getByText(content).closest('div')).toHaveClass('_empty_8aab5e');
    expect(getByText(content).closest('div')).toHaveClass(customClassName);
  });
});
