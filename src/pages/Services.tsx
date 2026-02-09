import { motion } from "framer-motion";
import { Shield, Server, Camera, Network, HardDrive, Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import cctvImage from "@/assets/cctv-security.jpg";
import { fadeUp } from "@/lib/animations";

const services = [
  {
    icon: Server,
    title: "NOC / SOC Operations",
    desc: "Our Network and Security Operations Centres provide round-the-clock monitoring, alerting, and incident response. We use industry-leading tools to detect anomalies before they become threats.",
    features: ["24/7 real-time monitoring", "Automated alert escalation", "Monthly performance reports", "SLA-backed response times"],
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    desc: "Comprehensive security services including vulnerability assessments, penetration testing, firewall management, endpoint protection, and security awareness training for your staff.",
    features: ["Vulnerability scanning", "Penetration testing", "Endpoint detection & response", "Security awareness training"],
  },
  {
    icon: HardDrive,
    title: "Backups & Disaster Recovery",
    desc: "Automated, encrypted backups with tested disaster recovery plans. We ensure your data is always recoverable, whether from hardware failure, ransomware, or natural disaster.",
    features: ["Automated daily backups", "Off-site replication", "Recovery testing", "Ransomware protection"],
  },
  {
    icon: Network,
    title: "Networking",
    desc: "Enterprise-grade network infrastructure — from initial design through deployment and ongoing management. We handle LAN, WAN, Wi-Fi, VPN, and SD-WAN solutions.",
    features: ["Network design & audit", "Wi-Fi & LAN deployment", "VPN & SD-WAN", "Performance optimisation"],
  },
  {
    icon: Camera,
    title: "CCTV & Biometrics",
    desc: "Professional surveillance and access control systems. From site survey through installation to remote monitoring, we deliver end-to-end physical security solutions.",
    features: ["IP camera systems", "Biometric access control", "Remote monitoring", "Maintenance & support"],
  },
  {
    icon: Lock,
    title: "Server Rooms & Hardware",
    desc: "Purpose-built server room installations with proper cooling, power management, and cable infrastructure. We also handle hardware procurement and lifecycle management.",
    features: ["Server room design & build", "Cooling & power systems", "Hardware procurement", "Lifecycle management"],
  },
];

const Services = () => {
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
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary-foreground/50 mb-4">Services</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              End-to-End IT Security & Infrastructure
            </h1>
            <p className="text-lg text-primary-foreground/60 leading-relaxed">
              From monitoring to hardware — we cover every layer of your IT stack with managed services built for reliability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding bg-background">
        <div className="container space-y-24">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            >
              <div>
                <service.icon size={36} className="text-foreground mb-5" strokeWidth={1.5} />
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                >
                  Request a quote <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              <div className="bg-secondary p-8">
                <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">Key Features</h4>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-foreground">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full shrink-0" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image break */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={cctvImage} alt="CCTV surveillance systems" className="w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 hero-gradient flex items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Physical + Digital</h2>
            <p className="text-primary-foreground/60 max-w-md mx-auto">Complete coverage — from your server room to your front door.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container text-center">
          <h2 className="font-display text-4xl font-bold text-foreground mb-6">Need a Custom Solution?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            Every business is different. Let us design an IT security package tailored to your operations and budget.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
};

export default Services;
