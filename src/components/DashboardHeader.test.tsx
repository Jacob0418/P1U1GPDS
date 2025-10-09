import { render, screen } from '@testing-library/react';
import DashboardHeader from './dashboard/DashboardHeader';
import { describe, it, expect } from 'vitest';

describe('DashboardHeader', () => {
  it('renders the header with the user email', () => {
    render(<DashboardHeader user={{ email: 'test@example.com' }} onLogout={() => {}} onSidebarOpen={() => {}} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<DashboardHeader user={{ email: 'test@example.com' }} onLogout={() => {}} onSidebarOpen={() => {}} />);
    expect(screen.getByText('Gestión de parcelas')).toBeInTheDocument();
  });
});