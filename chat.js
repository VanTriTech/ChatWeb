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
    let messageTimeout;

    // API Key
    const GEMINI_API_KEY = 'AIzaSyDC2eRlff09hopH0Wb_j62ECNkwWpwgzVQ';
    const GEMINI_API_KEY_2 = 'AIzaSyDC2eRlff09hopH0Wb_j62ECNkwWpwgzVQ'; // Thêm dòng này

    // Backup responses
    const responses = [
        "Ừ, điều đó thú vị thật! 😊",
        "Thật hả? Kể thêm đi! 🤗",
        "Hihi, mình hiểu ý bạn rồi 😄",
        "Ôi, nghe hay quá! ✨",
        "Mình cũng nghĩ vậy đó 💕"
    ];
    const responses_2 = [
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
    async function getAIResponse(message, mediaUrls = []) {
    try {
        const prompt = `Bạn là Mỹ Ngọc, một cô gái 20 tuổi. Bạn và người chat là bạn thân từ nhỏ.

        Ngữ cảnh:
        - Các bạn là bạn thân thiết từ nhỏ
        - Bạn rất thông minh, hiểu biết nhiều lĩnh vực
        - Bạn đang học ngành Công nghệ thông tin
        - Bạn có kiến thức sâu rộng về lập trình, toán học và khoa học
        - Khi được hỏi về kiến thức, bạn sẽ trả lời chính xác và ngắn gọn
        - Nếu không chắc chắn về câu trả lời, hãy nói "T không chắc chắn về điều này"
        
        Quy tắc trả lời:
        - Luôn dùng "t" thay cho "tao", "m" thay cho "mày"
        - Viết tắt các từ phổ biến: không = k, gì = j, được = dc, biết = bít
        - Thêm emoji phù hợp với cảm xúc
        - Trả lời ngắn gọn (1-2 câu)
        - Thỉnh thoảng dùng tiếng lóng: "ô kê", "chill", "ez", "vip", "pro"
        - Thể hiện sự thân thiết qua cách nói chuyện
        - Khi trả lời câu hỏi kiến thức: phải chính xác, ngắn gọn và dễ hiểu
        
        ${mediaUrls.length > 0 ? 'Có ảnh/video được gửi kèm, hãy bình luận về nó.' : ''}
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
// Thêm hàm getAIResponse2 (sau hàm getAIResponse)
async function getAIResponse2(message, mediaUrls = []) {
    try {
        const prompt = `Bạn là Lisa, một cô gái 19 tuổi. Bạn và người chat là bạn thân từ nhỏ.

        Ngữ cảnh:
        - Các bạn là bạn thân thiết từ nhỏ
        - Bạn rất thông minh và năng động
        - Bạn đang học ngành Kinh tế
        - Bạn có kiến thức sâu rộng về kinh tế, xã hội và văn hóa
        - Bạn thích K-pop và anime
        - Khi được hỏi về kiến thức, bạn sẽ trả lời chính xác và ngắn gọn
        - Nếu không chắc chắn về câu trả lời, hãy nói "Sorry bestie, t k chắc lắm"
        
        Quy tắc trả lời:
        - Dùng ngôn ngữ thân mật, gần gũi
        - Thường xuyên dùng từ tiếng Anh như: omg, really, wow, bestie, lol
        - Viết tắt các từ phổ biến: không=k, gì=j, được=dc, biết=bít
        - Thêm emoji phù hợp với cảm xúc
        - Trả lời ngắn gọn (1-2 câu)
        - Thỉnh thoảng dùng tiếng lóng: xink, chill, ô kê, ez
        - Khi trả lời câu hỏi kiến thức: phải chính xác, ngắn gọn và dễ hiểu
        
        ${mediaUrls.length > 0 ? 'Có ảnh/video được gửi kèm, hãy bình luận về nó.' : ''}
        Hãy trả lời tin nhắn sau một cách tự nhiên nhất: "${message}"`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY_2}`,
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
        const mediaUrls = selectedMedia.map(media => media.url);
    
        // User message
        const userMessage = {
            id: Date.now(),
            content: content,
            sender: 'Benton Cato',
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
        // Random delay for first response
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // First bot response (Mỹ Ngọc)
        let myNgocResponse = await getAIResponse(content, mediaUrls);
        if (!myNgocResponse) {
            myNgocResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        const myNgocMessage = {
            id: Date.now(),
            content: myNgocResponse,
            sender: 'Mỹ Ngọc',
            timestamp: new Date().toISOString(),
            media: []
        };

        addMessageToDOM(myNgocMessage);
        saveMessage(myNgocMessage);
        scrollToBottom();

        // Random delay for second response
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Second bot response (Lisa)
        let lisaResponse = await getAIResponse2(content, mediaUrls);
        if (!lisaResponse) {
            lisaResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        const lisaMessage = {
            id: Date.now(),
            content: lisaResponse,
            sender: 'Lisa',
            timestamp: new Date().toISOString(),
            media: []
        };

        addMessageToDOM(lisaMessage);
        saveMessage(lisaMessage);
        scrollToBottom();

        // 50% chance for bots to respond to each other
        if (Math.random() < 0.5) {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            let myNgocToLisa = await getAIResponse(lisaResponse);
            if (myNgocToLisa) {
                const responseMessage = {
                    id: Date.now(),
                    content: myNgocToLisa,
                    sender: 'Mỹ Ngọc',
                    timestamp: new Date().toISOString(),
                    media: []
                };
                addMessageToDOM(responseMessage);
                saveMessage(responseMessage);
                scrollToBottom();
            }
        }

        if (Math.random() < 0.5) {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            let lisaToMyNgoc = await getAIResponse2(myNgocResponse);
            if (lisaToMyNgoc) {
                const responseMessage = {
                    id: Date.now(),
                    content: lisaToMyNgoc,
                    sender: 'Lisa',
                    timestamp: new Date().toISOString(),
                    media: []
                };
                addMessageToDOM(responseMessage);
                saveMessage(responseMessage);
                scrollToBottom();
            }
        }

    } catch (error) {
        console.error('Error:', error);
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
