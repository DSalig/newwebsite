// Supabase Edge Function: generate-product-image
// Generates one product photo via Replicate's FLUX 1.1 Pro model.
// The Replicate key lives ONLY in Supabase secrets — never in the
// repo, chat, or client code.
//
// Deploy:   supabase functions deploy generate-product-image
// Secret:   Dashboard → Edge Functions → Secrets → REPLICATE_API_TOKEN
// Call:     POST { prompt: string }  →  { url: string }
//
// Note: this function is for the one-time catalog batch (see
// scripts/generate-product-photos.mjs). Delete it after the batch
// so nobody can spend your Replicate credit:
//   supabase functions delete generate-product-image

// deno-lint-ignore-file no-explicit-any
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve: (h: (req: Request) => Promise<Response> | Response) => void;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const token = Deno.env.get("REPLICATE_API_TOKEN");
  if (!token) {
    return Response.json(
      { error: "REPLICATE_API_TOKEN secret not set in Supabase" },
      { status: 500, headers: CORS },
    );
  }

  const { prompt } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "prompt required" }, { status: 400, headers: CORS });
  }

  // FLUX 1.1 Pro, synchronous wait (Replicate holds the connection)
  const res = await fetch(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: "4:5",
          output_format: "jpg",
          output_quality: 90,
          prompt_upsampling: false,
        },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `Replicate ${res.status}`, detail: detail.slice(0, 300) },
      { status: 502, headers: CORS },
    );
  }

  const json: any = await res.json();
  const url = typeof json.output === "string" ? json.output : json.output?.[0];
  if (!url) {
    return Response.json(
      { error: "no output from model", status: json.status },
      { status: 502, headers: CORS },
    );
  }
  return Response.json({ url }, { headers: CORS });
});
