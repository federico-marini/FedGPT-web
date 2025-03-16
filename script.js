const API_KEY = "https://chatgpt-backend.vercel.app/api/chat"; // Replace with your API Key

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        const data = await response.json();
        if (response.status !== 200) {
            chatBox.innerHTML += `<div class="bot-message">Error: ${data.error?.message || "Unknown error"}</div>`;
            return;
        }

        let reply = data.choices[0].message.content;
        reply = formatMessage(reply);

        chatBox.innerHTML += `<div class="bot-message">${reply}</div>`;

        // Apply syntax highlighting
        document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
        });

    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message">Connection Error</div>`;
        console.error("Error:", error);
    }
}

// Function to format ChatGPT code blocks
function formatMessage(text) {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? lang : "plaintext"; 
        return `
            <div class="code-window">
                <div class="code-header">${language.toUpperCase()}</div>
                <pre><code class="${language}">${escapeHTML(code)}</code></pre>
            </div>
        `;
    });
}

// Escape HTML to prevent rendering issues
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}
