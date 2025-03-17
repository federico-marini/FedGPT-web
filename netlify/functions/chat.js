const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  // Controlla che il metodo usato sia POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }
  
  // Estrai il messaggio dalla richiesta
  const { message } = JSON.parse(event.body);

  try {
    // Chiama l'API di OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Oppure "gpt-4" se preferisci
        messages: [{ role: "user", content: message }]
      })
    });
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nella connessione a OpenAI" })
    };
  }
};
