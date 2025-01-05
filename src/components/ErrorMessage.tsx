interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">{message}</div>
    </div>
  );
};