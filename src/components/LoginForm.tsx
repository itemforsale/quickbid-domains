import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    login({
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase()}@example.com`,
      username: formData.username || formData.name.toLowerCase(),
      password: formData.password,
    });
    toast.success("Successfully logged in!");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login to Bid</h2>
      <div>
        <Input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};