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

const ALLOWED_CURRICULA = new Set([
  "British",
  "American",
  "Canadian",
  "Nigerian",
  "Australian",
  "International Baccalaureate",
  "Other",
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

function cleanText(value, maxLength = 255) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function cleanOptionalText(value, maxLength = 255) {
  const cleanedValue = cleanText(value, maxLength);
  return cleanedValue || null;
}

function cleanStringArray(value, maximumItems = 20) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(value.map((item) => cleanText(item, 100)).filter(Boolean)),
  ].slice(0, maximumItems);
}

function cleanIntegerArray(value, maximumItems = 20) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item > 0),
    ),
  ].slice(0, maximumItems);
}

function validatePayload(body) {
  const errors = {};

  const firstName = cleanText(body.first_name, 100);
  const lastName = cleanText(body.last_name, 100);
  const grade = cleanText(body.grade, 100);
  const curriculum = cleanText(body.curriculum, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const timezone = cleanText(body.timezone, 100);

  const preferredDays = cleanStringArray(body.preferred_days, 7);

  const subjectIds = cleanIntegerArray(body.subject_ids, 20);

  const startTime = cleanText(body.preferred_start_time, 5);

  const endTime = cleanText(body.preferred_end_time, 5);

  if (firstName.length < 2) {
    errors.first_name = "First name must contain at least 2 characters.";
  }

  if (lastName.length < 2) {
    errors.last_name = "Last name must contain at least 2 characters.";
  }

  if (!grade) {
    errors.grade = "Grade or year level is required.";
  }

  if (!ALLOWED_CURRICULA.has(curriculum)) {
    errors.curriculum = "Select a valid curriculum.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!timezone) {
    errors.timezone = "Timezone is required.";
  }

  if (!preferredDays.length) {
    errors.preferred_days = "Select at least one preferred lesson day.";
  } else if (preferredDays.some((day) => !ALLOWED_DAYS.has(day))) {
    errors.preferred_days = "One or more preferred days are invalid.";
  }

  if (!TIME_PATTERN.test(startTime)) {
    errors.preferred_start_time = "Enter a valid preferred start time.";
  }

  if (!TIME_PATTERN.test(endTime)) {
    errors.preferred_end_time = "Enter a valid preferred end time.";
  }

  if (
    TIME_PATTERN.test(startTime) &&
    TIME_PATTERN.test(endTime) &&
    startTime >= endTime
  ) {
    errors.preferred_end_time =
      "Preferred end time must be later than the start time.";
  }

  if (!subjectIds.length) {
    errors.subject_ids = "Select at least one subject.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,

    data: {
      first_name: firstName,
      last_name: lastName,
      grade,
      curriculum,
      email,
      phone: cleanOptionalText(body.phone, 50),
      timezone,
      preferred_days: preferredDays,
      preferred_start_time: startTime,
      preferred_end_time: endTime,
      subject_ids: subjectIds,

      avatar_url: null,

      // Never trust status supplied by WordPress.
      status: "pending",
    },
  };
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

export async function POST(request) {
  const origin = request.headers.get("origin");

  if (origin && !getAllowedOrigins().includes(origin)) {
    return jsonResponse(
      request,
      {
        success: false,
        message: "This website is not allowed to submit student registrations.",
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
        message: "Please correct the registration information.",
        errors: validation.errors,
      },
      422,
    );
  }

  const { subject_ids: subjectIds, ...studentPayload } = validation.data;

  try {
    /*
     * Confirm that every submitted subject exists
     * and is currently active.
     */
    const { data: activeSubjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name, status")
      .in("id", subjectIds)
      .eq("status", "active");

    if (subjectsError) {
      console.error("Subject validation failed:", subjectsError);

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to validate the selected subjects.",
        },
        500,
      );
    }

    const activeSubjectIds = new Set(
      (activeSubjects ?? []).map((subject) => Number(subject.id)),
    );

    const invalidSubjectIds = subjectIds.filter(
      (subjectId) => !activeSubjectIds.has(Number(subjectId)),
    );

    if (invalidSubjectIds.length) {
      return jsonResponse(
        request,
        {
          success: false,
          message: "One or more selected subjects are unavailable.",
          errors: {
            subject_ids: "Refresh the page and select active subjects.",
          },
        },
        422,
      );
    }

    /*
     * Create the student first.
     */
    const { data: createdStudent, error: studentError } = await supabase
      .from("students")
      .insert(studentPayload)
      .select(
        `
          id,
          first_name,
          last_name,
          email,
          grade,
          curriculum,
          timezone,
          status,
          created_at
        `,
      )
      .single();

    if (studentError) {
      console.error("Student registration insert failed:", studentError);

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to submit the student registration.",
        },
        500,
      );
    }

    /*
     * Attach the selected subjects to the student.
     */
    const studentSubjectRows = subjectIds.map((subjectId) => ({
      student_id: createdStudent.id,
      subject_id: subjectId,
    }));

    const { error: studentSubjectsError } = await supabase
      .from("student_subjects")
      .insert(studentSubjectRows);

    if (studentSubjectsError) {
      console.error("Unable to attach student subjects:", studentSubjectsError);

      /*
       * Best-effort rollback so we do not leave
       * a student without their selected subjects.
       */
      const { error: rollbackError } = await supabase
        .from("students")
        .delete()
        .eq("id", createdStudent.id);

      if (rollbackError) {
        console.error("Student rollback failed:", rollbackError);
      }

      return jsonResponse(
        request,
        {
          success: false,
          message: "Unable to save the selected subjects.",
        },
        500,
      );
    }

    return jsonResponse(
      request,
      {
        success: true,
        message:
          "The learner registration has been submitted successfully and is pending review.",

        student: {
          id: createdStudent.id,

          full_name:
            `${createdStudent.first_name} ${createdStudent.last_name}`.trim(),

          first_name: createdStudent.first_name,

          last_name: createdStudent.last_name,

          email: createdStudent.email,

          grade: createdStudent.grade,

          curriculum: createdStudent.curriculum,

          timezone: createdStudent.timezone,

          status: createdStudent.status,

          subjects: activeSubjects ?? [],

          created_at: createdStudent.created_at,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Unexpected student registration error:", error);

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
