const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const rawResponse = await response.text();
    console.log("Raw Response:", rawResponse);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${rawResponse}`);
    }

    const data = JSON.parse(rawResponse);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.choices[0].message.content })
    };

  } catch (error) {
    console.error("Full Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Errore del server",
        details: error.message 
      })
    };
  }
};
