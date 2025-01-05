interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export const FormHeader = ({ title, subtitle }: FormHeaderProps) => (
  <div className="text-center">
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{subtitle}</p>
  </div>
);