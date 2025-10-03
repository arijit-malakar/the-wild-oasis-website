"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps extends React.PropsWithChildren {
  pendingLabel: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  pendingLabel,
}) => {
  // Can be called inside a CC ('cos its a hook, afterall) that is used inside a form
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
};

export default SubmitButton;
