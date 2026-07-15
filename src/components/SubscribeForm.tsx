"use client";

import { useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

type Status = "idle" | "loading" | "success" | "partial" | "error";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong, please try again.");
        return;
      }

      if (data?.emailSent === false) {
        // Subscription itself succeeded — the row exists — but the welcome
        // email failed to send. Surface the real reason here instead of it
        // only being visible in Supabase's dashboard logs.
        setStatus("partial");
        setMessage(
          `You're subscribed, but the welcome email failed to send: ${data?.emailError || "unknown error"}`
        );
        setEmail("");
        return;
      }

      setStatus("success");
      setMessage("You're subscribed! Check your inbox for a welcome email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-accent font-semibold">{message}</p>;
  }

  if (status === "partial") {
    return <p className="text-sm text-amber-600 font-semibold">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Register"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-600">{message}</p>}
      <p className="text-xs text-muted">Get an email digest when there's fresh news. Unsubscribe anytime.</p>
    </form>
  );
}
