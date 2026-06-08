export async function onRequest(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const body = await context.request.json();
    const message = body.message || 'Hello';
    const apiKey = context.env.GROQ_API_KEY;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Tu es l assistant de LEARN A.I $LAI. Reponds brievement dans la langue de l utilisateur.' },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || JSON.stringify(data);

    return new Response(JSON.stringify({ reply }), { headers });

  } catch (err) {
    return new Response(JSON.stringify({ reply: err.message }), { headers });
  }
}
