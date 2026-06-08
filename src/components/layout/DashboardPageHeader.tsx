type DashboardPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function DashboardPageHeader({
  eyebrow,
  title,
  subtitle,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{eyebrow}</p>
      <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
  );
}