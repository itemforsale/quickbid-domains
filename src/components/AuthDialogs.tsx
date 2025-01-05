import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export const AuthDialogs = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-20 flex justify-center gap-4 z-50">
      <Dialog open={isOpen && showLogin} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setShowLogin(true);
      }}>
        <DialogTrigger asChild>
          <Button variant="default">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <LoginForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen && !showLogin} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setShowLogin(false);
      }}>
        <DialogTrigger asChild>
          <Button variant="outline">Register</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <RegisterForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};