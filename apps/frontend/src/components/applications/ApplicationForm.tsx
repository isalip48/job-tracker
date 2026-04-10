// components/applications/ApplicationForm.tsx
//
// Modal form for creating and editing applications.
// Controlled by Zustand (isFormOpen, editingId).

"use client";

import { useEffect, useState } from "react";
import { Status } from "@prisma/client";
import { useApplicationStore } from "@/store/useApplicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "WISHLIST",     label: "Wishlist" },
  { value: "APPLIED",      label: "Applied" },
  { value: "PHONE_SCREEN", label: "Phone Screen" },
  { value: "INTERVIEW",    label: "Interview" },
  { value: "OFFER",        label: "Offer" },
  { value: "REJECTED",     label: "Rejected" },
  { value: "GHOSTED",      label: "Ghosted" },
];

export function ApplicationForm() {
  const { isFormOpen, editingId, closeForm, applications, addApplication, updateApplication } =
    useApplicationStore();

  const isEditing = editingId !== null;
  const existing = applications.find((a) => a.id === editingId);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "APPLIED" as Status,
    appliedDate: new Date().toISOString().split("T")[0],
    salary: "",
    location: "",
    jobUrl: "",
    notes: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && existing) {
      setForm({
        company: existing.company,
        role: existing.role,
        status: existing.status,
        appliedDate: new Date(existing.appliedDate).toISOString().split("T")[0],
        salary: existing.salary ?? "",
        location: existing.location ?? "",
        jobUrl: existing.jobUrl ?? "",
        notes: existing.notes ?? "",
      });
    } else {
      setForm({
        company: "",
        role: "",
        status: "APPLIED",
        appliedDate: new Date().toISOString().split("T")[0],
        salary: "",
        location: "",
        jobUrl: "",
        notes: "",
      });
    }
    setErrors({});
  }, [editingId, isFormOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload = {
      ...form,
      appliedDate: new Date(form.appliedDate).toISOString(),
    };

    try {
      const url = isEditing
        ? `/api/applications/${editingId}`
        : "/api/applications";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.issues) {
          setErrors(data.issues);
        }
        return;
      }

      if (isEditing) {
        updateApplication(data.id, data);
      } else {
        addApplication(data);
      }

      closeForm();
    } finally {
      setIsLoading(false);
    }
  };

  const field = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Application" : "Add Application"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company */}
          <div className="space-y-1">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" {...field("company")} placeholder="Acme Corp" />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company[0]}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label htmlFor="role">Role *</Label>
            <Input id="role" {...field("role")} placeholder="Software Engineer" />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role[0]}</p>
            )}
          </div>

          {/* Status + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Status }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="appliedDate">Applied Date *</Label>
              <Input id="appliedDate" type="date" {...field("appliedDate")} />
            </div>
          </div>

          {/* Salary + Location row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="salary">Salary (optional)</Label>
              <Input id="salary" {...field("salary")} placeholder="$80k–$100k" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location">Location (optional)</Label>
              <Input id="location" {...field("location")} placeholder="Remote" />
            </div>
          </div>

          {/* Job URL */}
          <div className="space-y-1">
            <Label htmlFor="jobUrl">Job URL (optional)</Label>
            <Input
              id="jobUrl"
              {...field("jobUrl")}
              placeholder="https://linkedin.com/jobs/..."
            />
            {errors.jobUrl && (
              <p className="text-xs text-destructive">{errors.jobUrl[0]}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              {...field("notes")}
              placeholder="Recruiter name, interview details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}