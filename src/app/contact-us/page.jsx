"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMsg("Message sent successfully!");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setMsg((data.error || "Failed to send message."));
      }
    } catch {
      setMsg(" Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border p-2 rounded"  />
          </div>

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-60" >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {msg && <p className="mt-3 text-sm">{msg}</p>}
        </form>

     
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Our Contact Details</h2>
            <p><strong> Phone:</strong> +91 9876543210</p>
            <p><strong> Address:</strong> 123, Your Street, Your City</p>
            <p><strong> Email:</strong> support@example.com</p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Our Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
