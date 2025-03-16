const API_URL = "https://chatgpt-backend.vercel.app/api/chat"; // Replace with your actual Vercel backend URL

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

        const data = await response.json();
        if (data.choices) {
            const reply = data.choices[0].message.content;
            chatBox.innerHTML += `<div class="bot-message">${reply}</div>`;
        } else {
            chatBox.innerHTML += `<div class="bot-message">Error: ${data.error?.message || "Unknown error"}</div>`;
        }
    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message">Connection Error</div>`;
        console.error("Error:", error);
    }
}
