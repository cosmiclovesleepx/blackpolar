// Tabla de gestión de usuarios — consumir GET /api/users vía @blackpolar/api-client
export default function UsersPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Usuarios</h1>
      <p className="text-muted-foreground mt-2">
        Tabla con shadcn &lt;Table&gt; — listar, cambiar rol, revocar sesiones.
      </p>
    </main>
  );
}
