import { motion } from "framer-motion";
import {
  Network,
  Check,
  Wifi,
  Shield,
  Globe,
  ArrowRight,
  Cable,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";

const pricingCards = [
  {
    title: "CAT5e",
    price: "R700",
    unit: "per point",
    features: [
      "Cable run up to 90m",
      "Termination at both ends",
      "Testing & verification",
      "Labelling",
      "Certification report",
    ],
  },
  {
    title: "CAT6",
    price: "R800",
    unit: "per point",
    features: [
      "Cable run up to 90m",
      "Termination at both ends",
      "Testing & verification",
      "Labelling",
      "Certification report",
    ],
  },
  {
    title: "Fibre",
    price: "R1,200",
    unit: "per point",
    highlight: "Incl. splicing",
    features: [
      "Fibre cable run",
      "Splicing & termination",
      "Testing & verification",
      "Labelling",
      "Certification report",
    ],
  },
];

const included = [
  "Site survey & planning",
  "Cable runs & concealment",
  "Termination & patching",
  "Testing & certification",
  "Labelling & documentation",
];

const additionalServices = [
  {
    icon: Globe,
    title: "LAN / WAN Design & Deployment",
    desc: "Full network architecture — from switches and routers to structured cabling and VLANs.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Site Surveys & Installation",
    desc: "Heat-mapped site surveys with enterprise-grade access point deployment for seamless coverage.",
  },
  {
    icon: Shield,
    title: "VPN & Remote Access",
    desc: "Secure site-to-site and remote access VPN solutions for distributed teams.",
  },
  {
    icon: Network,
    title: "SD-WAN Deployment",
    desc: "Software-defined WAN for intelligent traffic routing, redundancy, and cost optimisation.",
  },
];

const Networking = () => {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-primary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-4">
              Networking
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Professional Network Cabling & Infrastructure
            </h1>
            <p className="text-lg text-primary-foreground/60 leading-relaxed">
              Fixed per-point pricing for structured cabling — CAT5e, CAT6, and fibre. Every installation includes a site survey, testing, certification, and full documentation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free Trial Banner */}
      <section className="section-padding bg-primary border-t border-primary-foreground/10">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-3">
              Limited Offer
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Try Our Managed IT Support — Free for 30 Days
            </h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto mb-8 leading-relaxed">
              No commitment. No credit card. Experience proactive monitoring, unlimited remote support, and 24/7 NOC coverage — completely free for your first month.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
            >
              Start Your Free Trial <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Cabling Rates
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Fixed Per-Point Pricing
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingCards.map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-8 border border-border bg-background"
              >
                <Cable size={28} className="text-foreground mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                  {card.title}
                </h3>
                {card.highlight && (
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    {card.highlight}
                  </p>
                )}
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {card.price}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">{card.unit}</span>
                </div>
                <ul className="space-y-3">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Every Installation
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              What's Included
            </h2>
            <ul className="space-y-4 text-left inline-block">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check size={18} className="text-foreground shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Additional Networking Services */}
      <section className="section-padding bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mb-12"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Beyond Cabling
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Additional Networking Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service, i) => (
              <motion.div
                key={service.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-start gap-5 p-6 border border-border hover:bg-secondary transition-colors"
              >
                <service.icon size={28} className="text-foreground shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-black">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Your Network Sorted?
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-10 leading-relaxed">
              Get in touch for a site survey and detailed quote. We'll scope the job, agree on a price, and get it done right.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
            >
              Get a Quote <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Networking;
