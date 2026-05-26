import { headers } from "next/headers";
import Link from "next/link";

export default async function NotFound() {
  const cookieHeader = (await headers()).get("cookie") || "";
  const themeMatch = cookieHeader.match(/theme=(dark|light)/);
  const isDark = themeMatch
    ? themeMatch[1] === "dark"
    : true;

  const bgImage = isDark
    ? "/img/notFound/dark-bg.jpg"
    : "/img/notFound/light-bg.jpg";

  return (
    <main
      style={{ backgroundImage: `url(${bgImage})` }}
      className="grid min-h-full place-items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 bg-cover bg-center"
    >
      <div className="text-center">
        <p className="text-3xl font-semibold text-indigo-600 sm:text-4xl">
          404
        </p>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Página no encontrada
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg lg:text-xl">
          No pudimos encontrar lo que busca.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ir al Inicio
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto text-sm font-semibold text-gray-900"
          >
            Contactar Soporte <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
