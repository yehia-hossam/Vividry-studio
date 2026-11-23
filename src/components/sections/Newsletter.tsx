"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/** Replace `subscribe` with a call to Mailchimp / ConvertKit / your API route. */
async function subscribe(email: string) {
  await new Promise((r) => setTimeout(r, 400));
  return email.includes("@");
}

export default function Newsletter() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setState("loading");
    setState((await subscribe(email)) ? "done" : "error");
  };
  return (
    <section className="section newsletter">
      <Reveal className="newsletter__box">
        <h2 className="h2">{site.newsletter.title}</h2>
        <p className="lead">{site.newsletter.text}</p>
        {state === "done" ? (
          <p className="newsletter__ok" role="status">{site.newsletter.success}</p>
        ) : (
          <form onSubmit={onSubmit} className="newsletter__form">
            <label className="sr-only" htmlFor="nl-email">Email address</label>
            <input id="nl-email" name="email" type="email" required placeholder={site.newsletter.placeholder} />
            <button className="btn btn--ink" disabled={state === "loading"}>{state === "loading" ? "Joining…" : site.newsletter.button}</button>
            {state === "error" && <p className="newsletter__err" role="alert">Please enter a valid email address.</p>}
          </form>
        )}
      </Reveal>
    </section>
  );
}
