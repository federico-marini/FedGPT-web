const API_URL = "https://flourishing-daffodil-0ece32.netlify.app/.netlify/functions/chat";

async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (!userInput) return;

  const chatBox = document.getElementById("chat");
  chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;
  document.getElementById("user-input").value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput })
    });

    if (!response.ok) {
      const errorData = await response.json();
      chatBox.innerHTML += `<div class="bot-message">Errore: ${errorData.error || "Errore sconosciuto"}</div>`;
      console.error("Response error:", errorData);
      return;
    }

    const data = await response.json();
    if (data.choices) {
      const reply = data.choices[0].message.content;
      chatBox.innerHTML += `<div class="bot-message">${reply}</div>`;
    } else {
      chatBox.innerHTML += `<div class="bot-message">Errore nella risposta: ${data.error || "Risposta non valida"}</div>`;
    }
  } catch (error) {
    chatBox.innerHTML += `<div class="bot-message">Connection Error</div>`;
    console.error("Fetch error:", error);
  }
}
