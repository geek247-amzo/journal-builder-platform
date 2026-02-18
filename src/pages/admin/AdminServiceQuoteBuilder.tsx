import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { fadeUp } from "@/lib/animations";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createQuote, downloadQuotePdf, sendQuote } from "@/lib/api";
import { FileText, Plus, Send, Trash2 } from "lucide-react";

type ServiceLineItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

const makeItemId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const makeEmptyItem = (): ServiceLineItem => ({
  id: makeItemId(),
  name: "",
  category: "Professional Services",
  description: "",
  unit: "per month",
  quantity: 1,
  unitPrice: 0,
});

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const AdminServiceQuoteBuilder = () => {
  const { toast } = useToast();
  const [quoteName, setQuoteName] = useState("Service Quote");
  const [customer, setCustomer] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [region, setRegion] = useState("");
  const [owner, setOwner] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [expiresAt, setExpiresAt] = useState("");
  const [scopeSummary, setScopeSummary] = useState("");
  const [assumptionsText, setAssumptionsText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [items, setItems] = useState<ServiceLineItem[]>([makeEmptyItem()]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0),
    [items],
  );

  const updateItem = (id: string, patch: Partial<ServiceLineItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const validItems = items
    .filter((item) => item.name.trim() && Number(item.quantity) > 0)
    .map((item) => ({
      name: item.name.trim(),
      category: item.category.trim() || "Services",
      description: item.description.trim() || undefined,
      unit: item.unit.trim() || undefined,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      slaTier: undefined,
      kpiTags: [],
    }));

  const assumptions = [scopeSummary.trim(), ...splitLines(assumptionsText)].filter(Boolean);
  const terms = splitLines(termsText);

  const createServiceQuote = async (status: "Draft" | "Sent") => {
    if (!customer.trim()) {
      throw new Error("Customer is required.");
    }
    if (!validItems.length) {
      throw new Error("Add at least one line item with a name and quantity.");
    }
    return createQuote({
      name: quoteName.trim() || "Service Quote",
      customer: customer.trim(),
      contactName: contactName.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      region: region.trim() || undefined,
      owner: owner.trim() || undefined,
      status,
      expiresAt: expiresAt || undefined,
      currency,
      assumptions,
      terms,
      items: validItems,
    });
  };

  const handleSaveDraft = async () => {
    try {
      const data = await createServiceQuote("Draft");
      toast({ title: "Service quote saved", description: `Quote ${data.id} created.` });
    } catch (error) {
      toast({
        title: "Unable to save quote",
        description: error instanceof Error ? error.message : "Quote creation failed.",
        variant: "destructive",
      });
    }
  };

  const handleSendQuote = async () => {
    try {
      const data = await createServiceQuote("Sent");
      await sendQuote(data.id);
      toast({ title: "Service quote sent", description: `Quote ${data.id} emailed to the client.` });
    } catch (error) {
      toast({
        title: "Unable to send quote",
        description: error instanceof Error ? error.message : "Sending failed.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const data = await createServiceQuote("Draft");
      await downloadQuotePdf(data.id);
      toast({ title: "PDF generated", description: `Quote ${data.id} downloaded.` });
    } catch (error) {
      toast({
        title: "Unable to generate PDF",
        description: error instanceof Error ? error.message : "PDF generation failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">Service Quotes</h2>
            <p className="text-sm text-muted-foreground">
              Build non-MSSP quotes with custom service line items, then save, send, or export as PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={handleGeneratePdf}>
              <FileText size={16} />
              Generate PDF
            </Button>
            <Button className="gap-2" onClick={handleSendQuote}>
              <Send size={16} />
              Send Quote
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quote-name">Quote Name</Label>
                  <Input id="quote-name" value={quoteName} onChange={(e) => setQuoteName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Client company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Primary Contact</Label>
                  <Input id="contact-name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@client.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires">Expires At</Label>
                  <Input id="expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">ZAR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Line Items</CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setItems((prev) => [...prev, makeEmptyItem()])}>
                  <Plus size={16} />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Service Name</Label>
                        <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} placeholder="Service or product" />
                      </div>
                      <div className="space-y-1">
                        <Label>Category</Label>
                        <Input value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value })} placeholder="Category" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} rows={2} />
                      </div>
                      <div className="space-y-1">
                        <Label>Unit</Label>
                        <Input value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value })} placeholder="per month / once-off / hourly" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Line Total: {formatCurrency(Number(item.quantity || 0) * Number(item.unitPrice || 0), currency)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() =>
                          setItems((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== item.id) : [makeEmptyItem()]))
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scope, Assumptions, and Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scope-summary">Scope Summary</Label>
                  <Textarea id="scope-summary" rows={3} value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assumptions">Assumptions (one per line)</Label>
                  <Textarea id="assumptions" rows={4} value={assumptionsText} onChange={(e) => setAssumptionsText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms (one per line)</Label>
                  <Textarea id="terms" rows={4} value={termsText} onChange={(e) => setTermsText(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quote Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Line Items</span>
                <span className="font-medium text-foreground">{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quote Currency</span>
                <span className="font-medium text-foreground">{currency}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Estimated Total</span>
                <span className="font-display text-xl font-bold text-foreground">{formatCurrency(total, currency)}</span>
              </div>
              <Button className="w-full" variant="outline" onClick={handleSaveDraft}>
                Save Draft Quote
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminServiceQuoteBuilder;
