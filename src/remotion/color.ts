/** Apply an alpha channel to a #rgb / #rrggbb hex color, returning an rgba() string. */
export const withAlpha = (hex: string, alpha: number): string => {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (full.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
