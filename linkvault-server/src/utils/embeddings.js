import OpenAI from 'openai'

async function generateEmbedding(text) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    })
    return response.data[0].embedding
  } catch (error) {
     console.log("Embedding error:", error.message)
    return []
  }
}

export default generateEmbedding