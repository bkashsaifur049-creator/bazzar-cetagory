export function bnNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD").format(value);
}

export function getPriceChange(
  today: number,
  yesterday: number
) {
  if (!yesterday || today === yesterday) {
    return {
      value: 0,
      label: "— ০.০%",
      type: "flat",
    };
  }

  const change =
    ((today - yesterday) / yesterday) * 100;

  return {
    value: change,
    label: `${change > 0 ? "▲" : "▼"} ${bnNumber(
      Math.abs(Number(change.toFixed(1)))
    )}%`,
    type: change > 0 ? "up" : "down",
  };
}

export function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}