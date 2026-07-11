import { NextResponse } from "next/server";
import supabase from "../../../../../services/supabase";

const ALLOWED_DAYS = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function getAllowedOrigins() {
  const configuredOrigin = process.env.WORDPRESS_SITE_URL?.replace(/\/$/, "");

  return [
    configuredOrigin,
    "https://www.tutoriumglobal.com",
    "https://tutoriumglobal.com",
    "http://localhost:3000",
  ].filter(Boolean);
}

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  const allowedOrigin =
    origin && allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0] || "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(request, body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: getCorsHeaders(request),
  });
}

function cleanText(value, maxLength = 255) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function cleanOptionalText(value, maxLength = 255) {
  const cleaned = cleanText(value, maxLength);
  return cleaned || null;
}

function cleanStringArray(value, maximumItems = 20) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(value.map((item) => cleanText(item, 100)).filter(Boolean)),
  ].slice(0, maximumItems);
}

function validatePayload(body) {
  const errors = {};

  const firstName = cleanText(body.first_name, 100);
  const lastName = cleanText(body.last_name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const timezone = cleanText(body.timezone, 100);
  const qualification = cleanText(body.qualification, 255);

  const availableDays = cleanStringArray(body.available_days, 7);

  const specialties = cleanStringArray(body.specialties, 20);

  const startTime = cleanText(body.available_start_time, 5);

  const endTime = cleanText(body.available_end_time, 5);

  if (firstName.length < 2) {
    errors.first_name = "First name must contain at least 2 characters.";
  }

  if (lastName.length < 2) {
    errors.last_name = "Last name must contain at least 2 characters.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!timezone) {
    errors.timezone = "Timezone is required.";
  }

  if (!availableDays.length) {
    errors.available_days = "Select at least one available day.";
  } else if (availableDays.some((day) => !ALLOWED_DAYS.has(day))) {
    errors.available_days = "One or more available days are invalid.";
  }

  if (!TIME_PATTERN.test(startTime)) {
    errors.available_start_time = "Enter a valid available start time.";
  }

  if (!TIME_PATTERN.test(endTime)) {
    errors.available_end_time = "Enter a valid available end time.";
  }

  if (
    TIME_PATTERN.test(startTime) &&
    TIME_PATTERN.test(endTime) &&
    startTime >= endTime
  ) {
    errors.available_end_time =
      "Available end time must be later than the start time.";
  }

  if (!qualification) {
    errors.qualification = "Qualification is required.";
  }

  if (!specialties.length) {
    errors.specialties = "Add at least one teaching specialty.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,

    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: cleanOptionalText(body.phone, 50),
      timezone,
      available_days: availableDays,
      available_start_time: startTime,
      available_end_time: endTime,
      qualification,
      experience: cleanOptionalText(body.experience, 255),
      bio: cleanOptionalText(body.bio, 2000),
      specialties,
      avatar_url: null,

      // Never trust the status sent from WordPress.
      status: "pending",
    },
  };
}

/**
 * Handles the browser CORS preflight request.
 */
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

/**
 * Creates a pending tutor registration.
 */
export async function POST(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  if (origin && !allowedOrigins.includes(origin)) {
    return jsonResponse(
      request,
      {
        success: false,
        message: "This website is not allowed to submit tutor applications.",
      },
      403,
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      request,
      {
        success: false,
        message: "The request body must contain valid JSON.",
      },
      400,
    );
  }

  const validation = validatePayload(body);

  if (!validation.valid) {
    return jsonResponse(
      request,
      {
        success: false,
        message: "Please correct the highlighted form fields.",
        errors: validation.errors,
      },
      422,
    );
  }

  try {
    const { data: existingTutor, error: lookupError } = await supabase
      .from("tutors")
      .select("id, email, status")
      .eq("email", validation.data.email)
      .maybeSingle();

    if (lookupError) {
      console.error("Tutor duplicate check failed:", lookupError);

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to process the application at this time.",
        },
        500,
      );
    }

    if (existingTutor) {
      return jsonResponse(
        request,
        {
          success: false,
          message: "A tutor application already exists for this email address.",
        },
        409,
      );
    }

    const { data: tutor, error: insertError } = await supabase
      .from("tutors")
      .insert(validation.data)
      .select(
        `
            id,
            first_name,
            last_name,
            email,
            status,
            created_at
          `,
      )
      .single();

    if (insertError) {
      console.error("Tutor registration insert failed:", insertError);

      if (insertError.code === "23505") {
        return jsonResponse(
          request,
          {
            success: false,
            message:
              "A tutor application already exists for this email address.",
          },
          409,
        );
      }

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to submit your tutor application.",
        },
        500,
      );
    }

    return jsonResponse(
      request,
      {
        success: true,
        message:
          "Your tutor application has been submitted successfully and is pending review.",
        tutor: {
          id: tutor.id,
          first_name: tutor.first_name,
          last_name: tutor.last_name,
          email: tutor.email,
          status: tutor.status,
          created_at: tutor.created_at,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Unexpected tutor registration error:", error);

    return jsonResponse(
      request,
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      500,
    );
  }
}
