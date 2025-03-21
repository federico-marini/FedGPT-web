const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Accept": "application/json" // Aggiungi questo header
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Modello corretto per Deepseek
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150 // Aggiungi parametri richiesti
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Deepseek API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.choices[0].message.content }) // Percorso dati modificato
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
