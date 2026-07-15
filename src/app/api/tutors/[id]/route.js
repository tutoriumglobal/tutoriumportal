import { NextResponse } from "next/server";
import { sendTutorProfileEmail } from "../../../../../services/resend.service";
import supabase from "../../../../../services/supabase";

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, { status });
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

function normalizeTutor(tutor) {
  return {
    ...tutor,
    full_name: `${tutor.first_name || ""} ${tutor.last_name || ""}`.trim(),
    specialties: Array.isArray(tutor.specialties) ? tutor.specialties : [],
    available_days: Array.isArray(tutor.available_days)
      ? tutor.available_days
      : [],
  };
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  const tutorId = Number(id);

  if (!Number.isInteger(tutorId) || tutorId <= 0) {
    return jsonResponse(
      {
        success: false,
        message: "Invalid tutor ID.",
      },
      400,
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      {
        success: false,
        message: "The request must contain valid JSON.",
      },
      400,
    );
  }

  try {
    const { data: existingTutor, error: fetchError } = await supabase
      .from("tutors")
      .select("*")
      .eq("id", tutorId)
      .single();

    if (fetchError || !existingTutor) {
      return jsonResponse(
        {
          success: false,
          message: "Tutor not found.",
        },
        404,
      );
    }

    const requestedStatus = cleanText(body.status || existingTutor.status, 20);

    const allowedStatuses = new Set(["pending", "active", "inactive"]);

    if (!allowedStatuses.has(requestedStatus)) {
      return jsonResponse(
        {
          success: false,
          message: "Invalid tutor status.",
        },
        422,
      );
    }

    const updatePayload = {
      first_name: cleanText(body.first_name, 100) || existingTutor.first_name,

      last_name: cleanText(body.last_name, 100) || existingTutor.last_name,

      email: cleanText(body.email, 254).toLowerCase() || existingTutor.email,

      phone:
        body.phone !== undefined
          ? cleanOptionalText(body.phone, 50)
          : existingTutor.phone,

      timezone: cleanText(body.timezone, 100) || existingTutor.timezone,

      available_days:
        body.available_days !== undefined
          ? cleanStringArray(body.available_days, 7)
          : existingTutor.available_days,

      available_start_time:
        body.available_start_time || existingTutor.available_start_time,

      available_end_time:
        body.available_end_time || existingTutor.available_end_time,

      qualification:
        cleanText(body.qualification, 255) || existingTutor.qualification,

      experience:
        body.experience !== undefined
          ? cleanOptionalText(body.experience, 255)
          : existingTutor.experience,

      bio:
        body.bio !== undefined
          ? cleanOptionalText(body.bio, 2000)
          : existingTutor.bio,

      specialties:
        body.specialties !== undefined
          ? cleanStringArray(body.specialties, 20)
          : existingTutor.specialties,

      avatar_url:
        body.avatar_url !== undefined
          ? cleanOptionalText(body.avatar_url, 1000)
          : existingTutor.avatar_url,

      status: requestedStatus,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedTutor, error: updateError } = await supabase
      .from("tutors")
      .update(updatePayload)
      .eq("id", tutorId)
      .select("*")
      .single();

    if (updateError) {
      console.error("Tutor update failed:", updateError);

      return jsonResponse(
        {
          success: false,
          message: "Unable to update tutor.",
        },
        500,
      );
    }

    const shouldSendProfileEmail =
      updatedTutor.status === "active" &&
      existingTutor.profile_email_sent !== true;

    let emailSent = false;
    let emailWarning = null;

    if (shouldSendProfileEmail) {
      try {
        const emailResult = await sendTutorProfileEmail({
          tutorId: updatedTutor.id,
          firstName: updatedTutor.first_name,
          email: updatedTutor.email,
        });

        const sentAt = new Date().toISOString();

        const { data: tutorAfterEmail, error: emailUpdateError } =
          await supabase
            .from("tutors")
            .update({
              profile_email_sent: true,
              profile_email_sent_at: sentAt,
              profile_email_id: emailResult?.id || null,
              updated_at: sentAt,
            })
            .eq("id", tutorId)
            .select("*")
            .single();

        if (emailUpdateError) {
          console.error(
            "Tutor email tracking update failed:",
            emailUpdateError,
          );

          emailWarning =
            "The email was sent, but its tracking status could not be saved.";
        } else {
          emailSent = true;

          return jsonResponse({
            success: true,
            message: "Tutor updated and profile email sent successfully.",
            tutor: normalizeTutor(tutorAfterEmail),
            email_sent: true,
          });
        }
      } catch (emailError) {
        console.error("Tutor profile email failed:", emailError);

        emailWarning =
          "Tutor was updated, but the profile email could not be sent.";
      }
    }

    return jsonResponse({
      success: true,
      message: emailWarning ? emailWarning : "Tutor updated successfully.",
      tutor: normalizeTutor(updatedTutor),
      email_sent: emailSent,
      warning: emailWarning,
    });
  } catch (error) {
    console.error("Unexpected tutor update error:", error);

    return jsonResponse(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      500,
    );
  }
}
