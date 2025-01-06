import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { useUser } from "@/contexts/UserContext";

export const AuthDialogs = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  if (user) return null;

  return (
    <div className="fixed top-4 right-4 sm:right-20 flex justify-center gap-2 sm:gap-4 z-50">
      <Dialog open={isOpen && showLogin} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setShowLogin(true);
      }}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="text-xs sm:text-sm">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md mx-4">
          <LoginForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen && !showLogin} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setShowLogin(false);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">Register</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md mx-4">
          <RegisterForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};