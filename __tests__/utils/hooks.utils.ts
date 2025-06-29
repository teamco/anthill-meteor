import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

export const beforeEachUtil = () => {
  vi.useFakeTimers();

  // Mocking getComputedStyle
  console.log('Mocking getComputedStyle');
  vi.spyOn(global, 'getComputedStyle').mockReturnValue({
    getPropertyValue: vi.fn().mockReturnValue('mocked-value'), // Example property mock
  } as unknown as CSSStyleDeclaration);
};

export const afterEachUtil = () => {
  console.log('Start cleaning...');
  cleanup();
  vi.clearAllMocks(); // Clears all mocks between tests
  // vi.resetAllMocks();
  console.log('Cleaning up after test');
};
