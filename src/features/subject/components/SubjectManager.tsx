"use client";

import { SubjectForm } from "./SubjectForm";
import { SubjectList } from "./SubjectList";

export function SubjectManager() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Subjects</h1>
      <SubjectForm />
      <SubjectList />
    </section>
  );
}
