-- Fix security definer view by recreating it without security definer
DROP VIEW IF EXISTS public.predictions_summary;

CREATE OR REPLACE VIEW public.predictions_summary 
WITH (security_invoker = true)
AS
SELECT 
  COUNT(*) as total_predictions,
  SUM(CASE WHEN prediction = 'Pass' THEN 1 ELSE 0 END) as pass_count,
  SUM(CASE WHEN prediction = 'Fail' THEN 1 ELSE 0 END) as fail_count,
  AVG(confidence) as avg_confidence,
  DATE(created_at) as prediction_date
FROM public.predictions
GROUP BY DATE(created_at)
ORDER BY prediction_date DESC;