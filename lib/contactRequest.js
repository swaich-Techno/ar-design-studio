import { connectDB } from "@/lib/mongodb";
import { sendDemoRequestEmail } from "@/lib/email";
import { logServerError, makeErrorRef } from "@/lib/requestContext";
import { clip } from "@/lib/textSafe";
import SupportTicket from "@/models/SupportTicket";

export async function processContactRequest(request) {
  const body = await request.json().catch(() => ({}));
  const honeypot = String(body.companyUrl || body.fax || "").trim();
  if (honeypot) {
    return { status: 201, body: { ok: true, message: "Demo request sent. We will contact you soon." } };
  }
  const businessName = clip(body.businessName, 120);
  const name = clip(body.name, 80);
  const email = String(body.email || "").toLowerCase().trim().slice(0, 120);
  const phone = clip(body.phone, 20);
  const industry = clip(body.industry || body.businessType, 40);
  const extras = [
    body.city && `City: ${String(body.city).trim()}`,
    body.website && `Website/Instagram: ${String(body.website).trim()}`,
    body.productCount && `Approx products: ${String(body.productCount).trim()}`,
    body.has3d && `Existing 3D: ${String(body.has3d).trim()}`
  ].filter(Boolean);
  const message = [String(body.message || "").trim(), ...extras].filter(Boolean).join("\n");
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
    const errorRef = makeErrorRef();
    logServerError({ requestId: errorRef, errorRef, route: "contact", error: ticketError || emailResult.reason });
    return {
      status: 500,
      body: {
        ok: false,
        error: "Demo request could not be sent.",
        errorReference: errorRef
      }
    };
  }

  if (!emailResult.ok) {
    return {
      status: 201,
      body: {
        ok: true,
        message: "Demo request received. We will contact you soon."
      }
    };
  }

  return {
    status: 201,
    body: {
      ok: true,
      message: "Demo request sent. We will contact you soon."
    }
  };
}
