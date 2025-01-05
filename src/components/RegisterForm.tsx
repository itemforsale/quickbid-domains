import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create registration data with name as username and X username from the username field
    const registrationData = {
      name: formData.name,
      email: formData.email,
      username: formData.name.toLowerCase().replace(/\s+/g, ''), // Convert name to lowercase and remove spaces for username
      password: formData.password,
      xUsername: formData.username // Use the username field as xUsername
    };

    register(registrationData);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Register to Bid</h2>
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
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="X.com Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
        Register
      </Button>
    </form>
  );
};