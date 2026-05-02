exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { title, content, upvotes, comments } = JSON.parse(event.body)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: `You are a Minecraft community assistant. Summarize this forum post in 2-3 enthusiastic sentences. Highlight what makes it interesting or valuable to the Minecraft community.

Title: ${title}
Description: ${content || 'No description provided'}
Upvotes: ${upvotes}
Comments (${comments.length} total): ${comments.slice(0, 5).map(c => c.content).join(' | ') || 'No comments yet'}`
        }]
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.message || 'Anthropic API error')
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: data.content[0].text })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    }
  }
}
