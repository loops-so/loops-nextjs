"use client";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [eventName, setEventName] = useState<string>("demoEvent");
  const [transactionalId, setTransactionalId] = useState<string>("");
  const [results, setResults] = useState<string>("");

  async function showResponse(resp: Response) {
    const data = await resp.json();
    setResults(
      JSON.stringify(
        {
          status: resp.status,
          ok: resp.ok,
          response: data,
        },
        null,
        2
      )
    );
  }

  async function addOrUpdateContact(testRateLimit = false) {
    if (!email && !userId) return;

    const resp = await fetch(`/api/contacts${testRateLimit ? "?ratelimit=true" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || undefined,
        userId: userId || undefined,
        properties: {
          firstName: "Demo",
          lastName: "User",
          userGroup: "example-project",
        },
      }),
    });
    await showResponse(resp);
  }

  async function findContact() {
    if (!email && !userId) return;
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (userId) params.set("userId", userId);
    const resp = await fetch(`/api/contacts?${params}`);
    await showResponse(resp);
  }

  async function deleteContact() {
    if (!email && !userId) return;
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (userId) params.set("userId", userId);
    const resp = await fetch(`/api/contacts?${params}`, { method: "DELETE" });
    await showResponse(resp);
  }

  async function checkApiKey() {
    const resp = await fetch("/api/health");
    await showResponse(resp);
  }

  async function listMailingLists() {
    const resp = await fetch("/api/lists");
    await showResponse(resp);
  }

  async function listProperties() {
    const resp = await fetch("/api/properties?list=all");
    await showResponse(resp);
  }

  async function sendEvent() {
    if (!email && !userId) return;
    const resp = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || undefined,
        userId: userId || undefined,
        eventName,
        eventProperties: {
          source: "nextjs-demo",
          timestamp: new Date().toISOString(),
        },
      }),
    });
    await showResponse(resp);
  }

  async function listTransactionalEmails() {
    const resp = await fetch("/api/transactional?perPage=20");
    await showResponse(resp);
  }

  async function sendTransactionalEmail() {
    if (!email || !transactionalId) return;
    const resp = await fetch("/api/transactional", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        transactionalId,
        dataVariables: {
          demoValue: "sent from Next.js example app",
        },
      }),
    });
    await showResponse(resp);
  }

  return (
    <main className="p-8 max-w-6xl mx-auto text-sm">
      <h1 className="font-bold text-2xl">Loops SDK Next.js Example</h1>
      <p className="my-3 text-gray-600">
        Enter an email or userId, then try the API actions below.
      </p>

      <div className="mt-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div>
          <p className="my-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="p-2 w-full border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </p>
          <p className="my-4">
            <input
              type="text"
              name="userId"
              placeholder="User ID (optional)"
              className="p-2 w-full border rounded-md"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </p>

          <div className="my-4 flex flex-wrap gap-2">
            <button
              onClick={() => addOrUpdateContact(false)}
              className="px-4 py-2 rounded-md bg-green-600 text-white"
            >
              Upsert contact
            </button>
            <button
              onClick={() => addOrUpdateContact(true)}
              className="px-4 py-2 rounded-md bg-green-700 text-white"
            >
              Test rate limit
            </button>
            <button
              onClick={findContact}
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              Find contact
            </button>
            <button
              onClick={deleteContact}
              className="px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Delete contact
            </button>
          </div>

          <div className="my-4 flex flex-wrap gap-2">
            <button
              onClick={checkApiKey}
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            >
              Test API key
            </button>
            <button
              onClick={listMailingLists}
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            >
              List mailing lists
            </button>
            <button
              onClick={listProperties}
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            >
              List contact properties
            </button>
            <button
              onClick={listTransactionalEmails}
              className="px-4 py-2 rounded-md bg-gray-700 text-white"
            >
              List transactional emails
            </button>
          </div>

          <div className="my-6 border rounded-md p-4">
            <h2 className="font-semibold mb-2">Send Event</h2>
            <input
              type="text"
              name="eventName"
              placeholder="Event name"
              className="p-2 w-full border rounded-md mb-2"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <button
              onClick={sendEvent}
              className="px-4 py-2 rounded-md bg-purple-600 text-white"
            >
              Send event
            </button>
          </div>

          <div className="my-6 border rounded-md p-4">
            <h2 className="font-semibold mb-2">Send Transactional Email</h2>
            <input
              type="text"
              name="transactionalId"
              placeholder="Transactional ID"
              className="p-2 w-full border rounded-md mb-2"
              value={transactionalId}
              onChange={(e) => setTransactionalId(e.target.value)}
            />
            <button
              onClick={sendTransactionalEmail}
              className="px-4 py-2 rounded-md bg-orange-600 text-white"
            >
              Send transactional
            </button>
          </div>

          <p className="text-xs text-gray-600">
            Tip: Use &ldquo;List transactional emails&rdquo; first, then paste an ID above.
          </p>
        </div>

        <div className="mt-8 lg:mt-0 lg:sticky lg:top-8 lg:max-h-[calc(100vh-8rem)] lg:flex lg:flex-col">
          <h2 className="font-semibold mb-2 text-sm text-gray-600 shrink-0">Response preview</h2>
          <pre className="w-full min-h-[12rem] max-h-[500px] lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto bg-slate-100 p-4 rounded-md text-xs">
            {results || "Run an action to see the API response here."}
          </pre>
        </div>
      </div>
    </main>
  );
}
