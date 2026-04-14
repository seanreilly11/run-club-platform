interface DashboardOverviewProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardOverviewPage({
  params,
}: DashboardOverviewProps) {
  const { slug } = await params;

  return (
    <div className="p-6">
      <h1 className="font-heading text-xl font-bold text-text">
        Dashboard — {slug}
      </h1>
      <p className="text-text-muted mt-1 text-sm">Overview coming soon.</p>
    </div>
  );
}
