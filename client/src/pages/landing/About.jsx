import { Users, CalendarDays, Ticket, ShieldCheck, ArrowRight } from "lucide-react";
import aboutCampus from "../../assets/about-campus.png";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "100+", label: "Events Organized" },
    { value: "10K+", label: "Students Connected" },
    { value: "50+", label: "Campus Chapters" },
    { value: "99.8%", label: "Platform Uptime" },
  ];

  const features = [
    {
      icon: CalendarDays,
      title: "Discover Campus Events",
      description:
        "Browse technical, cultural, sports, workshops, hackathons, and college festivals all from one unified portal.",
    },
    {
      icon: Ticket,
      title: "Instant Digital Passes",
      description:
        "Register in seconds and receive your verified digital E-Ticket with QR code directly on your profile.",
    },
    {
      icon: Users,
      title: "Student Chapter Network",
      description:
        "Connect with student organizations, clubs, and peers to collaborate on impactful events.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Verification",
      description:
        "Fast QR scanning for organizers with instant attendee check-in and anti-duplication protection.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Hero Section */}
      <section className="relative border-b border-white/10 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
            About CampusPass
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Making Campus Events <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Simple, Digital & Instant
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
            CampusPass is an all-in-one event hub designed for university students, organizers, and campus administrators. Eliminate physical queues, paper passes, and fragmented forms.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 items-center">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12121A] p-2 shadow-2xl">
          <img
            src={aboutCampus}
            alt="Campus Event Experience"
            className="w-full rounded-2xl object-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Our Mission</span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Empowering Campus Communities Through Seamless Events</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            We believe that university life is enriched when students can easily explore opportunities outside the classroom. From coding hackathons to cultural nights, CampusPass removes registration friction.
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            For organizers, CampusPass provides automated seat tracking, venue assignment, ticket validation, and real-time attendance reporting.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/10 bg-[#0E0E14] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-white">Why Universities Choose CampusPass</h2>
            <p className="text-sm text-gray-400">Built specifically for modern academic ecosystems.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-[#12121A] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-500/40"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-blue-500/10 p-3.5 text-blue-400 border border-blue-500/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-[#12121A] p-8 text-center backdrop-blur-xl"
              >
                <h3 className="text-3xl font-black text-blue-400 sm:text-4xl">{item.value}</h3>
                <p className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20 bg-gradient-to-b from-[#0A0A0F] to-[#0E0E14]">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to Elevate Your Campus Events?</h2>
          <p className="text-sm text-gray-400">Join thousands of students and organizers using CampusPass today.</p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
          >
            <span>Create Student Account</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;