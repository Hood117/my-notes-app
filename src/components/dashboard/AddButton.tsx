import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export default function AddButton({ onClick, label = "Create Note" }: AddButtonProps) {
  return (
    <button
      id="floating-add-button"
      onClick={onClick}
      className="relative group inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-650 to-purple-650 text-white shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/80 hover:-translate-y-1 active:scale-95 transition-all duration-300 focus:outline-none z-50 cursor-pointer"
      aria-label={label}
    >
      {/* Dynamic background spin-glow on hover */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10" />
      
      <Plus
        size={24}
        className="stroke-[2.5] transition-transform duration-500 group-hover:rotate-90"
      />
    </button>
  );
}
