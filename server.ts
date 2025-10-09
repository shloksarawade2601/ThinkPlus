import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";

const PORT = 8000;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Serve static files from styles/ and scripts/
  if (pathname.startsWith("/styles/") || pathname.startsWith("/scripts/")) {
    return serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  }

  // Route to HTML pages
  const htmlRoutes: Record<string, string> = {
    "/": "public/index.html",
    "/index.html": "public/index.html",
    "/login.html": "public/login.html",
    "/signup.html": "public/signup.html",
    "/dashboard.html": "public/dashboard.html",
    "/start_exam.html": "public/start_exam.html",
    "/exam.html": "public/exam.html",
    "/result.html": "public/result.html",
    "/insights.html": "public/insights.html",
    "/profile.html": "public/profile.html",
    "/report_card.html": "public/report_card.html",
    
    // 🚀 NEW SETTINGS & INFO PAGES ADDED BELOW 🚀
    "/personalinfo.html": "public/personalinfo.html",
    "/security_and_privacy.html": "public/security_and_privacy.html",
    "/settings.html": "public/settings.html",
    "/help_and_support.html": "public/help_and_support.html",
    "/about_thinkplus.html": "public/about_thinkplus.html",
    // 🚀 END NEW PAGES 🚀
  };

  const filePath = htmlRoutes[pathname];
  
  if (filePath) {
    try {
      // NOTE: Deno.readFile is necessary here for non-static files outside the served directories
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  // API routes (future implementation)
  if (pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ message: "API endpoint placeholder" }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}

console.log(`🚀 ThinkPlus server running on http://localhost:${PORT}`);
await serve(handler, { port: PORT });