/**
 * Mock authentication hook for demonstration purposes.
 * In a real application, this would connect to an authentication context/provider.
 */

type UserRole = 'admin' | 'supervisor' | 'viewer';

interface AuthUser {
  name: string;
  role: UserRole;
}

/**
 * You can change the role here to test different access levels:
 * 'admin' or 'supervisor' to see the "Importar" link.
 * 'viewer' to hide it.
 */
const MOCK_USER: AuthUser = {
  name: 'Demo User',
  role: 'admin', 
};

export const useAuth = () => {
  // In a real app, you might have logic here to check for a valid session,
  // fetch user data, etc. For now, we just return the mock user.
  const user = MOCK_USER;
  const isLoading = false;

  return { user, isLoading };
};
