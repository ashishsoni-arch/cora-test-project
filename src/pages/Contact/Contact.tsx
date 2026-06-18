const Contact = () => (
  <main className="mx-auto max-w-5xl px-6 py-20 sm:px-10 lg:px-12">
    <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-card sm:p-14">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Contact</p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Reach us for care or career guidance.
        </h1>
        <p className="max-w-2xl text-slate-600">
          Our team is ready to answer questions about recovery programs, insurance, and clinic
          locations.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-8 text-slate-800 shadow-sm">
          <h2 className="text-xl font-semibold">Phone</h2>
          <p className="mt-3 text-slate-600">1.866.443.2672</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-8 text-slate-800 shadow-sm">
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="mt-3 text-slate-600">info@coraphysicaltherapy.com</p>
        </div>
      </div>
    </section>
  </main>
);

export default Contact;
