import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processCSV = async (csvText: string) => {
    const lines = csvText.trim().split('\n');
    
    const predictions: BulkResult[] = [];
    const insertData = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < 6) continue;

      const studentId = values[0].trim();
      const attendance = parseFloat(values[1]);
      const studyHours = parseFloat(values[2]);
      const internalMarks = parseFloat(values[3]);
      const assignments = parseInt(values[4]);
      const activities = parseInt(values[5]);

      const score = (
        attendance * 0.25 +
        (studyHours / 10) * 15 * 0.15 +
        internalMarks * 0.35 +
        (assignments / 10) * 10 * 0.15 +
        (activities / 5) * 10 * 0.10
      );

      const prediction = score >= 60 ? "Pass" : "Fail";
      const confidence = Math.min(95, Math.max(65, score + (Math.random() * 10)));

      predictions.push({ studentId, prediction, confidence });
      insertData.push({
        student_id: studentId,
        attendance,
        study_hours: studyHours,
        internal_marks: internalMarks,
        assignments,
        activities,
        prediction,
        confidence,
      });

      try {
        await supabase.functions.invoke('save-to-sheets', {
          body: {
            student_id: studentId,
            attendance,
            study_hours: studyHours,
            internal_marks: internalMarks,
            assignments,
            activities,
            prediction,
            confidence,
          },
        });
      } catch (error) {
        console.error(`Failed to sync ${studentId} to Google Sheets:`, error);
      }
    }

    const { error } = await supabase
      .from('predictions')
      .insert(insertData);

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save to database');
    }

    return predictions;
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(file);
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const results = await processCSV(text);
      
      onBulkPredict(results);
      toast.success(`Successfully processed ${results.length} student records`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Failed to process CSV file");
    } finally {
      setIsProcessing(false);
    }
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
    const csvContent = "Student_ID,Attendance,Study_Hours,Internal_Marks,Assignments,Activities\nSTU001,85,20,75,8,3\nSTU002,65,10,55,5,1\nSTU003,90,25,85,9,4\n";
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
              {isProcessing ? "Processing..." : file ? file.name : "Drag and drop your CSV file here"}
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
              disabled={isProcessing}
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" asChild disabled={isProcessing}>
                <span className="cursor-pointer">
                  {isProcessing ? "Processing..." : "Select CSV File"}
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
