import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Expert clinicians',
    description: 'Care plans built to restore strength, mobility, and confidence.',
  },
  {
    title: 'Patient-first approach',
    description: 'Data-informed treatment with empathy at every step.',
  },
  {
    title: 'Convenient locations',
    description: 'Find clinics nearby with advanced scheduling and support.',
  },
];

const About = () => (
  <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
    <div className="space-y-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-600">About CORA</p>
      <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
        Movement, recovery, and care designed for everyone.
      </h1>
      <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600">
        CORA Physical Therapy blends modern rehabilitation with compassionate service so every
        patient can return to what they love with confidence.
      </p>
    </div>

    <div className="mt-14 grid gap-8 lg:grid-cols-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card transition hover:-translate-y-1"
        >
          <h2 className="text-xl font-semibold text-slate-900">{feature.title}</h2>
          <p className="mt-4 text-slate-600">{feature.description}</p>
        </article>
      ))}
    </div>

    <div className="mt-16 rounded-[2rem] bg-slate-900 p-10 text-white sm:p-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">A network of therapy built for modern life.</h2>
          <p className="mt-3 max-w-xl text-slate-300">
            Clinics, coaches, and digital tools that scale with every recovery timeline.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Learn more
        </Link>
      </div>
    </div>
  </section>
);

export default About;
