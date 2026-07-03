export function DetailField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 text-sm last:border-0">
      <span className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-4 shrink-0" />}
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
