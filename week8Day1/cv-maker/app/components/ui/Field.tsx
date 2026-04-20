interface Props {
  label: string;
  children: React.ReactNode;
  span?: "full";
  className?: string;
}

export default function Field({ label, children, span, className }: Props) {
  return (
    <div className={`${span === "full" ? "col-span-2" : ""} ${className ?? ""}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
