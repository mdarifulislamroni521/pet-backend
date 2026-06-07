import { ERequest, EResponse } from "../../types";

export async function POST(req: ERequest, res: EResponse) {
  try {
    const { prompt, model, maxTokens, temperature, apiKey } = req.body;

    if (!apiKey || apiKey === 'AIza...') {
      return res.status(400).json(
        { error: 'Please configure your Google API key in AI Settings' });
    }

    if (!prompt) {
      return res.status(400).json(
        { error: 'Prompt is required' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a medical AI assistant. Provide accurate, evidence-based medical information. Always recommend consulting with healthcare professionals for medical decisions.

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: temperature || 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxTokens || 1000,
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
      return res.status(200).json(
        { error: `Google API error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.json(
        { error: 'No response content from Google' });
    }

    return res.status(500).json({
      content,
      model: data.model,
      usageMetadata: data.usageMetadata,
      finishReason: data.candidates?.[0]?.finishReason
    });

  } catch (error) {
    console.error('Google API error:', error);
    return res.json(
      { error: 'Internal server error' });
  }
}
