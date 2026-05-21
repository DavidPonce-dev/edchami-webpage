export default function ContactPage() {
  return (
    <div className="grid md:grid-cols-2 gap-6 pt-3 px-4">
      <div className="p-5 md:p-8 flex flex-col justify-center">
        <h1 className="text-3xl font-bold glitch text-center md:text-left mb-6">
          Contacto
        </h1>
        <img
          src="/img/paesant.gif"
          width={120}
          className="mx-auto md:mx-0 my-4 rounded-full border-2 border-border shadow-md"
          alt="Contacto"
        />
        <p className="text-sm leading-relaxed text-muted-foreground">
          ¿Tiene alguna consulta o desea colaborar en un proyecto? Complete el formulario y le responderé a la brevedad.
        </p>
      </div>
      <div className="p-5 md:p-8">
        <div className="bg-card dark:bg-muted/30 p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-foreground">Enviar Mensaje</h2>
          <form action="/#" method="POST" className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-foreground">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Su nombre completo"
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-foreground">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Escriba su mensaje aquí..."
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground text-sm resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-opacity text-sm"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
