import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Privacy Policy | B Socio",
  description: "Privacy Policy for B Socio, including website forms, Google Ads lead forms, WhatsApp, email, social media, and service-related communication.",
  alternates: {
    canonical: "https://ar.bsocio.in/privacy-policy"
  },
  openGraph: {
    title: "Privacy Policy | B Socio",
    description: "How B Socio collects, uses, stores, and protects information shared through its website and communication channels.",
    url: "https://ar.bsocio.in/privacy-policy",
    type: "website"
  }
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We may collect the following information when you contact us or submit a form:",
    items: [
      "Name",
      "Phone number",
      "Email address",
      "Business name",
      "Business type",
      "Instagram page or social media link",
      "Website link",
      "Service requirement",
      "Messages or details shared by you",
      "Basic website usage data such as page visits, device type, and browser information"
    ]
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to:",
    items: [
      "Contact you regarding your inquiry",
      "Provide a free digital audit",
      "Understand your business needs",
      "Suggest suitable services such as website design, digital marketing, Google Business Profile improvement, QR/AR experiences, branding, and lead generation",
      "Send proposals, quotations, updates, or service-related communication",
      "Improve our website, ads, services, and customer experience"
    ]
  },
  {
    title: "3. Google Ads Lead Forms",
    body: "When you submit your details through a Google Ads lead form, the information is shared with B Socio so we can contact you about your inquiry. We only use this information for business communication and service-related purposes."
  },
  {
    title: "4. WhatsApp, Email, and Phone Communication",
    body: "By submitting your contact details, you agree that B Socio may contact you through phone call, WhatsApp, SMS, or email regarding your inquiry, audit request, quotation, or services."
  },
  {
    title: "5. Sharing of Information",
    body: "We do not sell your personal information. We may share limited information only when required for:",
    items: [
      "Providing our services",
      "Website hosting, form management, analytics, or advertising tools",
      "Legal, safety, or compliance requirements",
      "Communication through platforms such as email, WhatsApp, or advertising services"
    ]
  },
  {
    title: "6. Data Security",
    body: "We take reasonable steps to protect your information from unauthorized access, misuse, loss, or disclosure. However, no online method of data transmission or storage is completely secure."
  },
  {
    title: "7. Data Retention",
    body: "We keep your information only as long as needed for business communication, service delivery, record keeping, legal requirements, or follow-up purposes."
  },
  {
    title: "8. Your Rights",
    body: "You may contact us to:",
    items: [
      "Request access to your personal information",
      "Ask us to correct your information",
      "Request deletion of your information",
      "Stop receiving marketing or follow-up communication"
    ]
  },
  {
    title: "9. Cookies and Tracking",
    body: "Our website or ads may use cookies, analytics tools, or tracking technologies to understand website performance, improve user experience, and measure advertising results."
  },
  {
    title: "10. Third-Party Links",
    body: "Our website may contain links to third-party websites or platforms. B Socio is not responsible for the privacy practices or content of those third-party websites."
  },
  {
    title: "11. Updates to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date."
  },
  {
    title: "12. Contact Us",
    body: "For privacy-related questions or requests, contact us at:"
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f7f8fb] text-ink">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 font-black text-brand">
            <img src="/icons/icon-192.png" alt="" width="36" height="36" className="h-9 w-9 rounded-lg object-cover" />
            AR Design Studio
          </Link>
          <div className="mt-8 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-teal-50 text-brand">
              <ShieldCheck size={26} aria-hidden="true" focusable="false" />
            </span>
            <div>
              <p className="font-black text-brand">Effective Date: 20 June 2026</p>
              <h1 className="mt-2 text-4xl font-black md:text-5xl">Privacy Policy</h1>
              <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
                B Socio respects your privacy. This Privacy Policy explains how we collect, use, store, and protect the information you share with us through our website, contact forms, Google Ads lead forms, WhatsApp, email, social media, or any other communication channel.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 sm:grid-cols-3">
            <p><span className="text-slate-500">Business Name:</span> B Socio</p>
            <p><span className="text-slate-500">Website:</span> bsocio.in</p>
            <p><span className="text-slate-500">Page:</span> ar.bsocio.in/privacy-policy</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-5 py-10">
        {sections.map((section) => (
          <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">{section.title}</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{section.body}</p>
            {section.items ? (
              <ul className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-slate-600">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.title === "12. Contact Us" ? (
              <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <p>B Socio</p>
                <a className="mt-2 inline-flex items-center gap-2 text-brand" href="mailto:connect@bsocio.in">
                  <Mail size={16} aria-hidden="true" focusable="false" />
                  connect@bsocio.in
                </a>
                <p className="mt-2">Website: bsocio.in</p>
              </div>
            ) : null}
          </article>
        ))}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/">Back Home</Button>
          <Button href="/contact" variant="light">Contact B Socio</Button>
        </div>
      </section>
    </main>
  );
}
