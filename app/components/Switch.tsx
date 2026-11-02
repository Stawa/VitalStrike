export function Switch({
  checked,
  onChange,
  labelledBy,
}: Readonly<{ checked: boolean; onChange: (value: boolean) => void; labelledBy: string }>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        checked ? "bg-primary-600" : "bg-raised ring-1 ring-inset ring-border"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
