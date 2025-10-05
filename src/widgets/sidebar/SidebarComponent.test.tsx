import { render, screen, fireEvent } from '@testing-library/react';
import SidebarComponent from './sidebar';
import { vi } from 'vitest';

describe('SidebarComponent', () => {
  it('renders the sidebar when open', () => {
    render(<SidebarComponent open={true} onClose={() => {}} />);
    expect(screen.getByText('Sistema Integral Agrícola')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<SidebarComponent open={true} onClose={onCloseMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});