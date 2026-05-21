export default function ContactPage() {
  return (
    <div className="grid md:grid-cols-2 pt-3 px-4">
      <div className="p-5 md:p-5">
        <div className="my-5 text-center md:text-left md:text-2xl">
          <h1 className="text-3xl md:text-3xl font-bold glitch text-center">
            Contacto
          </h1>
          <img
            src="/img/paesant.gif"
            width={100}
            className="mx-auto my-2 rounded-full"
            alt="Contacto"
          />
          <p className="mt-5 text-sm">
            ¿Tenés alguna consulta o querés trabajar juntos? Completá el formulario y te responderé lo antes posible.
          </p>
        </div>
      </div>
      <div className="p-1 md:p-5">
        <div className="bg-muted text-foreground dark:bg-card dark:text-foreground p-5 mx-3 rounded-lg border-solid border border-border">
          <h2 className="text-2xl font-bold mb-6">Enviar Mensaje</h2>
          <form action="/#" method="POST">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-card"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-card"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 text-sm">
                Mensaje:
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full text-foreground px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-card"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground font-bold py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent text-xs"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
