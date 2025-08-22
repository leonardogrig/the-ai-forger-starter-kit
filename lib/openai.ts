import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBlogPost(originalText: string) {
  const prompt = `Transform the following text into a polished, engaging blog post optimized for SEO:

Original text:
"""
${originalText}
"""

Requirements:
- Create an engaging, attention-grabbing title
- Structure the content with proper headings (H2, H3)
- Use SEO-friendly formatting with bullet points, numbered lists where appropriate
- Include a compelling introduction and conclusion
- Optimize for readability and engagement
- Maintain the core message and insights from the original text
- Add relevant keywords naturally
- Write in a conversational yet professional tone
- Aim for 800-1500 words

Please format the response as JSON with the following structure:
{
  "title": "Blog post title",
  "content": "Full blog post content with HTML formatting",
  "imagePrompt": "A detailed description for an AI image generator that would create a relevant featured image for this blog post"
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [{ role: 'user', content: prompt }],
  });

  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error('Failed to generate blog post');
  }

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse generated blog post');
  }
}

export async function generateBlogImage(prompt: string) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Create a modern, professional blog post featured image: ${prompt}. Style: clean, minimal, high-quality, suitable for a business blog.`,
    n: 1,
    size: '1792x1024',
    quality: 'standard',
  });

  return response.data?.[0]?.url ?? null;
}

export function calculateTokensUsed(text: string): number {
  const characterCount = text.length;
  return Math.ceil(characterCount / 15000);
}