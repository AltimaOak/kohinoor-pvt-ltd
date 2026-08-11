import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Kohinoor Commercial II",
  description:
    "Read the Terms and Conditions governing your use of the Kohinoor Commercial II website.",
};

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: 1,
      title: "Introduction",
      content: [
        "These Terms and Conditions govern your use of the website operated by Kohinoor City Towers Industrial Estate And Premises Co-op Society (Kohinoor Commercial II) (\"we\", \"our\", \"us\").",
        "By accessing or using this website, you confirm that you have read, understood, and agreed to these Terms and Conditions. If you do not agree with these terms, please do not use the website.",
        "We may update these Terms and Conditions from time to time. Any changes will become effective when published on the website.",
      ],
    },
    {
      id: 2,
      title: "Use of the Website",
      content: [
        "The website is provided for general informational purposes and is made available free of charge.",
        "You are responsible for ensuring that your use of the website complies with these terms and all applicable laws.",
        "Where access credentials are provided, you must keep them confidential and must not share them with any third party. We reserve the right to suspend or disable access where these terms are breached.",
        "We may suspend, withdraw, modify, or discontinue any part of the website without prior notice. We do not guarantee that the website will always be available or uninterrupted.",
      ],
    },
    {
      id: 3,
      title: "Accuracy of Information",
      content: [
        "We make reasonable efforts to keep the information on the website accurate and up to date. However, we do not guarantee that the information is complete, accurate, current, or free from errors or omissions.",
        "Information provided on the website is for general guidance and illustrative purposes only and should not be treated as legal, financial, technical, or professional advice.",
        "Property descriptions, dimensions, images, plans, specifications, facilities, features, prices, projections, and other information may be subject to change without notice.",
        "Images and plans may include artistic impressions or computer-generated representations and may not be to scale.",
        "Users should independently verify relevant information and obtain appropriate professional advice before relying on information provided on the website.",
      ],
    },
    {
      id: 4,
      title: "Intellectual Property Rights",
      content: [
        "All content and materials available on the website, including text, images, graphics, designs, layouts, databases, software, and other materials, are owned by or licensed to Kohinoor City Towers Industrial Estate And Premises Co-op Society (Kohinoor Commercial II), unless otherwise stated.",
        "You must not copy, reproduce, modify, distribute, publish, transmit, reverse engineer, or create derivative works from any part of the website without prior written permission.",
        "Content downloaded or printed from the website must not be modified or used separately from its accompanying material.",
        "The content of the website must not be reproduced or published on another website or digital platform without appropriate permission.",
      ],
    },
    {
      id: 5,
      title: "Limitation of Liability",
      content: [
        "To the extent permitted by law, we exclude all warranties, representations, conditions, and other terms relating to the website and its content.",
        "We will not be liable for any loss or damage arising from:",
      ],
      list: [
        "Your use of or inability to use the website.",
        "Your reliance on information provided on the website.",
        "Errors, omissions, or inaccuracies in website content.",
        "Temporary unavailability or interruption of the website.",
        "Any loss resulting from the use of third-party websites or resources.",
        "Viruses or other technologically harmful material affecting your device or data.",
      ],
      afterList:
        "We are not responsible for indirect, incidental, consequential, or business-related losses to the extent permitted by applicable law.",
    },
    {
      id: 6,
      title: "Viruses and Security",
      content: [
        "We do not guarantee that the website will always be secure or free from viruses, bugs, or other harmful components.",
        "You are responsible for maintaining appropriate security measures and virus protection on your devices.",
        "You must not knowingly introduce viruses, malware, trojans, worms, logic bombs, or other harmful material to the website.",
        "You must not attempt to gain unauthorized access to the website, its servers, databases, or related systems, or carry out any denial-of-service or similar attack.",
        "Any violation of these provisions may result in termination of your access and may be reported to the appropriate authorities.",
      ],
    },
    {
      id: 7,
      title: "Third-Party Links",
      content: [
        "The website may contain links to third-party websites or resources. These links are provided for convenience and informational purposes only.",
        "We do not control or accept responsibility for the content, availability, security, or practices of third-party websites.",
        "The presence of a third-party link does not constitute an endorsement or approval of that website or its content.",
      ],
    },
    {
      id: 8,
      title: "Indemnity",
      content: [
        "If you breach these Terms and Conditions, violate applicable laws, or engage in any activity that affects our rights or the rights of third parties, we reserve the right to terminate or restrict your access to the website.",
        "You agree to indemnify and hold harmless Kohinoor City Towers Industrial Estate And Premises Co-op Society (Kohinoor Commercial II), its affiliates, directors, officers, employees, agents, and representatives from claims, losses, liabilities, damages, or expenses arising from your breach of these terms or unlawful use of the website.",
      ],
    },
    {
      id: 9,
      title: "Privacy",
      content: [
        "Your use of the website may involve the collection and processing of personal information. Such information will be handled in accordance with the applicable privacy practices and policies of Kohinoor Commercial II.",
        "By using the website, you agree to the processing and use of your information in accordance with the applicable privacy policy.",
      ],
    },
    {
      id: 10,
      title: "Applicable Law and Jurisdiction",
      content: [
        "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India.",
        "Any dispute arising from or relating to these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative bg-[#0F172A] overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-48 rounded-full bg-sky-500/5 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-14">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-sky-400">
              Legal
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-xl">
            Please read these terms carefully before using the Kohinoor
            Commercial II website.
          </p>

          {/* Last updated badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
            Last updated: August 2026
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
            Table of Contents
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#section-${s.id}`}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-colors group"
                >
                  <span className="w-5 h-5 rounded bg-sky-50 border border-sky-100 text-sky-600 text-[10px] font-black flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-all">
                    {s.id}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-16">
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm scroll-mt-8"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-lg bg-sky-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {section.id}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 mb-5" />

              {/* Paragraphs */}
              <div className="flex flex-col gap-3.5 text-sm text-slate-600 leading-relaxed">
                {section.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}

                {/* Optional bullet list */}
                {"list" in section && section.list && (
                  <ul className="flex flex-col gap-2 pl-1 mt-1">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {"afterList" in section && section.afterList && (
                  <p>{section.afterList}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 p-5 rounded-2xl bg-sky-50 border border-sky-100 text-sm text-sky-800 leading-relaxed">
          <strong>Questions?</strong> If you have any questions about these
          Terms &amp; Conditions, please contact us at{" "}
          <a
            href="mailto:devendra.sali@kohinoorcommercial2.in"
            className="underline hover:text-sky-600 transition-colors"
          >
            devendra.sali@kohinoorcommercial2.in
          </a>
          .
        </div>
      </section>
    </main>
  );
}
