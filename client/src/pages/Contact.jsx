import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">

      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-5xl font-bold">
            Contact <span className="text-blue-500">CampusPass</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Have questions, suggestions, or facing any issues?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">

        {/* Left */}
        <div>

          <h2 className="mb-8 text-3xl font-bold">
            Get in Touch
          </h2>

          <div className="space-y-8">

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/20 p-3">
                <Mail className="text-blue-500" size={24} />
              </div>

              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-400">
                  support@campuspass.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/20 p-3">
                <Phone className="text-blue-500" size={24} />
              </div>

              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-400">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/20 p-3">
                <MapPin className="text-blue-500" size={24} />
              </div>

              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-400">
                  Pune, Maharashtra, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/20 p-3">
                <Clock className="text-blue-500" size={24} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Working Hours
                </h3>

                <p className="text-gray-400">
                  Monday - Friday
                </p>

                <p className="text-gray-400">
                  9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="rounded-2xl border border-gray-800 bg-[#111116] p-8">

          <h2 className="mb-8 text-3xl font-bold">
            Send a Message
          </h2>

          <form className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-700 bg-[#1A1A22] px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-700 bg-[#1A1A22] px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Subject
              </label>

              <input
                type="text"
                placeholder="Enter subject"
                className="w-full rounded-xl border border-gray-700 bg-[#1A1A22] px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Message
              </label>

              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full rounded-xl border border-gray-700 bg-[#1A1A22] px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>

    </div>
  );
};

export default Contact;