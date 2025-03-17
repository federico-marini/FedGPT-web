const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  console.log("Event received:", event); // Log dell'evento per vedere cosa arriva

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
    console.log("Payload parsed:", payload); // Log del payload
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" })
    };
  }
  
  const { message } = payload;
  if (!message) {
    console.error("No message provided in payload");
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenAI API error", details: errorText })
      };
    }
    
    const data = await response.json();
    console.log("OpenAI API response:", data);
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
