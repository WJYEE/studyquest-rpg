"use client";

import { useState, type FormEvent } from "react";

import { Button } from "../../../components/Button";
import { inputClassName } from "../../../components/Input";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
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
    <WindowFrame as="form" variant="slot" onSubmit={handleSubmit} className="flex gap-2 p-2">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Subject name"
        aria-label="Subject name"
        className={inputClassName("flex-1")}
      />
      <Button type="submit" disabled={!name.trim()}>
        Add Subject
      </Button>
    </WindowFrame>
  );
}
