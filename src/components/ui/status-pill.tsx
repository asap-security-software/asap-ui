import { Badge, type BadgeProps } from "./badge";
import type { StatusTone } from "./status-tone";

export type StatusPillProps = Omit<BadgeProps, "status" | "dot"> & {
  status?: StatusTone;
};

/** Tinted pill with a dot. The fill and the dot both use the status tokens. */
function StatusPill({ status = "scheduled", ...props }: StatusPillProps) {
  return <Badge {...props} data-slot="status-pill" status={status} dot />;
}

export { StatusPill };
