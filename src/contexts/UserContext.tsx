import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  xUsername?: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  users: User[];
  login: (credentials: { username: string; password: string; }) => void;
  register: (user: User) => void;
  logout: () => void;
  deleteUser: (username: string) => void;
  updateUser: (updatedUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'quickbid_users';
const ADMIN_USERNAME = '60dna';
const ADMIN_PASSWORD = 'xMWR6IXrqPkXPbWg';

// Initialize with default admin user
const defaultUsers: User[] = [{
  username: ADMIN_USERNAME,
  name: 'Sam Charles',
  email: 'sam@wizard.uk',
  password: ADMIN_PASSWORD,
  xUsername: 'samcharles',
  isAdmin: true
}];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const parsedUsers = savedUsers ? JSON.parse(savedUsers) : defaultUsers;
      
      // Ensure admin user is always present
      if (!parsedUsers.some(u => u.username === ADMIN_USERNAME)) {
        parsedUsers.push(defaultUsers[0]);
      }
      
      // Broadcast initial state to other tabs/windows
      const channel = new BroadcastChannel('users_sync');
      channel.postMessage({ type: 'USERS_UPDATE', users: parsedUsers });
      
      return parsedUsers;
    } catch (error) {
      console.error('Error loading users:', error);
      return defaultUsers;
    }
  });

  // Set up broadcast channel for cross-tab/browser synchronization
  useEffect(() => {
    const channel = new BroadcastChannel('users_sync');
    
    // Listen for updates from other tabs/windows
    channel.onmessage = (event) => {
      if (event.data.type === 'USERS_UPDATE') {
        console.log('Received users update:', event.data.users);
        setUsers(event.data.users);
        
        // Update localStorage when receiving updates
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(event.data.users));
        } catch (error) {
          console.error('Error saving received users:', error);
        }
      }
    };

    // Request current state from other tabs when initializing
    channel.postMessage({ type: 'REQUEST_USERS' });

    return () => channel.close();
  }, []);

  // Sync users to localStorage and broadcast changes
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      const channel = new BroadcastChannel('users_sync');
      channel.postMessage({ type: 'USERS_UPDATE', users });
      console.log('Broadcasting users update:', users);
    } catch (error) {
      console.error('Error saving users:', error);
    }
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

    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    toast.success("Successfully registered!");
  };

  const login = (credentials: { username: string; password: string }) => {
    const inputUsername = credentials.username.toLowerCase();
    
    const foundUser = users.find(u => u.username.toLowerCase() === inputUsername);
    
    if (!foundUser) {
      toast.error("User not found");
      return;
    }

    if (foundUser.password !== credentials.password) {
      toast.error("Invalid password");
      return;
    }

    setUser(foundUser);
    toast.success("Successfully logged in!");
  };

  const logout = () => {
    setUser(null);
    toast.success("Successfully logged out!");
  };

  const deleteUser = (username: string) => {
    const normalizedUsername = username.toLowerCase();
    if (normalizedUsername === ADMIN_USERNAME.toLowerCase()) {
      toast.error("Cannot delete admin user");
      return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.username.toLowerCase() !== normalizedUsername));
  };

  const updateUser = (updatedUser: User) => {
    const normalizedUsername = updatedUser.username.toLowerCase();
    setUsers(users.map(u => 
      u.username.toLowerCase() === normalizedUsername ? { ...u, ...updatedUser } : u
    ));
    
    if (user && user.username.toLowerCase() === normalizedUsername) {
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      register, 
      logout, 
      deleteUser,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}