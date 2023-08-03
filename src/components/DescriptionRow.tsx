export default function DescriptionRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value !== "" ? value : <span className="text-gray-400">Empty</span>}
      </dd>
    </div>
  );
}
