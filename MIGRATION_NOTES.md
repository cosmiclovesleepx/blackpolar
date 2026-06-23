# Notas de la migración EJS → Next.js

Resumen de qué se migró del repo original (`Express + EJS + Node.js`) a este
monorepo, y qué quedó pendiente de conectar.

## Mapeo de rutas

| Original (sub-app + vista) | Nueva ruta en `apps/web` |
|---|---|
| `main` → `index.ejs` | `/` |
| `main` → `login.ejs` | `/login` |
| `main` → `registro.ejs` | `/registro` |
| `main` → `error.ejs` | `not-found.tsx` (404) y `error.tsx` (500) |
| `portfolios` → `index.ejs` | `/portfolios` |
| `tlm` → `index.ejs` | `/tlm` |

Las 3 sub-apps originales (`main`, `portfolios`, `tlm` — cada una con su
propio `server.js`, puerto, y `package.json`) ahora son rutas dentro de **una
sola app Next.js** (`apps/web`). Esto simplifica el deploy: ya no hay que
levantar 3 procesos Node separados, PM2 solo maneja `blackpolar-web`.

## Qué se preservó tal cual

- **Todo el CSS original** se copió sin reescribir a `apps/web/app/styles/`
  (`main.css`, `login.css`, `registro.css`, `portfolios.css`, `tlm.css`) e
  importa por página — el diseño visual no cambió.
- **Todo el JavaScript original** (animaciones, menú móvil, validación de
  formularios, toggle de password, etc.) se copió tal cual a
  `apps/web/public/js/` y se carga con `next/script` — sigue siendo el mismo
  vanilla JS manipulando el DOM por `id`, no se reescribió a React state.
- **Imágenes y assets** se copiaron a `apps/web/public/assets/<sub-app>/...`
  (namespaced por sub-app de origen, para evitar colisiones de nombres entre
  `main`, `portfolios`, y `tlm`, que antes vivían en directorios `public/`
  separados).

## Qué cambió mecánicamente (sin afectar el diseño)

- `class` → `className`, `for` → `htmlFor`, atributos de SVG kebab-case
  (`stroke-width`, `fill-rule`, etc.) → camelCase — requisito de JSX, no
  cambia nada visualmente.
- `style="color:red"` → `style={{ color: 'red' }}` — mismo CSS, sintaxis JSX.
- Comentarios `<!-- -->` → `{/* */}`.
- Tags auto-cerrados donde JSX lo exige (`<br>` → `<br />`, etc.).
- Los `<script src="https://cdn.tailwindcss.com">` con `tailwind.config`
  inline (usados en `index.ejs` y `portfolios/index.ejs`) se eliminaron — no
  hacían falta porque el diseño real corre sobre CSS custom con variables
  (`--bp-black`, `--bp-white`, etc.), no sobre clases de utilidad de Tailwind
  con el theme custom. Las pocas clases Tailwind sueltas que sí se usan
  (`flex`, `items-center`, `gap-10`) ya las cubre la config base del monorepo.
- Los enlaces cruzados entre sub-apps (`https://portfolios.blackpolar.org`,
  `https://blackpolar.org`) ahora son rutas internas (`/portfolios`, `/`) ya
  que viven en el mismo dominio y la misma app.

## Qué quedó pendiente (no es parte de "migrar el diseño")

- **`/login` y `/registro`** son UI funcional (validan en cliente, muestran
  errores) pero **no llaman a ningún backend real todavía** — el `form`
  original apuntaba a `/login` y `/register` por Express, que no existen en
  este monorepo. Se conectan en la Fase 2 (Better Auth).
- **El formulario de contacto** en `/` simula el envío (`setTimeout`) — el
  propio `main.js` original ya traía comentado el `fetch('/api/contact', ...)`
  listo para cuando exista el endpoint.
- **`/tlm`** mostraba en el original llamadas `fetch()` a endpoints de su
  propio backend Express (`/api/v1`, `/health`, `/services`) que tampoco
  existen aquí — hay que decidir si esos endpoints se migran a Fastify o si
  esa sección se retira/rediseña.
- El modelo `User` de Prisma reemplaza lo que habría sido la base para
  procesar `registro.ejs` — los campos del formulario (nombre, apellido, tipo
  de ID, etc.) no tienen aún su contraparte en el schema; eso se define junto
  con el flujo real de registro.

## Caveats técnicos a tener en cuenta

- `apps/dashboard` usa `@tremor/react`, que declara peer dependency de
  React 18 — con React 19 (lo que usa Next 15) `pnpm install` tira un warning
  de peer dependency. No rompe nada en build/runtime, pero si Tremor da
  problemas raros de tipos, es la primera sospechosa.
- El build de `apps/web` se validó de punta a punta en este entorno
  (`pnpm build` + `next start` + curl a las 5 rutas y a los assets estáticos)
  — no es solo código sin probar, efectivamente compila y sirve.
