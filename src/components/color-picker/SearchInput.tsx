interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search colors..."
      className="w-full p-2 border rounded mb-4"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}