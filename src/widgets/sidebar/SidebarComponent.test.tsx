import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SidebarComponent from './sidebar';
import { describe, it, expect, vi } from 'vitest';

describe('SidebarComponent', () => {
  it('renders the sidebar when open', () => {
    render(
      <MemoryRouter>
        <SidebarComponent open={true} onClose={() => {}} />
      </MemoryRouter>
    );

    const elements = screen.getAllByText('Sistema Integral Agrícola');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('calls onClose when the close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(
      <MemoryRouter>
        <SidebarComponent open={true} onClose={onCloseMock} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});