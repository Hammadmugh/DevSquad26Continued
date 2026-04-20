interface Props {
  index: number;
  onDelete: () => void;
  children: React.ReactNode;
}

export default function EntryCard({ index, onDelete, children }: Props) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50/60 dark:bg-gray-900/40">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded-full">
          Entry #{index}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-lg leading-none"
          title="Remove entry"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  );
}
