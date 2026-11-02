// Отправляет админу письмо о новой заявке (Supabase Database Webhook -> эта функция -> Resend)
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) return new Response("forbidden", { status: 403 });
  const { record: l } = await req.json();
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("FROM_EMAIL") ?? "NeuroFlow AI <onboarding@resend.dev>",
      to: [Deno.env.get("ADMIN_EMAIL")],
      reply_to: l.email,
      subject: `Новая заявка: ${String(l.name).slice(0, 80)}`,
      html: `<h2>Новая заявка</h2><p><b>Имя:</b> ${esc(l.name)}</p><p><b>Email:</b> ${esc(l.email)}</p><p><b>Сообщение:</b><br>${esc(l.message)}</p>`,
    }),
  });
  return new Response(r.ok ? "ok" : await r.text(), { status: r.ok ? 200 : 502 });
});
