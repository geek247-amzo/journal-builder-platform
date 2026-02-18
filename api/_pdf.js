import PDFDocument from "pdfkit";

export const formatCurrency = (value, currency) => {
  const number = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency ?? "ZAR",
      maximumFractionDigits: 0,
    }).format(number);
  } catch {
    return `${currency ?? "ZAR"} ${number.toFixed(0)}`;
  }
};

export const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split("\n").map((line) => line.trim()).filter(Boolean);
  return [];
};

export const buildPdf = ({ quote, items, acceptUrl, slaUrl, logoDark, logoLight }) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 80, left: 40, right: 40, bottom: 50 },
      bufferPages: true,
    });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const currency = quote.currency ?? "ZAR";
    const assumptions = normalizeList(quote.assumptions);
    const terms = normalizeList(quote.terms);
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const bodyTextColor = "#333";
    const bodyFontSize = 10;
    const subheadingFontSize = 10;
    const contentBottomY = () => doc.page.height - doc.page.margins.bottom - 24;
    const setBodyStyle = () => doc.font("Helvetica").fontSize(bodyFontSize).fillColor(bodyTextColor);
    const ensureSpace = (requiredHeight = 24) => {
      if (doc.y + requiredHeight > contentBottomY()) {
        doc.addPage();
      }
    };

    const sectionTitle = (text) => {
      ensureSpace(30);
      doc.moveDown(0.9);
      const y = doc.y;
      doc.rect(doc.page.margins.left, y + 2, 4, 12).fill("#111");
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111")
        .text(text.toUpperCase(), doc.page.margins.left + 10, y);
      doc.moveDown(0.35);
      setBodyStyle();
    };

    const drawHeaderFooter = (pageIndex, totalPages) => {
      if (pageIndex === 0) return;
      const topY = 28;
      if (logoLight) {
        try {
          doc.image(logoLight, doc.page.margins.left, topY, { width: 90 });
        } catch {
          // ignore logo render errors
        }
      }
      doc
        .strokeColor("#e5e5e5")
        .lineWidth(1)
        .moveTo(doc.page.margins.left, 60)
        .lineTo(doc.page.width - doc.page.margins.right, 60)
        .stroke();

      const footerTextY = doc.page.height - doc.page.margins.bottom - 10;
      doc
        .strokeColor("#e5e5e5")
        .lineWidth(1)
        .moveTo(doc.page.margins.left, footerTextY - 4)
        .lineTo(doc.page.width - doc.page.margins.right, footerTextY - 4)
        .stroke();
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#666")
        .text(
          `Page ${pageIndex} of ${Math.max(totalPages - 1, 1)}`,
          doc.page.width - doc.page.margins.right - 90,
          footerTextY,
          {
            width: 90,
            align: "right",
            lineBreak: false,
          }
        );
    };

    const drawSimpleList = (lines) => {
      lines.forEach((line) => {
        ensureSpace(16);
        doc.text(`• ${line}`, { width: pageWidth });
      });
    };
    const firstDefinedString = (...values) => {
      for (const value of values) {
        if (value === null || value === undefined) continue;
        const text = String(value).trim();
        if (text) return text;
      }
      return "";
    };
    const isServiceQuote = () => {
      const quoteName = String(quote.name ?? "").toLowerCase();
      if (quoteName.includes("service quote")) return true;
      if (!items?.length) return false;
      return items.every((item) => {
        const hasSlaTier = Boolean(item?.sla_tier);
        const hasKpis = Array.isArray(item?.kpi_tags) && item.kpi_tags.length > 0;
        return !hasSlaTier && !hasKpis;
      });
    };
    const drawSimplePageNumbers = () => {
      const pages = doc.bufferedPageRange();
      for (let page = pages.start; page < pages.start + pages.count; page += 1) {
        doc.switchToPage(page);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#666")
          .text(`Page ${page + 1} of ${pages.count}`, doc.page.width - doc.page.margins.right - 90, doc.page.height - 36, {
            width: 90,
            align: "right",
            lineBreak: false,
          });
      }
    };
    const drawServiceQuotePdf = () => {
      const tableColX = [40, 180, 410, 450, 510];
      const tableColW = [140, 230, 40, 60, 45];
      const rowH = 18;
      const serviceBottomY = () => doc.page.height - doc.page.margins.bottom - 28;
      const drawServiceHeader = () => {
        if (logoLight || logoDark) {
          try {
            doc.image(logoLight ?? logoDark, 40, 35, { width: 120 });
          } catch {
            // ignore logo render failures
          }
        }
        doc.font("Helvetica-Bold").fontSize(18).fillColor("#111").text("Quotation", 40, 55, { align: "right" });
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#333")
          .text(`Quote #: ${quote.public_id ?? ""}`, 40, 78, { align: "right" });
        doc.text(`Date: ${new Date().toLocaleDateString("en-ZA")}`, 40, 93, { align: "right" });
        doc.moveTo(40, 112).lineTo(doc.page.width - 40, 112).strokeColor("#e5e5e5").stroke();
        doc.y = 126;
      };
      const addServicePage = () => {
        doc.addPage();
        drawServiceHeader();
      };
      const ensureServiceSpace = (requiredHeight = 24) => {
        if (doc.y + requiredHeight > serviceBottomY()) {
          addServicePage();
        }
      };
      const drawServiceTableHeader = () => {
        ensureServiceSpace(rowH + 8);
        const top = doc.y;
        doc.rect(40, top, 515, rowH).fill("#f3f4f6");
        doc.font("Helvetica-Bold").fontSize(9).fillColor("#222");
        doc.text("Item", tableColX[0] + 4, top + 5, { width: tableColW[0] - 8, lineBreak: false });
        doc.text("Description", tableColX[1] + 4, top + 5, { width: tableColW[1] - 8, lineBreak: false });
        doc.text("Qty", tableColX[2], top + 5, { width: tableColW[2], align: "right", lineBreak: false });
        doc.text("Unit", tableColX[3], top + 5, { width: tableColW[3], align: "right", lineBreak: false });
        doc.text("Total", tableColX[4], top + 5, { width: tableColW[4], align: "right", lineBreak: false });
        doc.y = top + rowH;
      };

      drawServiceHeader();
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text("Client Information", { width: pageWidth });
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(10).fillColor("#333");
      doc.text(`Client: ${firstDefinedString(quote.customer) || "—"}`, { width: pageWidth });
      const primaryContact = firstDefinedString(quote.contact_name, quote.contactName);
      if (primaryContact) doc.text(`Primary Contact: ${primaryContact}`, { width: pageWidth });
      const contactEmail = firstDefinedString(quote.contact_email, quote.contactEmail);
      if (contactEmail) doc.text(`Email: ${contactEmail}`, { width: pageWidth });
      const expiresAt = firstDefinedString(quote.expires_at, quote.expiresAt);
      if (expiresAt) doc.text(`Valid Until: ${expiresAt}`, { width: pageWidth });
      const regionValue = firstDefinedString(quote.region);
      if (regionValue) doc.text(`Region: ${regionValue}`, { width: pageWidth });

      if (assumptions.length) {
        ensureServiceSpace(40);
        doc.moveDown(0.8);
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text("Scope / Notes", { width: pageWidth });
        doc.moveDown(0.25);
        doc.font("Helvetica").fontSize(10).fillColor("#333");
        assumptions.forEach((line) => {
          ensureServiceSpace(16);
          doc.text(`• ${line}`, { width: pageWidth });
        });
      }

      ensureServiceSpace(46);
      doc.moveDown(0.8);
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text("Quoted Services", { width: pageWidth });
      doc.moveDown(0.25);
      drawServiceTableHeader();

      if (!items?.length) {
        ensureServiceSpace(rowH + 8);
        doc.rect(40, doc.y, 515, rowH).fill("#fafafa");
        doc.font("Helvetica").fontSize(10).fillColor("#333").text("No line items added.", 44, doc.y + 5, { width: 507 });
        doc.y += rowH + 4;
      } else {
        items.forEach((item, index) => {
          if (doc.y + rowH > serviceBottomY()) {
            addServicePage();
            drawServiceTableHeader();
          }
          if (index % 2 === 1) {
            doc.rect(40, doc.y, 515, rowH).fill("#fafafa");
          }
          const rowY = doc.y;
          const itemTotal = Number(item.unit_price ?? 0) * Number(item.quantity ?? 0);
          const description = firstDefinedString(item.description);
          doc.font("Helvetica").fontSize(9).fillColor("#222");
          doc.text(firstDefinedString(item.name) || "Service", tableColX[0] + 4, rowY + 5, {
            width: tableColW[0] - 8,
            ellipsis: true,
            lineBreak: false,
          });
          doc.text(description || "—", tableColX[1] + 4, rowY + 5, {
            width: tableColW[1] - 8,
            ellipsis: true,
            lineBreak: false,
          });
          doc.text(String(item.quantity ?? 0), tableColX[2], rowY + 5, { width: tableColW[2], align: "right", lineBreak: false });
          doc.text(formatCurrency(item.unit_price ?? 0, currency), tableColX[3], rowY + 5, {
            width: tableColW[3],
            align: "right",
            lineBreak: false,
          });
          doc.text(formatCurrency(itemTotal, currency), tableColX[4], rowY + 5, {
            width: tableColW[4],
            align: "right",
            lineBreak: false,
          });
          doc.y += rowH;
        });
      }

      ensureServiceSpace(62);
      doc.moveDown(0.5);
      doc.strokeColor("#e5e5e5").moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111");
      doc.text(`Total: ${formatCurrency(quote.total ?? 0, currency)} (Excl. VAT)`, 40, doc.y, { align: "right" });

      if (terms.length) {
        ensureServiceSpace(28);
        doc.moveDown(0.9);
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text("Terms", { width: pageWidth });
        doc.moveDown(0.25);
        doc.font("Helvetica").fontSize(10).fillColor("#333");
        terms.forEach((line) => {
          ensureServiceSpace(16);
          doc.text(`• ${line}`, { width: pageWidth });
        });
      }

      ensureServiceSpace(22);
      doc.moveDown(1);
      doc.font("Helvetica").fontSize(9).fillColor("#666").text("Prepared by Continuate IT Services", { width: pageWidth });

      drawSimplePageNumbers();
    };

    const drawPricingHeader = (tableY, colX, colW, rowH) => {
      doc.rect(40, tableY, 515, rowH).fill("#f3f4f6");
      doc.font("Helvetica-Bold").fontSize(bodyFontSize).fillColor("#333");
      doc.text("Service Component", colX[0], tableY + 5, { width: colW[0] });
      doc.text("Users", colX[1], tableY + 5, { width: colW[1], align: "right" });
      doc.text("Unit", colX[2], tableY + 5, { width: colW[2], align: "right" });
      doc.text("Monthly Total", colX[3], tableY + 5, {
        width: colW[3],
        align: "right",
        lineBreak: false,
      });
      setBodyStyle();
    };

    if (isServiceQuote()) {
      drawServiceQuotePdf();
      doc.end();
      return;
    }

    // Cover (premium, minimal)
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#111");
    if (logoDark) {
      try {
        doc.image(logoDark, 40, 40, { width: 180 });
      } catch {
        // ignore
      }
    }
    doc.fillColor("#fff");
    doc.font("Helvetica").fontSize(12).text("Managed Security Services Proposal", 40, 140);
    doc.font("Helvetica-Bold").fontSize(28).text(quote.customer ?? "Client", 40, 165);
    doc.moveTo(40, 210).lineTo(260, 210).lineWidth(2).strokeColor("#fff").stroke();
    doc.font("Helvetica").fontSize(11).text("Prepared by: Continuate IT Services (Pty) Ltd.", 40, 235);
    doc.text(`Proposal Reference: ${quote.public_id}`, 40, 255);
    doc.text(`Date: ${new Date().toLocaleDateString("en-ZA")}`, 40, 275);
    doc.text("Confidential & Proprietary", 40, 310);

    doc.addPage();
    setBodyStyle();

    sectionTitle("Executive Overview");
    doc.text(
      "In today’s evolving threat landscape, financial institutions are primary targets for increasingly sophisticated cyber attacks.",
      { width: pageWidth }
    );
    doc.moveDown(0.5);
    doc.text(
      "Continuate IT Services proposes a fully managed, 24/7 security operations framework designed to reduce cyber risk exposure, ensure regulatory alignment, protect business continuity, and deliver measurable security maturity improvement.",
      { width: pageWidth }
    );
    doc.moveDown(0.4);
    doc.text(
      `Our Managed Security Services provide enterprise-grade protection tailored specifically to the operational requirements of ${
        quote.customer ?? "your organization"
      }.`,
      { width: pageWidth }
    );

    sectionTitle("Why Continuate IT Services");
    drawSimpleList([
      "24/7 Security Operations Monitoring",
      "Financial Sector Threat Awareness",
      "Proactive Threat Hunting",
      "Compliance-Driven Security Framework",
      "Dedicated Account Management",
      "Transparent, Predictable Pricing",
    ]);

    sectionTitle("Client Overview");
    const overviewLines = [
      ["Client Organization", firstDefinedString(quote.customer)],
      ["Primary Contact", firstDefinedString(quote.contact_name, quote.contactName)],
      ["Industry", firstDefinedString(quote.industry)],
    ].filter(([, value]) => value);
    overviewLines.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, { width: pageWidth });
    });

    const envSummaryLines = [
      ["Number of Users", firstDefinedString(quote.number_of_users, quote.numberOfUsers)],
      ["Number of Endpoints", firstDefinedString(quote.number_of_endpoints, quote.numberOfEndpoints)],
      ["Servers (On-Prem / Cloud)", firstDefinedString(quote.servers, quote.servers_on_prem_cloud, quote.serversOnPremCloud)],
      ["Cloud Platforms", firstDefinedString(quote.cloud_platforms, quote.cloudPlatforms)],
      ["Compliance Requirements", firstDefinedString(quote.compliance_requirements, quote.complianceRequirements)],
    ].filter(([, value]) => value);
    if (envSummaryLines.length) {
      doc.moveDown(0.2);
      doc.text("Current Environment Summary:", { width: pageWidth });
      envSummaryLines.forEach(([label, value]) => {
        ensureSpace(16);
        doc.text(`• ${label}: ${value}`, { width: pageWidth });
      });
    }

    sectionTitle("Scope of Services");
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Core Security Operations", { width: pageWidth });
    setBodyStyle();
    drawSimpleList([
      "Security Monitoring (24/7 SOC): Continuous real-time monitoring of your environment.",
      "Managed EDR / XDR: Advanced endpoint threat detection and automated containment.",
      "SIEM & Log Management: Centralized event correlation and anomaly detection.",
      "Firewall & Network Security Management: Policy control, rule audits, and traffic monitoring.",
      "Incident Response Management: Coordinated containment, remediation, and reporting.",
      "Vulnerability & Patch Oversight: Risk-based remediation planning.",
    ]);

    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Optional Enhancements", { width: pageWidth });
    setBodyStyle();
    drawSimpleList([
      "Managed Email Security",
      "Dark Web Monitoring",
      "Security Awareness Training",
      "Compliance Reporting & Audit Support",
      "Penetration Testing",
      "Cloud Security Posture Management",
      "Backup & Disaster Recovery",
    ]);

    sectionTitle("Service Levels");
    doc.text(
      "Our Service Level commitments are aligned to business risk impact and operational continuity requirements.",
      { width: pageWidth }
    );
    doc.moveDown(0.4);
    const svcColX = [40, 170, 340];
    const svcColW = [130, 170, 215];
    const svcRowH = 18;
    const svcRows = [
      ["Critical", "< 1 Hour", "4–8 Hours"],
      ["High", "< 4 Hours", "24 Hours"],
      ["Medium", "< 8 Hours", "2–3 Business Days"],
      ["Low", "1 Business Day", "Scheduled"],
    ];
    ensureSpace(svcRowH * (svcRows.length + 2));
    const svcTableTop = doc.y;
    doc.rect(40, svcTableTop, 515, svcRowH).fill("#f3f4f6");
    doc.font("Helvetica-Bold").fontSize(bodyFontSize).fillColor("#333");
    doc.text("Priority", svcColX[0], svcTableTop + 5, { width: svcColW[0] });
    doc.text("Response Time", svcColX[1], svcTableTop + 5, { width: svcColW[1] });
    doc.text("Resolution Target", svcColX[2], svcTableTop + 5, { width: svcColW[2] });
    svcRows.forEach((row, index) => {
      const rowY = svcTableTop + svcRowH * (index + 1);
      if (index % 2 === 1) {
        doc.rect(40, rowY, 515, svcRowH).fill("#fafafa");
      }
      setBodyStyle();
      doc.text(row[0], svcColX[0], rowY + 5, { width: svcColW[0] });
      doc.text(row[1], svcColX[1], rowY + 5, { width: svcColW[1] });
      doc.text(row[2], svcColX[2], rowY + 5, { width: svcColW[2] });
    });
    doc.y = svcTableTop + svcRowH * (svcRows.length + 1) + 8;

    sectionTitle("Implementation Plan");
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Phase 1 – Assessment & Discovery", { width: pageWidth });
    setBodyStyle();
    drawSimpleList(["Environment review", "Risk analysis", "Security gap identification"]);
    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Phase 2 – Deployment", { width: pageWidth });
    setBodyStyle();
    drawSimpleList(["Agent installation", "Firewall integration", "Log ingestion configuration", "Baseline security hardening"]);
    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Phase 3 – Monitoring & Optimization", { width: pageWidth });
    setBodyStyle();
    drawSimpleList(["Continuous monitoring", "Monthly security reporting", "Quarterly strategy review"]);
    doc.moveDown(0.3);
    doc.text("Estimated Implementation Timeline: 2–6 Weeks", { width: pageWidth });

    sectionTitle("Reporting & Communication");
    drawSimpleList([
      "Monthly Security Summary Report",
      "Incident Reports (as required)",
      "Quarterly Security Review Meeting",
      "Dedicated Account Manager",
      "24/7 Emergency Contact",
    ]);

    sectionTitle("Pricing Structure");
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111").text("Investment Summary", { width: pageWidth });
    setBodyStyle();
    doc.text("Monthly Managed Security Investment", { width: pageWidth });
    doc.moveDown(0.2);
    const colX = [40, 260, 330, 410];
    const colW = [220, 70, 80, 145];
    const rowH = 18;
    ensureSpace(rowH * 3);
    let tableTop = doc.y;
    drawPricingHeader(tableTop, colX, colW, rowH);

    let rowIndex = 0;
    let rowY = tableTop + rowH;
    if (!items?.length) {
      if (rowY + rowH > contentBottomY()) {
        doc.addPage();
        tableTop = doc.y;
        drawPricingHeader(tableTop, colX, colW, rowH);
        rowY = tableTop + rowH;
      }
      doc.rect(40, rowY, 515, rowH).fill("#fafafa");
      setBodyStyle();
      doc.fillColor("#111").text("No line items added.", 44, rowY + 5, { width: 507 });
      doc.y = rowY + rowH + 8;
    } else {
      items.forEach((item) => {
        if (rowY + rowH > contentBottomY()) {
          doc.addPage();
          tableTop = doc.y;
          drawPricingHeader(tableTop, colX, colW, rowH);
          rowY = tableTop + rowH;
        }
        if (rowIndex % 2 === 1) {
          doc.rect(40, rowY, 515, rowH).fill("#fafafa");
        }
        const total = Number(item.unit_price ?? 0) * Number(item.quantity ?? 0);
        setBodyStyle();
        doc.fillColor("#111").text(item.name ?? "Service", colX[0] + 4, rowY + 5, { width: colW[0] - 8, ellipsis: true });
        doc.text(String(item.quantity ?? 0), colX[1], rowY + 5, { width: colW[1], align: "right" });
        doc.text(formatCurrency(item.unit_price ?? 0, currency), colX[2], rowY + 5, {
          width: colW[2],
          align: "right",
        });
        doc.text(formatCurrency(total, currency), colX[3], rowY + 5, { width: colW[3], align: "right" });
        rowY += rowH;
        rowIndex += 1;
      });
      doc.y = rowY + 8;
    }

    doc.moveDown(0.3);
    doc.strokeColor("#eee").moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(subheadingFontSize).fillColor("#111");
    doc.text("Total Monthly Investment", 40, doc.y, { continued: true });
    doc.text(` ${formatCurrency(quote.total ?? 0, currency)} (Excl. VAT)`);
    doc.moveDown(0.4);
    setBodyStyle();
    doc.fillColor("#555");
    doc.text("One-Time Setup Fee: Included", { width: pageWidth });
    doc.text("Implementation Timeline: 2–6 Weeks", { width: pageWidth });
    doc.moveDown(0.4);
    doc.text(
      "This investment provides enterprise-grade 24/7 protection, proactive risk management, and compliance-aligned security operations.",
      { width: pageWidth }
    );

    doc.moveDown(0.6);
    doc.x = doc.page.margins.left;

    sectionTitle("Contract Terms");
    drawSimpleList([
      "Agreement Term: 12 / 24 / 36 Months",
      "Billing Frequency: Monthly",
      "Auto-Renewal: Yes / No",
      "Termination Clause: As per master services agreement",
    ]);

    sectionTitle("Assumptions & Exclusions");
    if (assumptions.length) {
      assumptions.forEach((a) => {
        ensureSpace(16);
        doc.text(`• ${a}`, { width: pageWidth });
      });
    } else {
      drawSimpleList([
        "Client provides required administrative access.",
        "Internet connectivity maintained at all monitored locations.",
        "Hardware upgrades not included unless specified.",
        "Third-party licensing costs not included unless stated.",
      ]);
    }

    sectionTitle("Governance & Compliance Alignment");
    drawSimpleList([
      "NIST Cybersecurity Framework",
      "ISO 27001 Controls",
      "CIS Benchmarks",
      "Applicable data protection standards",
    ]);

    sectionTitle("Coverage & Eligibility");
    doc.text(
      "All devices are covered as long as Continuate can connect to the device or environment remotely.",
      { width: pageWidth }
    );

    sectionTitle("Pricing Notes");
    drawSimpleList([
      "All prices are exclusive of VAT.",
      "No surprise charges: all inclusions and billable extras are defined upfront.",
      "Included service categories: Infrastructure Management, Remote Monitoring & Management, Maintenance, End-user Support.",
      "Additional services are quoted and approved before work begins.",
    ]);

    sectionTitle("Agreement & Acceptance");
    ensureSpace(130);
    const accTop = doc.y;
    const accColX = [40, 300];
    doc.text("For Client", accColX[0], accTop);
    doc.text("For Continuate IT Services", accColX[1], accTop);
    doc.moveDown(0.6);
    doc.text("Name: ____________________________", accColX[0], doc.y);
    doc.text("Name: ____________________________", accColX[1], doc.y);
    doc.moveDown(0.6);
    doc.text("Title: ____________________________", accColX[0], doc.y);
    doc.text("Title: ____________________________", accColX[1], doc.y);
    doc.moveDown(0.6);
    doc.text("Signature: ________________________", accColX[0], doc.y);
    doc.text("Signature: ________________________", accColX[1], doc.y);
    doc.moveDown(0.6);
    doc.text("Date: ____________", accColX[0], doc.y);
    doc.text("Date: ____________", accColX[1], doc.y);

    sectionTitle("Next Steps");
    doc.fillColor("#111");
    doc.text("To proceed with this proposal, please contact your Continuate account manager.");

    doc.moveDown(1.1);
    doc.font("Helvetica").fontSize(8).fillColor("#666");
    doc.text(`Continuate IT Services • ${new Date().toLocaleDateString("en-ZA")}`);

    const pages = doc.bufferedPageRange();
    for (let page = pages.start; page < pages.start + pages.count; page += 1) {
      doc.switchToPage(page);
      drawHeaderFooter(page, pages.count);
    }
    doc.end();
  });
