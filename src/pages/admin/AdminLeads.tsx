import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { fetchLeads, type Lead } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchLeads();
        if (!active) return;
        setLeads(data);
      } catch {
        if (!active) return;
        setLeads([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <h2 className="font-display text-2xl font-bold text-foreground">Leads</h2>
        <p className="text-sm text-muted-foreground">Prospects generated from pricing estimates.</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden sm:table-cell">Devices</TableHead>
                <TableHead>Add-Ons</TableHead>
                <TableHead className="text-right">Estimate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    Loading leads...
                  </TableCell>
                </TableRow>
              )}
              {!loading && leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                    No leads yet.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{lead.name ?? lead.email}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {lead.company ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {lead.devices}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {lead.cybersecurity && <Badge variant="outline">Cybersecurity</Badge>}
                        {lead.backup && <Badge variant="outline">Backup</Badge>}
                        {!lead.cybersecurity && !lead.backup && <Badge variant="outline">Base Only</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatCurrency(lead.estimateLow, "ZAR")} – {formatCurrency(lead.estimateHigh, "ZAR")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeads;
