import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';

const USERS_STORAGE_KEY = 'quickbid_users';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const register = (userData: User) => {
    const normalizedUsername = userData.username.toLowerCase();
    if (users.some(u => u.username.toLowerCase() === normalizedUsername)) {
      toast.error("Username already exists");
      return;
    }

    const newUser = {
      ...userData,
      username: userData.username,
      xUsername: userData.xUsername || userData.username
    };

    setUsers([...users, newUser]);
    toast.success("Successfully registered!");
    return newUser;
  };

  const deleteUser = (username: string) => {
    setUsers(users.filter(u => u.username.toLowerCase() !== username.toLowerCase()));
  };

  const updateUser = (updatedUser: User) => {
    const normalizedUsername = updatedUser.username.toLowerCase();
    setUsers(users.map(u => 
      u.username.toLowerCase() === normalizedUsername ? { ...u, ...updatedUser } : u
    ));
    return updatedUser;
  };

  return { users, register, deleteUser, updateUser };
};