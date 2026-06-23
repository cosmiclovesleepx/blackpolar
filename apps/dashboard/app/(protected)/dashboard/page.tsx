// Dashboard con métricas — usar @tremor/react: <Card>, <AreaChart>, <BarList>, etc.
export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Métricas con Tremor van aquí (usuarios activos, sesiones, API keys creadas).
      </p>
    </main>
  );
}
