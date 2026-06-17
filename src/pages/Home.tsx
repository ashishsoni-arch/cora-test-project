import { Link } from 'react-router-dom';

const heroLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Login', to: '/login' },
];

const Home = () => (
  <main className="relative overflow-hidden bg-slate-50">
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-8">
          <div className="rounded-3xl bg-slate-950 p-10 shadow-xl text-white md:p-12">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
              Rehabilitation you can trust
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              With 250+ clinics, find care or a career close by.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Personalized recovery plans for every stage of movement. Modern care, driven by expert
              clinicians and patient-first outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {heroLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-end justify-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-card">
            <img
              src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=900&q=80"
              alt="Physical therapy"
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                Patient-centered care
              </p>
              <p className="mt-2 text-lg font-semibold">Expert support through every movement.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default Home;
