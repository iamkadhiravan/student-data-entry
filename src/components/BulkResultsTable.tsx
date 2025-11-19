import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BulkResult {
  studentId: string;
  prediction: string;
  confidence: number;
}

interface BulkResultsTableProps {
  results: BulkResult[];
}

const BulkResultsTable = ({ results }: BulkResultsTableProps) => {
  const handleExport = () => {
    const csvContent = [
      "Student_ID,Prediction,Confidence",
      ...results.map(r => `${r.studentId},${r.prediction},${r.confidence.toFixed(1)}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prediction_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Results exported successfully");
  };

  const passCount = results.filter(r => r.prediction === "Pass").length;
  const failCount = results.length - passCount;

  return (
    <Card className="shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Bulk Prediction Results
          </CardTitle>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pass</p>
              <p className="text-3xl font-bold text-success">{passCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Fail</p>
              <p className="text-3xl font-bold text-destructive">{failCount}</p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Prediction</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.studentId}>
                  <TableCell className="font-medium">{result.studentId}</TableCell>
                  <TableCell>
                    <Badge variant={result.prediction === "Pass" ? "default" : "destructive"}>
                      {result.prediction}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{result.confidence.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkResultsTable;
