interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export default function Input({ value, onChange, placeholder, type = "text", disabled }: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
        text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
        bg-white dark:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600
        disabled:cursor-not-allowed transition-all"
    />
  );
}
