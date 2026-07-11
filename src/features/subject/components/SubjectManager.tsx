"use client";

import { PageTitle } from "../../../components/rpg/PageTitle";
import { SubjectForm } from "./SubjectForm";
import { SubjectList } from "./SubjectList";

export function SubjectManager() {
  return (
    <section className="flex flex-col gap-6">
      <PageTitle>Subjects</PageTitle>
      <SubjectForm />
      <SubjectList />
    </section>
  );
}
