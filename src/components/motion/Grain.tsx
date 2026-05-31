/** Subtle film-grain overlay for an analogue, printed-paper feel. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-multiply"
      style={{ backgroundSize: "160px 160px" }}
    />
  );
}
