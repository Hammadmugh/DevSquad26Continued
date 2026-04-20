interface Props {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}

export default function SectionCard({ id, title, icon, children }: Props) {
  return (
    <div
      id={`form-${id}`}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <span className="text-xl">{icon}</span>
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
