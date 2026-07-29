import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, Ticket, ShieldCheck, ArrowRight, Star, Users } from "lucide-react";
import landingHero from "../../assets/landing-hero.png";

const Splash = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Discover Campus Events",
      desc: "Browse workshops, hackathons, sports, and cultural fests happening across your college.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Ticket,
      title: "Instant Digital Passes",
      desc: "Reserve seats in 1-click and receive your verified QR code E-Ticket pass instantly.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ShieldCheck,
      title: "Seamless Organizer Tools",
      desc: "College chapters & admins can manage registrations, check-in attendees, and track revenue.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "Live Notifications",
      desc: "Get immediate alerts on venue changes, schedule updates, and upcoming pass reminders.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-1/3 right-10 -z-10 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <Sparkles size={14} />
              <span>The Next-Gen Campus Pass Platform</span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Discover. <br />
              Connect. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Experience Campus Life.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              Explore college events, secure your E-Ticket QR passes, and never miss out on campus tech talks, fests, or workshops.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Create Account
              </button>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 flex items-center justify-center gap-8 lg:justify-start border-t border-white/5">
              <div>
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-xs text-gray-400">Campus Events</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">5,000+</p>
                <p className="text-xs text-gray-400">Students Joined</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-gray-400">Digital QR Passes</p>
              </div>
            </div>
          </div>

          {/* Right Column Banner */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12121A] p-2 shadow-2xl backdrop-blur-2xl">
              <img
                src={landingHero}
                alt="College Event Banner"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/10 bg-[#0E0E14] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Why CampusPass?</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Everything You Need for Campus Events</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121A] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                  >
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#0A0A0F]">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CampusPass. All rights reserved. Designed for student chapters and event organizers.
        </div>
      </footer>
    </div>
  );
};

export default Splash;