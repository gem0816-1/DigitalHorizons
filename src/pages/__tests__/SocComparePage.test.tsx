import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SocComparePage } from '@/pages/SocComparePage';

describe('SocComparePage', () => {
  it('shows two selectors by default and can add up to four', () => {
    render(<SocComparePage />);
    expect(screen.getAllByText('Select SoC').length).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: /add soc slot/i }));
    expect(screen.getAllByText('Select SoC').length).toBe(3);
  });
});
