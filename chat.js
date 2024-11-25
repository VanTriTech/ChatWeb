document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatWidget = document.querySelector('.chat-widget');
    const chatHeader = document.querySelector('.chat-header');
    const expandBtn = document.querySelector('.expand-btn');
    const chatContent = document.querySelector('.chat-content');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMediaInput = document.getElementById('chat-media');
    const chatMessages = document.querySelector('.chat-messages');

    // Chat State
    let isExpanded = false;
    let selectedMedia = [];

    // API Key
    const GEMINI_API_KEY = 'AIzaSyDC2eRlff09hopH0Wb_j62ECNkwWpwgzVQ';

    // Backup responses
    const responses = [
        "Ừ, điều đó thú vị thật! 😊",
        "Thật hả? Kể thêm đi! 🤗",
        "Hihi, mình hiểu ý bạn rồi 😄",
        "Ôi, nghe hay quá! ✨",
        "Mình cũng nghĩ vậy đó 💕"
    ];

    // Event Listeners
    chatHeader.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    chatMediaInput.addEventListener('change', handleMediaUpload);

    // Toggle Chat
    function toggleChat() {
        isExpanded = !isExpanded;
        chatContent.style.display = isExpanded ? 'flex' : 'none';
        expandBtn.querySelector('i').className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        
        if (isExpanded) {
            loadMessages();
            chatInput.focus();
        }
    }

    // Get AI Response
async function getAIResponse(message) {
    try {
        const prompt = `Bạn là Mỹ Ngọc, một cô gái 20 tuổi. Bạn và người chat là bạn thân từ nhỏ.

        Ngữ cảnh:
        - Các bạn là bạn thân thiết từ nhỏ, hiểu rõ về nhau
        - Bạn rất thông minh, hiểu biết nhiều lĩnh vực
        - Cách nói chuyện rất tự nhiên, thân thiện như bạn bè
        
        Quy tắc trả lời:
        - Luôn dùng "t" thay cho "tao", "m" thay cho "mày"
        - Viết tắt các từ phổ biến: không = k, gì = j, được = dc, biết = bít, thế = thế
        - Thêm emoji phù hợp với cảm xúc
        - Trả lời ngắn gọn (1-2 câu)
        - Thỉnh thoảng dùng tiếng lóng: "ô kê", "chill", "ez", "vip", "pro"
        - Thể hiện sự thân thiết qua cách nói chuyện
        - Có thể trêu đùa, đá đểu nhẹ nhàng
        
        Hãy trả lời tin nhắn sau một cách tự nhiên nhất: "${message}"`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 100
                    }
                })
            }
        );

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

    // Handle Send Message
    async function handleSendMessage() {
        const content = chatInput.value.trim();
        if (!content && !selectedMedia.length) return;

        // User message
        const userMessage = {
            id: Date.now(),
            content: content,
            sender: 'Tôi',
            timestamp: new Date().toISOString(),
            media: selectedMedia
        };

        addMessageToDOM(userMessage);
        saveMessage(userMessage);

        // Reset input
        chatInput.value = '';
        selectedMedia = [];
        updateMediaPreview();
        chatInput.focus();
        scrollToBottom();

        // Show typing
        showTypingIndicator();

        try {
            // Random delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            // Get AI response
            let aiResponse = await getAIResponse(content);
            
            // Use backup if AI fails
            if (!aiResponse) {
                aiResponse = responses[Math.floor(Math.random() * responses.length)];
            }

            removeTypingIndicator();

            // Bot message
            const botMessage = {
                id: Date.now(),
                content: aiResponse,
                sender: 'Mỹ Ngọc',
                timestamp: new Date().toISOString(),
                media: []
            };

            addMessageToDOM(botMessage);
            saveMessage(botMessage);
            scrollToBottom();
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            
            // Fallback message
            const fallbackMessage = {
                id: Date.now(),
                content: responses[Math.floor(Math.random() * responses.length)],
                sender: 'Mỹ Ngọc',
                timestamp: new Date().toISOString(),
                media: []
            };

            addMessageToDOM(fallbackMessage);
            saveMessage(fallbackMessage);
            scrollToBottom();
        }
    }

    // Add Message to DOM
function addMessageToDOM(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'Tôi' ? 'sent' : 'received'}`;
    messageElement.setAttribute('data-message-id', message.id);
    
    const mediaHTML = message.media ? message.media.map(media => `
        <div class="message-media">
            ${media.type === 'image' 
                ? `<img src="${media.url}" alt="Media">`
                : `<video src="${media.url}" controls></video>`
            }
        </div>
    `).join('') : '';

    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${message.sender}</span>
                <span class="message-time">${formatTime(message.timestamp)}</span>
                <button class="delete-btn" onclick="deleteMessage(${message.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="message-text">${message.content}</div>
            ${mediaHTML}
        </div>
    `;

    chatMessages.appendChild(messageElement);
}

    // Show/Remove Typing Indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'message received typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Handle Media Upload
    function handleMediaUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
                selectedMedia.push({
                    type: mediaType,
                    url: e.target.result
                });
                updateMediaPreview();
            }
            reader.readAsDataURL(file);
        });
    }

    // Update Media Preview
    function updateMediaPreview() {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'media-preview';
        
        selectedMedia.forEach((media, index) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                ${media.type === 'image' 
                    ? `<img src="${media.url}" alt="Preview">`
                    : `<video src="${media.url}" controls></video>`
                }
                <button class="remove-preview" onclick="removeMediaPreview(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        });

        const existingPreview = chatInput.parentElement.querySelector('.media-preview');
        if (existingPreview) existingPreview.remove();
        
        if (selectedMedia.length) {
            chatInput.parentElement.insertBefore(previewContainer, chatInput);
        }
    }

    // Load Messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        chatMessages.innerHTML = '';
        messages.forEach(message => addMessageToDOM(message));
        scrollToBottom();
    }

    // Save Message
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messages.push(message);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }

    // Utility Functions
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Remove Media Preview
    window.removeMediaPreview = function(index) {
        selectedMedia.splice(index, 1);
        updateMediaPreview();
    }

    // Initialize
    if (!isExpanded) {
        chatContent.style.display = 'none';
    }
});
// Delete Message
window.deleteMessage = function(messageId) {
    if (confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        const updatedMessages = messages.filter(m => m.id !== messageId);
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.remove();
        }
    }
}