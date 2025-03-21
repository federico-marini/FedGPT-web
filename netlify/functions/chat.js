const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  // Controlla che il metodo usato sia POST
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
    // Chiamata all'API di Deepseek:
    // Verifica l'endpoint e il formato del payload nella documentazione di Deepseek.
    const response = await fetch("https://api.deepseek.com/v1/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      // Supponiamo che Deepseek si aspetti un campo "query"
      body: JSON.stringify({ query: message })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepseek API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Deepseek API error", details: errorText })
      };
    }
    
    const data = await response.json();
    console.log("Deepseek API response:", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Connection error to Deepseek", details: error.toString() })
    };
  }
};

