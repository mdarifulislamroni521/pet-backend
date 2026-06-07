import { ERequest, EResponse } from "../../types";

export async function POST(req: ERequest, res: EResponse) {
  try {
    const { imageData, imageType, analysisType, model, apiKey } = req.body;

    if (!apiKey || apiKey === 'AIza...') {
      return res.status(400).json(
        { error: 'Please configure your Google API key in AI Settings' });
    }

    if (!imageData) {
      return res.status(400).json(
        { error: 'Image data is required' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro-vision'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a medical AI assistant specializing in medical image analysis. Analyze this ${imageType} image for ${analysisType}.

Please provide:
1. Image quality assessment
2. Anatomical structures identified
3. Potential abnormalities or findings
4. Clinical significance
5. Recommendations for further imaging or consultation

Important: This is for educational purposes only. Always consult with qualified healthcare professionals for medical diagnosis and treatment decisions.`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageData
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json(
        { error: `Google Vision API error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.json(
        { error: 'No response content from Google Vision API' });
    }

    return res.status(500).json({
      content,
      model: data.model,
      usageMetadata: data.usageMetadata,
      finishReason: data.candidates?.[0]?.finishReason
    });

  } catch (error) {
    console.error('Google Vision API error:', error);
    return res.json(
      { error: 'Internal server error' });
  }
}
