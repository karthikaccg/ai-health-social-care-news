import { getUpdatedAt } from "@/lib/news";
import SubscribeForm from "./SubscribeForm";

export default function Footer() {
  const updated = new Date(getUpdatedAt());
  return (
    <footer className="border-t border-line mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="text-sm text-muted flex flex-col gap-3">
          <p>
            <span className="font-extrabold text-ink">
              Care<span className="text-accent">Zeno</span>
            </span>{" "}
            — AI in Health &amp; Social Care news, UK-first.
          </p>
          <p>
            Headlines link to their original publishers. Last updated{" "}
            {updated.toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/London",
            })}{" "}
            (UK time) · refreshes every 6 hours.
          </p>
        </div>
        <div className="w-full md:w-80 shrink-0">
          <p className="text-sm font-semibold text-ink mb-2">Register for email updates</p>
          <SubscribeForm />
        </div>
      </div>
    </footer>
  );
}
