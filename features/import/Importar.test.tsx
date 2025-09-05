import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../../App';

// Mock the auth hook to return an admin user, which is required to see the "Importar" link.
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test Admin', role: 'admin' },
    isLoading: false,
  }),
}));

// Mock heavy components that are not relevant to this test and might cause issues in JSDOM.
vi.mock('../../components/Visualization3D/Visualization3D', () => ({
  default: () => <div>3D Viewer Mock</div>,
}));

describe('Smoke Test: Importar Feature', () => {
  let storageSpy: vi.SpyInstance;

  beforeEach(() => {
    // Mock localStorage to simulate an authenticated session, bypassing the login screen.
    storageSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'aquapp_session') {
        return JSON.stringify({
          rememberMe: true,
          email: 'test.admin@example.com',
          loginTime: new Date().toISOString(),
        });
      }
      return null;
    });
  });

  afterEach(() => {
    // Clean up mocks after each test
    vi.restoreAllMocks();
  });

  it('renders "Importar" as the first item for an admin and navigates to the import page on click', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Find the "Importar" button in the sidebar.
    // It should be visible because we mocked the user role as 'admin'.
    const importButton = await screen.findByRole('button', { name: /Importar/i });
    expect(importButton).toBeInTheDocument();

    // 2. Verify it's the first item in its navigation section, as per the requirement.
    const navList = importButton.closest('ul');
    expect(navList).not.toBeNull();
    const firstItemInList = navList?.querySelector('li:first-child button');
    expect(firstItemInList).toBe(importButton);

    // 3. Click the "Importar" button to navigate.
    await user.click(importButton);

    // 4. Assert that the ImportLayout has rendered by finding a key element within it.
    // The "Infraestructura" tab is the primary indicator that the correct module is loaded.
    const infraTab = await screen.findByRole('tab', { name: /Infraestructura/i });
    expect(infraTab).toBeInTheDocument();
    expect(infraTab).toHaveAttribute('data-state', 'active');
  });
});
