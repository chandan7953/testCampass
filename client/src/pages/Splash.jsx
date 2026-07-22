import { useEffect } from "react";
import landingHero from "../assets/landing-hero.png";


const Splash = () => {

  const features = [
    {
      icon: "🔍",
      title: "Find Events",
      desc: "Explore exciting events happening around you.",
    },
    {
      icon: "📝",
      title: "Register Easily",
      desc: "Quick registration in just a few clicks.",
    },
    {
      icon: "🎟️",
      title: "Get Tickets",
      desc: "Receive QR passes and attend events.",
    },
    {
      icon: "🔔",
      title: "Stay Updated",
      desc: "Never miss any important updates.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">


      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-2">

        {/* Left */}
        <div>

          <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">
            Discover.
            <br />
            Connect.
            <br />
            <span className="text-blue-500">
              Experience Events
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-gray-400 leading-8">
            Explore amazing college events happening around you,
            register with a single click, and secure your passes.
            Never miss out on campus fun!
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-blue-500 px-7 py-4 font-semibold transition hover:bg-blue-600"
            >
              Explore Events
            </button>


          </div>
        </div>

        {/* Right */}
        <div className="overflow-hidden rounded-3xl border border-[#1c1c24]">

          <img
  src={landingHero}
  alt="College Events"
  className="aspect-video h-full w-full object-cover"
/>

        </div>

      </section>

      {/* Features */}

      <section className="border-t border-[#1c1c24] bg-[#09090d] py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#202026] bg-[#111116] p-6 transition duration-300 hover:border-blue-500"
              >
                <div className="text-4xl">{feature.icon}</div>

                <h3 className="mt-4 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-[#1c1c24] py-8">

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CampusPass. All rights
          reserved. Made for college student chapters.
        </p>

      </footer>

    </div>
  );
};

export default Splash;