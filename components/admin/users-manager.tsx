"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createUserAction,
  deleteUserAction,
  updateUserRoleAction,
} from "@/app/(admin)/admin/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeRole, ROLE_LABEL, type Role } from "@/lib/rbac";

type Row = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string; // ISO — dates cross the server→client boundary as strings
};

const ROLE_OPTIONS: Role[] = ["admin", "staff"];

export function UsersManager({
  initialUsers,
  currentEmail,
}: {
  initialUsers: Row[];
  currentEmail: string;
}) {
  const [users, setUsers] = useState<Row[]>(initialUsers);

  // Add-user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("staff");
  const [creating, startCreate] = useTransition();

  // Per-row pending flags (role save / delete)
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startRow] = useTransition();

  function submitNew(e: React.FormEvent) {
    e.preventDefault();
    startCreate(async () => {
      const res = await createUserAction({ name, email, password, role: newRole });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      // The server has the canonical row (id, createdAt); optimistically add a
      // placeholder and let the values settle on next load.
      setUsers((prev) => [
        {
          id: `tmp-${Date.now()}`,
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role: newRole,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setName("");
      setEmail("");
      setPassword("");
      setNewRole("staff");
      toast.success("Pengguna ditambahkan");
    });
  }

  function changeRole(row: Row, next: Role) {
    if (next === row.role) return;
    const prevRole = row.role;
    setUsers((u) => u.map((x) => (x.id === row.id ? { ...x, role: next } : x)));
    setBusyId(row.id);
    startRow(async () => {
      const res = await updateUserRoleAction(row.id, next);
      setBusyId(null);
      if (res.error) {
        setUsers((u) =>
          u.map((x) => (x.id === row.id ? { ...x, role: prevRole } : x)),
        );
        toast.error(res.error);
        return;
      }
      toast.success(`Peran ${row.name} diubah ke "${ROLE_LABEL[next]}"`);
    });
  }

  function remove(row: Row) {
    if (!confirm(`Hapus pengguna "${row.name}" (${row.email})?`)) return;
    setBusyId(row.id);
    startRow(async () => {
      const res = await deleteUserAction(row.id);
      setBusyId(null);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setUsers((u) => u.filter((x) => x.id !== row.id));
      toast.success(`Pengguna "${row.name}" dihapus`);
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={submitNew}
        className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="u-name">Nama</Label>
          <Input
            id="u-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-email">Email</Label>
          <Input
            id="u-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-password">Kata Sandi</Label>
          <Input
            id="u-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min. 8 karakter"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="u-role">Peran</Label>
          <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
            <SelectTrigger id="u-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <Button type="submit" disabled={creating}>
            {creating ? "Menambahkan…" : "Tambah Pengguna"}
          </Button>
        </div>
      </form>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-40">Peran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((row) => {
              const isSelf = row.email === currentEmail;
              const busy = busyId === row.id;
              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">
                    {row.name}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                        Anda
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.email}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={normalizeRole(row.role)}
                      onValueChange={(v) => changeRole(row, v as Role)}
                      disabled={isSelf || busy}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isSelf || busy}
                      onClick={() => remove(row)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
