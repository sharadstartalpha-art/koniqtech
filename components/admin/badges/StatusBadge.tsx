import Badge from "@/components/ui/Badge";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="success">
          Active
        </Badge>
      );

    case "PENDING":
      return (
        <Badge variant="warning">
          Pending
        </Badge>
      );

    case "SUSPENDED":
      return (
        <Badge variant="danger">
          Suspended
        </Badge>
      );

    default:
      return (
        <Badge>
          {status}
        </Badge>
      );
  }
}