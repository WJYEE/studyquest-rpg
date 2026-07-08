"use client";

import { useState, type FormEvent } from "react";

import { Button } from "../../../components/Button";
import { useAppStore } from "../../../store/useAppStore";

export function SubjectForm() {
  const addSubject = useAppStore((state) => state.addSubject);
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    addSubject(trimmed);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Subject name"
        aria-label="Subject name"
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <Button type="submit" disabled={!name.trim()}>
        Add Subject
      </Button>
    </form>
  );
}
