import { NextResponse } from "next/server";
import supabase from "../../../../../services/supabase";

function getAllowedOrigins() {
  return [
    process.env.WORDPRESS_SITE_URL?.replace(/\/$/, ""),
    "https://tutoriumglobal.com",
    "https://www.tutoriumglobal.com",
    "http://localhost:3000",
  ].filter(Boolean);
}

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  const headers = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(request, body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: getCorsHeaders(request),
  });
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");

  if (origin && !getAllowedOrigins().includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      headers: getCorsHeaders(request),
    });
  }

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request) {
  const origin = request.headers.get("origin");

  if (origin && !getAllowedOrigins().includes(origin)) {
    return jsonResponse(
      request,
      {
        success: false,
        message: "This website is not allowed to access subjects.",
      },
      403,
    );
  }

  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, color, category, status")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Unable to load active subjects:", error);

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to load subjects.",
        },
        500,
      );
    }

    return jsonResponse(request, {
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("Unexpected active subjects error:", error);

    return jsonResponse(
      request,
      {
        success: false,
        message: "An unexpected error occurred while loading subjects.",
      },
      500,
    );
  }
}
