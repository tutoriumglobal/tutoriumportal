import "server-only";

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const profileFormUrl =
  process.env.TUTOR_PROFILE_FORM_URL ||
  "https://tutoriumglobal.com/tutor-application/";

if (!apiKey) {
  throw new Error("RESEND_API_KEY is missing.");
}

if (!fromEmail) {
  throw new Error("RESEND_FROM_EMAIL is missing.");
}

const resend = new Resend(apiKey);

/**
 * Sends the tutor profile completion email.
 *
 * This function must only be called from server-side code.
 */
export async function sendTutorProfileEmail({ tutorId, firstName, email }) {
  if (!tutorId) {
    throw new Error("Tutor ID is required.");
  }

  if (!email) {
    throw new Error("Tutor email is required.");
  }

  const safeFirstName = firstName?.trim() || "Tutor";

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: [email],
      subject: "Complete Your Tutorium Tutor Profile",
      html: createTutorProfileEmailHtml({
        firstName: safeFirstName,
        profileFormUrl,
      }),
      text: createTutorProfileEmailText({
        firstName: safeFirstName,
        profileFormUrl,
      }),
    },
    {
      // Prevents duplicate requests within Resend's idempotency window.
      idempotencyKey: `tutor-profile-${tutorId}`,
    },
  );

  if (error) {
    throw new Error(error.message || "Unable to send tutor profile email.");
  }

  return data;
}

function createTutorProfileEmailHtml({ firstName, profileFormUrl }) {
  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="background:#f4f7fb;padding:32px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px;"
              >
                <tr>
                  <td>
                   <table role="presentation" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                        <img
                            src="https://app.tutoriumglobal.com/logo-image.png"
                            alt="Tutorium Global"
                            width="180"
                            style="display:block;border:0;height:auto;"
                        />
                        </td>
                    </tr>
                    </table>
                                        <h1
                      style="margin:0 0 20px;color:#0b2d8a;font-size:26px;"
                    >
                      Your Tutorium application has been approved
                    </h1>

                    <p style="font-size:16px;line-height:1.7;">
                      Hello ${escapeHtml(firstName)},
                    </p>

                    <p style="font-size:16px;line-height:1.7;">
                      Congratulations! Your Tutorium tutor application
                      has been reviewed and approved.
                    </p>

                    <p style="font-size:16px;line-height:1.7;">
                      Please complete your tutor profile so we can begin
                      matching you with suitable students.
                    </p>

                    <p style="margin:28px 0;">
                      <a
                        href="${profileFormUrl}"
                        style="
                          display:inline-block;
                          padding:14px 24px;
                          border-radius:10px;
                          background:#0b2d8a;
                          color:#ffffff;
                          font-size:16px;
                          font-weight:bold;
                          text-decoration:none;
                        "
                      >
                        Complete Your Profile
                      </a>
                    </p>
                
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function createTutorProfileEmailText({ firstName, profileFormUrl }) {
  return `
Hello ${firstName},

Congratulations! Your Tutorium tutor application has been reviewed and approved.

Please complete your tutor profile so we can begin matching you with suitable students.

Complete your profile:
${profileFormUrl}

Tutorium Global
  `.trim();
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
