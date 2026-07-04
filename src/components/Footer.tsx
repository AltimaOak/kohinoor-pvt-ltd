import React from "react";
import Link from "next/link";
import { Mail, MapPin, Globe, Building2 } from "lucide-react";
import { getDb } from "@/app/actions";

export default async function Footer() {
  const db = await getDb();
  const contacts = db.contacts;
  const managerEmails = Array.from(new Set(contacts.managers.map(m => m.email)));
  return (
    <footer className="relative border-t border-slate-800 bg-[#0F172A] pt-12 pb-8 overflow-hidden text-slate-400">
      {/* Decorative Blur Dot */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 pb-10 border-b border-slate-800">
          
          {/* Logo & Intro Column (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded border border-slate-800 bg-white flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Kohinoor City Logo"
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col max-w-[280px]">
                <span className="text-xs font-extrabold tracking-tight text-white leading-tight">
                  KOHINOOR CITY OFFICE TOWERS
                </span>
                <span className="text-[7px] uppercase tracking-[0.05em] font-semibold text-sky-400 leading-none mt-0.5">
                  INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A premium commercial destination redefining modern workspaces, offering elite facilities and a secure environment for business society members.
            </p>

            {/* Social Media Link Items */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { icon: Globe, href: "#" },
                { icon: Mail, href: managerEmails.length > 0 ? `mailto:${managerEmails[0]}` : "#" },
                { icon: Building2, href: "/" }
              ].map((soc, i) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.href}
                    className="w-8 h-8 rounded bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sitemap Navigation (3 Columns) */}
          <div className="lg:col-span-3 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
             Quick Navigation
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { name: "Home ", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Events", href: "/events" },
                { name: "Contacts", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Visit Our Office
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
                <a
                  href={contacts.siteAddressMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed hover:text-sky-400 transition-colors whitespace-pre-line"
                >
                  Kohinoor City, B-2,Commercial-2,Kirol Road,Kurla(W),Mumbai-400070
                </a>
              </li>
            </ul>

            {managerEmails.length > 0 && (
              <>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mt-1.5">
                  Email Us
                </h4>
                <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
                  <li className="flex items-start gap-3">
                    <Mail className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-1" />
                    <div className="flex flex-col gap-1.5 font-semibold">
                      {managerEmails.map((email, idx) => (
                        <a key={idx} href={`mailto:${email}`} className="hover:text-sky-400 transition-colors">
                          {email}
                        </a>
                      ))}
                    </div>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Lower Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-sky-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-sky-400 cursor-pointer transition-colors">Terms of Lease</span>
            <span className="hover:text-sky-400 cursor-pointer transition-colors">Security Standards</span>
            <span className="text-slate-700">|</span>
            <Link href="/admin" className="hover:text-sky-400 cursor-pointer transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
