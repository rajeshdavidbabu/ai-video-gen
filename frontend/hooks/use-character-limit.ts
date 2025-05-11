"use client";

import { type ChangeEvent, useState } from "react";

interface UseCharacterLimitProps {
  maxLength: number;
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function useCharacterLimit({
  maxLength,
  initialValue = "",
  onChange,
}: UseCharacterLimitProps) {
  const [value, setValue] = useState(initialValue);
  const characterCount = value.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
  };
}
