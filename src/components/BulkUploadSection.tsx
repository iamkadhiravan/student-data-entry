import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";

interface BulkResult {
  studentId: string;
  prediction: string;
  confidence: number;
}

interface BulkUploadSectionProps {
  onBulkPredict: (results: BulkResult[]) => void;
}

const BulkUploadSection = ({ onBulkPredict }: BulkUploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(file);
    
    // Mock processing - in real app, would parse CSV and send to backend
    const mockResults: BulkResult[] = [
      { studentId: "STU001", prediction: "Pass", confidence: 87.5 },
      { studentId: "STU002", prediction: "Fail", confidence: 72.3 },
      { studentId: "STU003", prediction: "Pass", confidence: 91.2 },
    ];

    setTimeout(() => {
      onBulkPredict(mockResults);
      toast.success(`Successfully processed ${mockResults.length} student records`);
    }, 1000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Student_ID,Attendance,Study_Hours,Internal_Marks,Assignments,Activities\nSTU001,85,20,75,8,3\nSTU002,65,10,55,5,1\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded successfully");
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Upload className="h-6 w-6 text-secondary" />
          Bulk Upload
        </CardTitle>
        <CardDescription>
          Upload a CSV file to predict performance for multiple students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-primary/50"
            }`}
          >
            <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {file ? file.name : "Drag and drop your CSV file here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" asChild>
                <span className="cursor-pointer">
                  Select CSV File
                </span>
              </Button>
            </label>
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              onClick={downloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">CSV Format Requirements:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Student_ID, Attendance, Study_Hours, Internal_Marks, Assignments, Activities</li>
              <li>• Attendance: 0-100 (%)</li>
              <li>• Study_Hours: Hours per week</li>
              <li>• Internal_Marks: 0-100</li>
              <li>• Assignments: 0-10</li>
              <li>• Activities: 0-5</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUploadSection;
