// Example: 1260500 => "1,260,500"
export function formatWithCommas(number: number): string {
  return number.toLocaleString();
}

// Example: 1500 => "1.5 K", 1260500 => "1.26 M"
export function formatCompact(number: number): string {
  if (number >= 1_000_000) {
    return (
      (number / 1_000_000).toFixed(number % 1_000_000 === 0 ? 0 : 2) + ' M'
    );
  }
  if (number >= 1_000) {
    return (number / 1_000).toFixed(number % 1_000 === 0 ? 0 : 2) + ' K';
  }
  return number.toString();
}
