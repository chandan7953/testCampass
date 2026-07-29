import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Thank you! Your message has been received.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center space-y-4">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
            Get In Touch
          </span>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Contact <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">CampusPass Support</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm text-gray-400">
            Have questions about event registration, organizer verification, or ticket passes? We're here to help.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Reach Out Directly</h2>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              Our campus support team is available during working hours to assist students, organizers, and campus administrators.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#12121A] p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Email Support</p>
                <p className="text-sm font-bold text-white">support@campuspass.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#12121A] p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Phone Line</p>
                <p className="text-sm font-bold text-white">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#12121A] p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">HQ Address</p>
                <p className="text-sm font-bold text-white">University Tech Hub, Pune, Maharashtra</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#12121A] p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Operating Hours</p>
                <p className="text-sm font-bold text-white">Mon – Fri: 9:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="rounded-3xl border border-white/10 bg-[#12121A] p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivers"
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@college.edu"
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Inquiry about organizer access"
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-300">Message *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message here..."
                className="w-full rounded-2xl border border-white/10 bg-[#181824] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              <Send size={16} />
              Submit Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;