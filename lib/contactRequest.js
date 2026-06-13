import { connectDB } from "@/lib/mongodb";
import { sendDemoRequestEmail } from "@/lib/email";
import SupportTicket from "@/models/SupportTicket";

export async function processContactRequest(request) {
  const body = await request.json().catch(() => ({}));
  const businessName = String(body.businessName || "").trim();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").toLowerCase().trim();
  const phone = String(body.phone || "").trim();
  const industry = String(body.industry || "").trim();
  const message = String(body.message || "").trim();
  const source = String(body.source || request.headers.get("referer") || "direct").trim();

  if (!name || !phone || !email) {
    return { status: 400, body: { error: "Name, email, and phone or WhatsApp number are required." } };
  }

  if (!email.includes("@")) {
    return { status: 400, body: { error: "Enter a valid email address for demo approval." } };
  }

  let ticket = null;
  let ticketError = "";

  try {
    await connectDB();
    ticket = await SupportTicket.create({
      title: `Free demo request - ${businessName || name}`,
      ticketType: "DEMO_REQUEST",
      description: [
        `Business: ${businessName || "Not shared"}`,
        `Name: ${name}`,
        `Email: ${email || "Not shared"}`,
        `Phone/WhatsApp: ${phone}`,
        `Industry: ${industry || "Not shared"}`,
        `Source: ${source || "direct"}`,
        `Requirement: ${message || "Not shared"}`
      ].join("\n"),
      priority: "HIGH",
      status: "OPEN",
      notes: "Public landing page demo request",
      requesterBusinessName: businessName,
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone,
      requesterIndustry: industry,
      demoStatus: "REQUESTED",
      demoProductLimit: 1,
      demoArProductLimit: 1
    });
  } catch (error) {
    ticketError = error.message || "Support ticket could not be saved.";
  }

  const emailResult = await sendDemoRequestEmail({
    businessName,
    name,
    email,
    phone,
    industry,
    message,
    source,
    ticketId: ticket ? String(ticket._id) : "",
    pageUrl: request.headers.get("referer") || ""
  }).catch((error) => ({
    ok: false,
    failed: true,
    reason: error.message || "Email failed."
  }));

  if (ticket) {
    ticket.notes = emailResult.ok
      ? `Public landing page demo request. Email sent: ${emailResult.id || "sent"}.`
      : `Public landing page demo request. Email not sent: ${emailResult.reason || "Unknown error"}.`;
    await ticket.save();
  }

  if (!emailResult.ok && ticketError) {
    return {
      status: 500,
      body: {
        ok: false,
        emailSent: false,
        emailError: emailResult.reason || "Email was not sent.",
        ticketSaved: false,
        ticketError,
        error: "Demo request could not be sent. Check Vercel email and MongoDB environment variables."
      }
    };
  }

  if (!emailResult.ok) {
    return {
      status: 201,
      body: {
        ok: true,
        ticketId: ticket ? String(ticket._id) : "",
        emailSent: false,
        emailError: emailResult.reason || "Email was not sent.",
        ticketSaved: Boolean(ticket),
        ticketError,
        message: emailResult.skipped
          ? "Demo request saved. Email settings are missing in Vercel."
          : "Demo request saved, but email delivery failed."
      }
    };
  }

  return {
    status: 201,
    body: {
      ok: true,
      ticketId: ticket ? String(ticket._id) : "",
      emailSent: true,
      ticketSaved: Boolean(ticket),
      ticketError,
      message: "Demo request sent. We will contact you soon."
    }
  };
}
