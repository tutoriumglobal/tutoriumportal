function hexToRgba(hex, opacity) {
  const safeHex =
    typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#0B2D8A";

  const normalized = safeHex.replace("#", "");

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export default function SubjectStatusBadge({ status, color }) {
  const safeColor = color || "#0B2D8A";

  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize"
      style={{
        color: safeColor,
        backgroundColor: hexToRgba(safeColor, 0.1),
      }}
    >
      {status || "active"}
    </span>
  );
}
