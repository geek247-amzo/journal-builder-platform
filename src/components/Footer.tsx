import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-bold tracking-wider mb-4">CONTINUATE</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Secure IT Continuity Since 2015. Johannesburg's trusted managed security service provider.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-primary-foreground/80">Services</h4>
            <ul className="space-y-2">
              {["NOC/SOC", "Cybersecurity", "Backups & DR", "Networking", "CCTV & Biometrics", "Hardware"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-primary-foreground/80">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About", path: "/about" },
                { label: "Pricing", path: "/pricing" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-primary-foreground/80">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <MapPin size={14} className="shrink-0" />
                Johannesburg, South Africa
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Phone size={14} className="shrink-0" />
                +27 (0) 11 000 0000
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Mail size={14} className="shrink-0" />
                info@continuate.co.za
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Continuate IT Services. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            POPIA Compliant · SSL Secured
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
