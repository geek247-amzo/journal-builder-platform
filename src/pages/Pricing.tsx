import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/animations";

const tiers = [
  {
    name: "Essential",
    price: "R2,500",
    period: "/month",
    desc: "Core IT monitoring and support for small businesses.",
    features: [
      "NOC monitoring (business hours)",
      "Email & phone support",
      "Monthly health reports",
      "Basic backup (50GB)",
      "Patch management",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "R5,500",
    period: "/month",
    desc: "Full-stack security for growing businesses.",
    features: [
      "24/7 NOC/SOC monitoring",
      "Endpoint protection (up to 50)",
      "Automated backups (500GB)",
      "Firewall management",
      "Vulnerability scanning",
      "Priority support (4hr SLA)",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored solutions for complex IT environments.",
    features: [
      "Dedicated security analyst",
      "Unlimited endpoints",
      "Disaster recovery planning",
      "CCTV & biometrics integration",
      "Compliance reporting (POPIA)",
      "1hr SLA with on-site support",
    ],
    popular: false,
  },
];

const addons = [
  { name: "CCTV Monitoring", price: "R800/mo" },
  { name: "Additional Backup (per 100GB)", price: "R350/mo" },
  { name: "Security Awareness Training", price: "R1,200/mo" },
  { name: "Hardware Procurement (per device)", price: "Quote-based" },
];

const Pricing = () => {
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
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-4">Pricing</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Predictable, Fixed-Rate IT Security
            </h1>
            <p className="text-lg text-primary-foreground/60 leading-relaxed">
              No surprises. Choose a plan that fits your business, or let us build a custom package.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`p-8 border flex flex-col ${
                  tier.popular
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                {tier.popular && (
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/60 mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-display text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className={tier.popular ? "text-primary-foreground/50 text-sm" : "text-muted-foreground text-sm"}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed mb-8 ${tier.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {tier.desc}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={`shrink-0 mt-0.5 ${tier.popular ? "text-primary-foreground/70" : "text-foreground"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`w-full text-center py-3.5 text-sm font-semibold tracking-wide transition-colors ${
                    tier.popular
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {tier.price === "Custom" ? "Request a Quote" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-12">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">Enhance Your Plan</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Add-Ons</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map((addon, i) => (
              <motion.div
                key={addon.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center justify-between p-6 bg-background border border-border"
              >
                <span className="font-medium text-foreground">{addon.name}</span>
                <span className="text-sm text-muted-foreground font-mono">{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-6">Not Sure Which Plan?</h2>
          <p className="text-primary-foreground/60 max-w-md mx-auto mb-10">
            Our team will assess your needs and recommend the right package — no obligation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-10 py-4 text-sm font-semibold tracking-wide hover:bg-primary-foreground/90 transition-colors"
          >
            Talk to Our Team <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Pricing;
