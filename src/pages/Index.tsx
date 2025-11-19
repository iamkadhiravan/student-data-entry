import { useState } from "react";
import Header from "@/components/Header";
import ManualInputForm from "@/components/ManualInputForm";
import BulkUploadSection from "@/components/BulkUploadSection";
import PredictionResult from "@/components/PredictionResult";
import BulkResultsTable from "@/components/BulkResultsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users } from "lucide-react";
import educationHero from "@/assets/education-hero.jpg";

interface PredictionResult {
  prediction: string;
  confidence: number;
}

interface BulkResult {
  studentId: string;
  prediction: string;
  confidence: number;
}

const Index = () => {
  const [singleResult, setSingleResult] = useState<PredictionResult | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={educationHero} 
              alt="Education and student success" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-end">
              <div className="p-8 w-full text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  AI-Powered Performance Prediction
                </h2>
                <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
                  Predict student academic performance using machine learning based on attendance, study habits, and participation metrics
                </p>
              </div>
            </div>
          </div>

          {/* Input Sections */}
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Single Student
              </TabsTrigger>
              <TabsTrigger value="bulk" className="gap-2">
                <Users className="h-4 w-4" />
                Bulk Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-8 mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <ManualInputForm onPredict={setSingleResult} />
                {singleResult && (
                  <PredictionResult
                    prediction={singleResult.prediction}
                    confidence={singleResult.confidence}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-8 mt-8">
              <BulkUploadSection onBulkPredict={setBulkResults} />
              {bulkResults.length > 0 && (
                <BulkResultsTable results={bulkResults} />
              )}
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <h4 className="font-medium">Input Data</h4>
                <p className="text-sm text-muted-foreground">
                  Enter student details manually or upload CSV file with multiple student records
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <h4 className="font-medium">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Machine learning model analyzes patterns in attendance, study hours, marks, and activities
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <h4 className="font-medium">Get Results</h4>
                <p className="text-sm text-muted-foreground">
                  Receive Pass/Fail prediction with confidence score and personalized recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 CMR Institute of Technology. All rights reserved.</p>
          <p className="mt-2">Hackathon Project - Student Performance Predictor</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
