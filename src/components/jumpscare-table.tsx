import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Jumpscare } from "@/types";
import { Zap } from "lucide-react";

interface JumpscareTableProps {
  jumpscares: Jumpscare[];
  formatTimestamp?: (minutes: number, seconds: number) => string;
  onTimestampClick?: () => void;
}

export function JumpscareTable({
  jumpscares,
  formatTimestamp,
  onTimestampClick,
}: JumpscareTableProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "major":
        return "bg-jumpscare-intense-bg text-jumpscare-intense";
      case "minor":
        return "bg-jumpscare-low-bg text-jumpscare-low";
      case "false_alarm":
        return "bg-jumpscare-mild-bg text-jumpscare-mild";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "major":
        return "Major";
      case "minor":
        return "Minor";
      case "false_alarm":
        return "False Alarm";
      default:
        return category;
    }
  };

  // Default format function if none provided
  const defaultFormatTimestamp = (minutes: number, seconds: number) => {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const timestampFormatter = formatTimestamp || defaultFormatTimestamp;

  if (jumpscares.length === 0) {
    return (
      <div className="text-center py-8 text-app-text-muted">
        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No jumpscares recorded for this movie yet.</p>
      </div>
    );
  }

  return (
    <Table variant="neutral">
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jumpscares.map((jumpscare) => (
          <TableRow key={jumpscare.id}>
            <TableCell className="font-mono">
              <button
                onClick={onTimestampClick}
                className="hover:text-brand-red transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
                title="Click to toggle time format"
              >
                {timestampFormatter(
                  jumpscare.timestamp_minutes,
                  jumpscare.timestamp_seconds
                )}
              </button>
            </TableCell>
            <TableCell>
              <Badge className={getCategoryColor(jumpscare.category)}>
                {getCategoryLabel(jumpscare.category)}
              </Badge>
            </TableCell>
            <TableCell>{jumpscare.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
