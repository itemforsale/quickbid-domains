import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';

const ADMIN_USERNAME = '60dna';
const ADMIN_PASSWORD = 'xMWR6IXrqPkXPbWg';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  const login = (credentials: { username: string; password: string }) => {
    const inputUsername = credentials.username.toLowerCase();
    const inputPassword = credentials.password;
    
    if (inputUsername === ADMIN_USERNAME.toLowerCase() && inputPassword === ADMIN_PASSWORD) {
      const adminUser: User = {
        username: ADMIN_USERNAME,
        name: 'Sam Charles',
        email: 'sam@wizard.uk',
        password: ADMIN_PASSWORD,
        xUsername: 'samcharles',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      toast.success("Successfully logged in as admin!");
      return;
    }

    const users = JSON.parse(localStorage.getItem('quickbid_users') || '[]');
    const foundUser = users.find((u: User) => u.username.toLowerCase() === inputUsername);
    
    if (!foundUser) {
      toast.error("User not found");
      return;
    }

    if (foundUser.password !== inputPassword) {
      toast.error("Invalid password");
      return;
    }

    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    toast.success("Successfully logged in!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success("Successfully logged out!");
  };

  return { user, login, logout };
};