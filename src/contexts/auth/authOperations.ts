import { supabase } from "@/integrations/supabase/client";
import { LoginCredentials, RegisterData, User } from "@/types/user";
import { toast } from "sonner";

export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    toast.error(error.message);
    throw error;
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        xUsername: profile.x_username,
        isAdmin: profile.is_admin,
        createdAt: profile.created_at
      };
    }
  }

  return null;
};

export const registerUser = async (data: RegisterData): Promise<User | null> => {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) {
    toast.error(signUpError.message);
    throw signUpError;
  }

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        username: data.username,
        email: data.email,
        x_username: data.xUsername,
      }]);

    if (profileError) {
      toast.error(profileError.message);
      throw profileError;
    }

    return {
      id: authData.user.id,
      username: data.username,
      email: data.email,
      xUsername: data.xUsername,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
  }

  return null;
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  if (data) {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      xUsername: data.x_username,
      isAdmin: data.is_admin,
      createdAt: data.created_at
    };
  }

  return null;
};