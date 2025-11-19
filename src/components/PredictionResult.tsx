import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PredictionResultProps {
  prediction: string;
  confidence: number;
}

const PredictionResult = ({ prediction, confidence }: PredictionResultProps) => {
  const isPass = prediction === "Pass";

  return (
    <Card className={`shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isPass ? "border-success/50 bg-success/5" : "border-destructive/50 bg-destructive/5"
    }`}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Prediction Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <div className={`rounded-full p-6 ${isPass ? "bg-success/10" : "bg-destructive/10"}`}>
            {isPass ? (
              <CheckCircle2 className="h-24 w-24 text-success" />
            ) : (
              <XCircle className="h-24 w-24 text-destructive" />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-4xl font-bold">
            {prediction}
          </h3>
          <p className="text-muted-foreground">
            {isPass 
              ? "Student is predicted to pass with good performance"
              : "Student may need additional support and guidance"
            }
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Confidence Level</span>
            <span className="text-muted-foreground">{confidence.toFixed(1)}%</span>
          </div>
          <Progress value={confidence} className="h-3" />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Recommendation:</p>
          <p className="text-sm text-muted-foreground">
            {isPass
              ? "Continue maintaining current study habits and participation levels. Consider mentoring peers who need additional support."
              : "Focus on improving attendance and study hours. Seek help from faculty and participate more actively in assignments and activities."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
