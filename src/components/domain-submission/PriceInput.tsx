import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface PriceInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
}

export const PriceInput = ({ value, onChange, placeholder, icon: Icon }: PriceInputProps) => (
  <div className="relative">
    <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="pl-10"
    />
  </div>
);