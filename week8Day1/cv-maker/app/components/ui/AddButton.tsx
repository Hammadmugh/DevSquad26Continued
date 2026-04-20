interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

export default function AddButton({ onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600
        hover:border-indigo-400 dark:hover:border-indigo-500
        hover:bg-indigo-50 dark:hover:bg-indigo-900/20
        text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400
        rounded-lg py-3 text-sm font-medium transition-colors"
    >
      {children}
    </button>
  );
}
