import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      let email = '';
      
      // Special case for admin user
      if (formData.username === '60dna') {
        console.log('Admin login attempt');
        email = 'admin@example.com';
      } else {
        console.log('Regular user login attempt for username:', formData.username);
        // For regular users, find their email by username
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', formData.username.toLowerCase())
          .single();

        if (profileError) {
          console.error('Profile lookup error:', profileError);
          toast.error("User not found");
          return;
        }

        if (!profile?.email) {
          console.error('No email found for username:', formData.username);
          toast.error("User not found");
          return;
        }

        email = profile.email;
      }

      console.log('Attempting login with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid username or password");
        } else {
          toast.error("Failed to login. Please try again.");
        }
        return;
      }

      if (!data.user) {
        console.error('No user data returned');
        toast.error("Failed to login. Please try again.");
        return;
      }

      console.log('Login successful:', data.user);
      toast.success("Successfully logged in!");
      onSuccess?.();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to Bid</h2>
      <div>
        <Input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value.trim() })}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};