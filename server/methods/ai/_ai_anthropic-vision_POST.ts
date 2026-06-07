import { ERequest, EResponse } from "../../types";

export async function POST(req: ERequest, res: EResponse) {
  try {
    const { messages, model, maxTokens, temperature, apiKey } = req.body;

    if (!apiKey || apiKey === 'sk-ant-...') {
      return res.status(400).json(
        { error: 'Please configure your Anthropic API key in AI Settings' });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json(
        { error: 'Messages array is required' });
    }

    // Validate that the model supports vision
    const visionModels = ['claude-3.5-sonnet', 'claude-3.5-haiku', 'claude-3.5-opus', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'];
    if (!visionModels.includes(model)) {
      return res.status(400).json(
        { error: `Model ${model} does not support vision. Supported models: ${visionModels.join(', ')}` });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-3.5-sonnet-20241022',
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.1,
        system: 'You are a medical AI assistant specializing in medical image analysis. Provide accurate, evidence-based analysis of medical images. Always recommend consulting with healthcare professionals for medical decisions.',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic Vision API error:', errorData);
      return res.status(200).json(
        { error: `Anthropic Vision API error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return res.json(
        { error: 'No response content from Anthropic Vision API' });
    }

    return res.status(500).json({
      content,
      model: data.model,
      usage: data.usage,
      stop_reason: data.stop_reason
    });

  } catch (error) {
    console.error('Anthropic Vision API error:', error);
    return res.json(
      { error: 'Internal server error' });
  }
}
