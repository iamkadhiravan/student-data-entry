import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  studentId: string;
  attendance: string;
  studyHours: string;
  internalMarks: string;
  assignments: string;
  activities: string;
}

interface PredictionResult {
  prediction: string;
  confidence: number;
}

interface ManualInputFormProps {
  onPredict: (result: PredictionResult) => void;
}

const ManualInputForm = ({ onPredict }: ManualInputFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    attendance: "",
    studyHours: "",
    internalMarks: "",
    assignments: "",
    activities: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(formData).some(value => value === "")) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const attendance = parseFloat(formData.attendance);
      const studyHours = parseFloat(formData.studyHours);
      const internalMarks = parseFloat(formData.internalMarks);
      const assignments = parseInt(formData.assignments);
      const activities = parseInt(formData.activities);

      const score = (
        attendance * 0.25 +
        (studyHours / 10) * 15 * 0.15 +
        internalMarks * 0.35 +
        (assignments / 10) * 10 * 0.15 +
        (activities / 5) * 10 * 0.10
      );

      const prediction = score >= 55 ? "Pass" : "Fail";
      const confidence = Math.min(95, Math.max(65, score + (Math.random() * 10)));

      toast.success("Prediction generated successfully!");
      onPredict({ prediction, confidence });
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Manual Input
        </CardTitle>
        <CardDescription>
          Enter student details to predict academic performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="e.g., STU001"
              value={formData.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendance">Attendance Percentage (%)</Label>
            <Input
              id="attendance"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g., 85"
              value={formData.attendance}
              onChange={(e) => handleChange("attendance", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studyHours">Study Hours per Week</Label>
            <Input
              id="studyHours"
              type="number"
              min="0"
              max="168"
              step="0.5"
              placeholder="e.g., 20"
              value={formData.studyHours}
              onChange={(e) => handleChange("studyHours", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalMarks">Internal Marks (out of 100)</Label>
            <Input
              id="internalMarks"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g., 75"
              value={formData.internalMarks}
              onChange={(e) => handleChange("internalMarks", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignments">Assignments Submitted (out of 10)</Label>
            <Input
              id="assignments"
              type="number"
              min="0"
              max="10"
              placeholder="e.g., 8"
              value={formData.assignments}
              onChange={(e) => handleChange("assignments", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activities">Participation in Activities (out of 5)</Label>
            <Input
              id="activities"
              type="number"
              min="0"
              max="5"
              placeholder="e.g., 3"
              value={formData.activities}
              onChange={(e) => handleChange("activities", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Processing..." : "Predict Performance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualInputForm;
