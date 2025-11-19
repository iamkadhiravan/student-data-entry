-- Create predictions table to store all prediction results
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  attendance DECIMAL(5,2) NOT NULL,
  study_hours DECIMAL(5,2) NOT NULL,
  internal_marks DECIMAL(5,2) NOT NULL,
  assignments INTEGER NOT NULL,
  activities INTEGER NOT NULL,
  prediction TEXT NOT NULL CHECK (prediction IN ('Pass', 'Fail')),
  confidence DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_predictions_student_id ON public.predictions(student_id);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert predictions (public app)
CREATE POLICY "Anyone can insert predictions"
  ON public.predictions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view all predictions (public app)
CREATE POLICY "Anyone can view predictions"
  ON public.predictions
  FOR SELECT
  USING (true);

-- Create a view for recent predictions summary
CREATE OR REPLACE VIEW public.predictions_summary AS
SELECT 
  COUNT(*) as total_predictions,
  SUM(CASE WHEN prediction = 'Pass' THEN 1 ELSE 0 END) as pass_count,
  SUM(CASE WHEN prediction = 'Fail' THEN 1 ELSE 0 END) as fail_count,
  AVG(confidence) as avg_confidence,
  DATE(created_at) as prediction_date
FROM public.predictions
GROUP BY DATE(created_at)
ORDER BY prediction_date DESC;