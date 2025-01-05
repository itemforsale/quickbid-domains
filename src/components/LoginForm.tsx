import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const LoginForm = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username) {
      toast.error("Please fill in all fields");
      return;
    }
    login(formData);
    toast.success("Successfully logged in!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
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
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};