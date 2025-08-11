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
  formatTimestamp?: (
    minutes: number,
    seconds: number,
    millis: number
  ) => string;
  onTimestampClick?: () => void;
}

export function JumpscareTable({
  jumpscares,
  formatTimestamp,
  onTimestampClick,
}: JumpscareTableProps) {
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-100 text-green-800";
    if (intensity <= 6) return "bg-yellow-100 text-yellow-800";
    if (intensity <= 8) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "major":
        return "bg-red-100 text-red-800";
      case "minor":
        return "bg-blue-100 text-blue-800";
      case "false_alarm":
        return "bg-gray-100 text-gray-800";
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
  const defaultFormatTimestamp = (
    minutes: number,
    seconds: number,
    millis: number
  ) => {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedMillis = millis.toString().padStart(3, "0");
    return `${formattedMinutes}:${formattedSeconds}.${formattedMillis}`;
  };

  const timestampFormatter = formatTimestamp || defaultFormatTimestamp;

  if (jumpscares.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No jumpscares recorded for this movie yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Intensity</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jumpscares.map((jumpscare) => (
            <TableRow key={jumpscare.id}>
              <TableCell className="font-mono">
                <button
                  onClick={onTimestampClick}
                  className="hover:text-red-600 transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
                  title="Click to toggle time format"
                >
                  {timestampFormatter(
                    jumpscare.timestamp_minutes,
                    jumpscare.timestamp_seconds,
                    jumpscare.timestamp_millis
                  )}
                </button>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(jumpscare.category)}>
                  {getCategoryLabel(jumpscare.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getIntensityColor(jumpscare.intensity)}>
                  {jumpscare.intensity}/10
                </Badge>
              </TableCell>
              <TableCell>{jumpscare.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
