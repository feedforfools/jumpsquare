import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Jumpscare, formatTimestamp } from "@/types";
import { Zap, Clock, AlertTriangle } from "lucide-react";

interface JumpscareTableProps {
  jumpscares: Jumpscare[];
}

export function JumpscareTable({ jumpscares }: JumpscareTableProps) {
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-100 text-green-800";
    if (intensity <= 6) return "bg-yellow-100 text-yellow-800";
    if (intensity <= 8) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "major":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "minor":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "false_alarm":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
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
          {jumpscares
            .sort((a, b) => {
              const aTotal = a.timestamp_minutes * 60 + a.timestamp_seconds;
              const bTotal = b.timestamp_minutes * 60 + b.timestamp_seconds;
              return aTotal - bTotal;
            })
            .map((jumpscare) => (
              <TableRow key={jumpscare.id}>
                <TableCell className="font-mono">
                  {formatTimestamp(
                    jumpscare.timestamp_minutes,
                    jumpscare.timestamp_seconds,
                    jumpscare.timestamp_millis
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(jumpscare.category)}
                    <span className="text-sm">
                      {getCategoryLabel(jumpscare.category)}
                    </span>
                  </div>
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
