// Supabase Edge Function: analyze-space
// Deploy with:  supabase functions deploy analyze-space
// Secrets:      supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Equivalent to the Next.js /api/analyze route for teams who
// prefer AI calls to live inside Supabase (e.g. when hosting
// the frontend statically). Accepts { image, roomType, goals }
// and returns the same Analysis JSON shape the frontend expects.

// deno-lint-ignore-file no-explicit-any
declare const Deno: { env: { get(name: string): string | undefined }; serve: (h: (req: Request) => Promise<Response> | Response) => void };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const { image, roomType = "other", goals = "" } = await req.json().catch(() => ({}));

  if (!apiKey || !image) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured or image missing; use the site's built-in demo mode." },
      { status: 400, headers: CORS }
    );
  }

  const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(image);
  if (!match) return Response.json({ error: "image must be a base64 data URL" }, { status: 400, headers: CORS });
  const [, mediaType, data] = match;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data } },
            {
              type: "text",
              text: `You are the lighting designer at Lumenwright, a custom lighting atelier. Analyze this photo of a client's ${roomType} (goals: ${goals || "not specified"}). Respond with ONLY valid JSON: {"spaceRead": string, "naturalLight": string, "mood": string, "layers": [{"layer": "Ambient"|"Task"|"Accent", "recommendation": string, "productSlugs": string[]}], "cct": string, "controls": string, "nextStep": string}. Ground observations in what is visible.`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json({ error: `Anthropic API ${res.status}` }, { status: 502, headers: CORS });
  }

  const json: any = await res.json();
  const text: string = json.content?.[0]?.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return Response.json({ error: "model returned no JSON" }, { status: 502, headers: CORS });

  return Response.json(
    { source: "ai", ...JSON.parse(jsonMatch[0]) },
    { headers: { ...CORS, "content-type": "application/json" } }
  );
});
