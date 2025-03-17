const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  // Controllo del metodo HTTP
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" })
    };
  }
  
  const { message } = payload;
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message is required" })
    };
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });
    
    // Se la risposta non è OK, logghiamo i dettagli
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenAI API error", details: errorText })
      };
    }
    
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nella connessione a OpenAI", details: error.toString() })
    };
  }
};
