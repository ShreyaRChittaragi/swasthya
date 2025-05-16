// Chatbot functionality with DeepInfra API integration
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbot = document.getElementById('close-chatbot');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Initially hide the chatbot
    chatbotContainer.classList.add('hidden');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        chatbotContainer.classList.remove('hidden');
    });
    
    // Close chatbot when X is clicked
    closeChatbot.addEventListener('click', function(e) {
        e.stopPropagation();
        chatbotContainer.classList.add('hidden');
    });
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick replies
    setTimeout(() => {
        addQuickReplies([
            "How do I take my medicine?",
            "What should I eat today?",
            "Is my blood pressure normal?",
            "When is my next appointment?",
            "Show me my reminders",
            "I'm not feeling well"
        ]);
    }, 2000);
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        addUserMessage(message);
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message through DeepInfra API
        try {
            const botResponse = await callDeepInfra(message);
            addBotMessage(botResponse);
        } catch (error) {
            console.error("API Error:", error);
            // Fallback to local responses if API fails
            processUserMessageLocally(message);
        }
    }
}

// DeepInfra API Call Function
async function callDeepInfra(message) {
    // Replace with your actual DeepInfra API key
    const API_KEY = "dapi-bWrSuQcBAZpmBGI0gjh6B79LvNO7FIBD"; 
    // You can use these free models:
    // - "meta-llama/Llama-2-70b-chat-hf" (best but slower)
    // - "mistralai/Mistral-7B-Instruct-v0.1" (faster)
    const MODEL = "mistralai/Mistral-7B-Instruct-v0.1";
    
    try {
        const response = await fetch(`https://api.deepinfra.com/v1/inference/${MODEL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                input: `You are a helpful medical assistant chatbot. Provide concise, accurate responses to health questions.
                
                User: ${message}
                Assistant:`,
                max_new_tokens: 200,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.results[0].generated_text;
    } catch (error) {
        console.error("DeepInfra API Error:", error);
        throw error; // Re-throw to handle in sendMessage
    }
}

// Local fallback processing
function processUserMessageLocally(message) {
    message = message.toLowerCase();
    
    if (message.includes('medicine') || message.includes('pill') || message.includes('tablet') || message.includes('medication')) {
        const responses = [
            "Take your medicine with water as prescribed. Don't skip doses.",
            "Store medicines in a cool, dry place away from sunlight.",
            "Check expiration dates before taking any medication."
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    } 
    else if (message.includes('eat') || message.includes('diet') || message.includes('food') || message.includes('meal')) {
        const responses = [
            "Eat balanced meals with fruits, vegetables, and lean proteins.",
            "Stay hydrated by drinking plenty of water throughout the day.",
            "Limit processed foods and excess salt for better recovery."
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
    else {
        const fallbackResponses = [
            "I'm here to help with your health questions.",
            "Could you clarify your question?",
            "I specialize in health-related advice. How can I help?"
        ];
        addBotMessage(fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]);
    }
}

// Rest of your existing functions remain the same
function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text, isQuickReply = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove typing indicator if present
    const typingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (typingIndicator) {
        messagesContainer.removeChild(typingIndicator);
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    if (!isQuickReply) {
        setTimeout(() => {
            addQuickReplies([
                "How do I take my medicine?",
                "What should I eat today?",
                "Is my blood pressure normal?",
                "When is my next appointment?",
                "Show me my reminders",
                "I'm not feeling well"
            ]);
        }, 500);
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove existing typing indicator if present
    const existingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (existingIndicator) {
        messagesContainer.removeChild(existingIndicator);
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addQuickReplies(replies) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove existing quick replies if present
    const existingReplies = messagesContainer.querySelector('.quick-replies');
    if (existingReplies) {
        messagesContainer.removeChild(existingReplies);
    }
    
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply';
        button.textContent = reply;
        button.addEventListener('click', () => {
            addUserMessage(reply);
            showTypingIndicator();
            setTimeout(async () => {
                try {
                    const botResponse = await callDeepInfra(reply);
                    addBotMessage(botResponse);
                } catch (error) {
                    processUserMessageLocally(reply);
                }
            }, 1000);
        });
        repliesDiv.appendChild(button);
    });
    
    messagesContainer.appendChild(repliesDiv);
    scrollToBottom();
}