# Eduardo Chami's Web

Personal portfolio website built with **Next.js 16**.

---

## ✨ Features

- ✅ Registro de usuarios con validación de fortaleza de contraseña
- ✅ Inicio de sesión con manejo de sesión via JWT + httpOnly cookies
- ✅ Rutas protegidas (solo usuarios autenticados)
- ✅ Rutas de administración (solo usuarios con rol admin)
- ✅ Refresco automático de token JWT en cada navegación
- ✅ Refresh token rotation con "Recordar dispositivo"
- ✅ Medidor de fortaleza de contraseña en tiempo real
- ✅ Headers de seguridad (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Protección CSRF en API routes
- ✅ UI preparada para OAuth (Google, GitHub)
- ✅ Diseño responsive con Tailwind CSS v4
- ✅ Notificaciones toast con Sonner
- ✅ Iconos SVG estandarizados

---

## 🛠 Stack

| Capa | Tecnología |
|---|---|
| 🏗 Framework | Next.js 16 (App Router) |
| 📝 Lenguaje | TypeScript |
| 🔑 Autenticación | JWT (jsonwebtoken) + cookies httpOnly |
| ✅ Validación | Zod v4 |
| 🎨 Estilos | Tailwind CSS v4 |
| 📢 UI/UX | Componentes propios + Sonner |
| 🖼 Iconos | Lucide-style (propios) |

---

## 📁 Estructura del proyecto

```
├── actions/          # Server Actions (login, register)
├── app/              # App Router (rutas y layouts)
│   ├── (admin)/      # Panel de administración
│   ├── (protected)/  # Rutas para usuarios autenticados
│   └── (public)/     # Landing, login, registro
├── components/       # Componentes React
│   ├── auth/         # Formularios de login y registro
│   ├── ui/           # Componentes reutilizables
│   └── Icons/        # Iconos SVG del sistema
├── hooks/            # Hooks del lado cliente
├── lib/              # Lógica de servidor (auth, JWT, CSRF)
├── types/            # Definiciones de TypeScript
└── validations/      # Schemas de Zod
```

---

## 🗺 Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | 🌍 Público | Landing page |
| `/login` | 🌍 Público | Inicio de sesión |
| `/register` | 🌍 Público | Registro de usuario |
| `/dashboard` | 🔒 Autenticado | Panel del usuario |
| `/admin` | 🔒 Admin | Panel de administración |

---

## 🚀 Cómo usar este template

### 1. 📦 Clonar e instalar

```bash
npm install
```

### 2. 🔧 Variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `JWT_SECRET` | ✅ Sí | — | Clave secreta para firmar tokens JWT |
| `HOST` | ❌ No | `localhost` | Dominio para las cookies |
| `NEXT_PUBLIC_APP_URL` | ❌ No | `http://localhost:3000` | URL pública para CSRF |
| `NEXT_PUBLIC_API_URL` | ❌ No | `http://localhost:8000` | URL base para OAuth externo |
| `NODE_ENV` | ❌ No | `development` | Entorno de la aplicación |

### 3. 🔌 Integración con backend / base de datos

Actualmente la autenticación usa stubs en `lib/auth.ts`. Toda la lógica de negocio (registro, login, verificación) está abstraída ahí, separada de las Server Actions en `actions/auth.ts` que solo orquestan el request/response.

Para conectar una base de datos o un backend externo, solo modificás `lib/auth.ts`:

```
actions/auth.ts        →  Orquesta validación + llama al service
lib/auth.ts            ←  ❗ ÚNICO archivo a modificar
    ├── registerService()   →  Guardar usuario en DB o llamar API externa
    ├── loginService()      →  Verificar credenciales contra DB o API
    └── logout()            →  Limpiar cookies
```

**¿Por qué este diseño?**

- Las Server Actions (`actions/`) manejan validación, errores y redirects
- `lib/auth.ts` es la **capa de integración** — conectá tu DB (Prisma, Drizzle, MongoDB), tu API REST, o tu backend que sea desde acá
- Si necesitás un cliente HTTP para consumir una API externa, crealo en `lib/api-client.ts` e importalo en `lib/auth.ts`

**📘 Ejemplo con Prisma:**

```typescript
// lib/auth.ts
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerService({ email, password }: UserRegisterReq) {
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  return { error: null, message: "Registered", user };
}

export async function loginService({ email, password }: UserLoginReq) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid credentials", message: null, user: null };
  }
  // ... resto igual
}
```

**📘 Ejemplo con API externa:**

```typescript
// lib/api-client.ts
export const api = {
  async post(path: string, body: unknown) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// lib/auth.ts
import { api } from "@/lib/api-client";

export async function registerService(data: UserRegisterReq) {
  return api.post("/auth/register", data);
}
```

### 4. ▶️ Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## 🛡 Seguridad

- 🔒 Tokens JWT almacenados en cookies **httpOnly, secure, sameSite**
- 🚫 **X-Frame-Options: DENY** — prevención de clickjacking
- 🔐 **Strict-Transport-Security** — fuerza HTTPS
- 📵 **Permissions-Policy** — restringe features del navegador
- 🛑 Protección **CSRF** por Origin/Referer en API routes
- ✅ Validación de contraseña del lado cliente
- 🔄 Rutas protegidas redirigen a `/login` si no hay sesión

---

## 🎨 Personalización

Para usar este template en tu proyecto:

1. ✏️ Cambiar `AuthHub` en `components/Navbar.tsx` por el nombre de tu app
2. 🏠 Personalizar la landing page en `app/(public)/page.tsx`
3. ➕ Agregar nuevas rutas protegidas dentro de `app/(protected)/`
4. 📋 Agregar schemas de validación en `validations/`
5. 🖼 Reemplazar iconos no utilizados o agregar nuevos en `components/Icons/`

---

## 📄 Licencia

MIT — usalo como quieras.
