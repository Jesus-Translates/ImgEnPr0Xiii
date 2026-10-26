// components/PromptEditor.tsx
import { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PromptEditor({ value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  return (
    <textarea
      className="w-full h-32 p-2 border rounded focus:outline-none focus:ring"
      placeholder="Enter your prompt..."
      value={value}
      onChange={handleChange}
    />
  );
}
