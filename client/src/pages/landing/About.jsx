import { Users, CalendarDays, Ticket, ShieldCheck } from "lucide-react";
import aboutCampus from "../../assets/about-campus.png";
import { useNavigate } from "react-router-dom";
const About = () => {
  const navigate = useNavigate();
  const stats = [
    { value: "100+", label: "Events Organized" },
    { value: "10K+", label: "Students Connected" },
    { value: "50+", label: "Colleges" },
    { value: "99%", label: "User Satisfaction" },
  ];

  const features = [
    {
      icon: CalendarDays,
      title: "Discover Events",
      description:
        "Browse technical, cultural, sports, workshops, hackathons, and college festivals from one platform.",
    },
    {
      icon: Ticket,
      title: "Easy Registration",
      description:
        "Register in seconds and receive your digital event pass with QR code.",
    },
    {
      icon: Users,
      title: "Student Community",
      description:
        "Connect with students, organizers, and participate in exciting campus activities.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Platform",
      description:
        "Safe authentication, verified organizers, and secure event registrations.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">

      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            About CampusPass
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
            Making Campus Events
            <span className="block text-blue-500">
              Simple & Accessible
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            CampusPass is a smart event management platform designed for
            colleges and universities. Students can discover, register,
            and attend events effortlessly while organizers manage
            everything from one place.
          </p>

        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2">

        <div>
          <img
            src={aboutCampus}
            alt="CampusPass"
            className="rounded-3xl border border-gray-800 object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">

          <h2 className="text-4xl font-bold">
            Our Mission
          </h2>

          <p className="mt-6 leading-8 text-gray-400">
            We believe every student should have easy access to exciting
            opportunities happening on campus. CampusPass eliminates
            paperwork and long registration queues by providing a modern
            digital platform for event discovery, registration, and
            attendance.
          </p>

          <p className="mt-5 leading-8 text-gray-400">
            Whether it's a coding competition, cultural fest,
            entrepreneurship summit, or sports event, CampusPass helps
            students never miss an opportunity.
          </p>

        </div>

      </section>

      {/* Features */}

      <section className="bg-[#111116] py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <h2 className="text-4xl font-bold">
              Why Choose CampusPass?
            </h2>

            <p className="mt-4 text-gray-400">
              Everything you need to manage and participate in campus
              events.
            </p>

          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-800 bg-[#18181F] p-8 transition hover:border-blue-500"
                >
                  <div className="mb-6 inline-flex rounded-xl bg-blue-500/10 p-4">
                    <Icon className="text-blue-500" size={28} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-400 leading-7">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* Stats */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">

            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-800 bg-[#111116] p-8"
              >
                <h2 className="text-4xl font-bold text-blue-500">
                  {item.value}
                </h2>

                <p className="mt-3 text-gray-400">
                  {item.label}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="border-t border-gray-800 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            Join the CampusPass Community
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Discover amazing events, connect with fellow students,
            and create unforgettable campus experiences.
          </p>

          <button onClick={() => navigate("/login")} className="mt-10 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700">
            Get Started
          </button>

        </div>

      </section>

    </div>
  );
};

export default About;