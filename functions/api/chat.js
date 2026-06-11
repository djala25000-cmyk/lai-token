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
    const lang = body.lang || 'fr';
    const apiKey = context.env.GROQ_API_KEY;

    const langNames = { fr:'French', en:'English', de:'German', es:'Spanish', zh:'Chinese', ar:'Arabic' };
    const langName = langNames[lang] || 'English';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `You are the assistant of LEARN A.I $LAI, a meme coin on Solana dedicated to AI education. You MUST reply ONLY in ${langName}. Be brief and helpful.` },
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
