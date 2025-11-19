import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionData {
  student_id: string;
  attendance: number;
  study_hours: number;
  internal_marks: number;
  assignments: number;
  activities: number;
  prediction: string;
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PredictionData = await req.json();
    console.log('Received prediction data:', data);

    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    if (!apiKey || !sheetId) {
      console.error('Missing Google Sheets credentials');
      return new Response(
        JSON.stringify({ error: 'Google Sheets not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare row data for Google Sheets
    const timestamp = new Date().toISOString();
    const rowData = [
      data.student_id,
      data.attendance.toString(),
      data.study_hours.toString(),
      data.internal_marks.toString(),
      data.assignments.toString(),
      data.activities.toString(),
      data.prediction,
      data.confidence.toFixed(2),
      timestamp,
    ];

    // Append to Google Sheets using Sheets API v4
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:I:append?valueInputOption=RAW&key=${apiKey}`;
    
    console.log('Sending to Google Sheets...');
    const sheetsResponse = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Google Sheets API error: ${sheetsResponse.status}`);
    }

    const result = await sheetsResponse.json();
    console.log('Successfully saved to Google Sheets:', result);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data saved to Google Sheets',
        updatedRange: result.updates?.updatedRange 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in save-to-sheets function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save to Google Sheets';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
