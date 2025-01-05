import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";

interface DomainInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DomainInput = ({ value, onChange }: DomainInputProps) => (
  <div className="relative">
    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="yourdomain.com"
      className="pl-10"
    />
  </div>
);