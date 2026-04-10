// store/useApplicationStore.ts
//
// Zustand manages two things here:
//   1. UI state — which modal is open, active filters
//   2. Optimistic application list — so the UI updates instantly
//      before the API call completes (feels snappy)

import { create } from "zustand";
import { Application, Status } from "@prisma/client";

// The full Application type from Prisma, but we won't always have
// reminders loaded — make it optional for list views
export type ApplicationWithReminders = Application & {
  reminders?: { id: string; message: string; remindAt: Date; done: boolean }[];
};

interface ApplicationStore {
  // ── Data ───────────────────────────────────────────────────────
  applications: ApplicationWithReminders[];
  setApplications: (apps: ApplicationWithReminders[]) => void;
  addApplication: (app: ApplicationWithReminders) => void;
  updateApplication: (id: string, data: Partial<Application>) => void;
  removeApplication: (id: string) => void;

  // ── Modal state ────────────────────────────────────────────────
  isFormOpen: boolean;
  editingId: string | null; // null = creating new, string = editing existing
  openCreateForm: () => void;
  openEditForm: (id: string) => void;
  closeForm: () => void;

  // ── Filters ────────────────────────────────────────────────────
  filterStatus: Status | "ALL";
  searchQuery: string;
  setFilterStatus: (status: Status | "ALL") => void;
  setSearchQuery: (q: string) => void;
}

export const useApplicationStore = create<ApplicationStore>((set) => ({
  // ── Data ───────────────────────────────────────────────────────
  applications: [],

  setApplications: (apps) => set({ applications: apps }),

  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  updateApplication: (id, data) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),

  removeApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    })),

  // ── Modal state ────────────────────────────────────────────────
  isFormOpen: false,
  editingId: null,
  openCreateForm: () => set({ isFormOpen: true, editingId: null }),
  openEditForm: (id) => set({ isFormOpen: true, editingId: id }),
  closeForm: () => set({ isFormOpen: false, editingId: null }),

  // ── Filters ────────────────────────────────────────────────────
  filterStatus: "ALL",
  searchQuery: "",
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));