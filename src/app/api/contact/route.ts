import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to:      [process.env.ADMIN_EMAIL || "admin@aprakashco.com"],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF8F2;">
          <div style="background: #0A9B4B; padding: 20px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 24px; margin: 0;">A. Prakash & Co.</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">New Contact Form Message</p>
          </div>
          <div style="background: white; padding: 28px; border: 1px solid rgba(10,155,75,0.15);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 80px;">Name</td>
                <td style="padding: 8px 0; color: #1E1E1E; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #1E1E1E; font-size: 14px;">${email}</td>
              </tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Phone</td><td style="padding: 8px 0; color: #1E1E1E; font-size: 14px;">${phone}</td></tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Subject</td>
                <td style="padding: 8px 0; color: #1E1E1E; font-size: 14px; font-weight: 600;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid rgba(10,155,75,0.1); margin: 16px 0;" />
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">Message:</p>
            <p style="color: #1E1E1E; font-size: 14px; line-height: 1.6; white-space: pre-line;">${message}</p>
          </div>
          <p style="text-align: center; color: #9CA3AF; font-size: 11px; margin-top: 16px;">
            A. Prakash & Co. — Since 1928
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
