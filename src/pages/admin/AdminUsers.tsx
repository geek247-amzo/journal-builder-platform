import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus } from "lucide-react";
import { fetchUsers, type Profile } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchUsers()
      .then((data) => {
        if (!active) return;
        setUsers(data);
      })
      .catch(() => {
        if (!active) return;
        setUsers([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((u) => {
      const name = (u.name ?? u.email ?? "").toLowerCase();
      const company = (u.company ?? "").toLowerCase();
      return name.includes(term) || company.includes(term);
    });
  }, [search, users]);

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">User Management</h2>
          <p className="text-sm text-muted-foreground">{users.length} registered clients</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus size={16} /> Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>
                Client creation is handled via Supabase Auth. Invite or create a user in the Supabase dashboard, then assign their role in the profiles table.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>To add a client:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create the user in Supabase Auth.</li>
                <li>Confirm a profile row exists in the <code>profiles</code> table.</li>
                <li>Set <code>role</code> to <code>client</code> (or <code>admin</code>).</li>
              </ol>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
        <div className="relative w-full sm:w-72 mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="hidden sm:table-cell">Devices</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">
                      Loading users…
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">
                      No users yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{u.name ?? u.email}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{u.company ?? "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{u.company ?? "—"}</TableCell>
                      <TableCell><Badge variant="outline">{u.role ?? "Client"}</Badge></TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">—</TableCell>
                      <TableCell>
                        <Badge className={u.status === "Active" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}>
                          {u.status ?? "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
