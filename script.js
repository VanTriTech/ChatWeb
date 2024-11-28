(function() {
    let isLocked = false;
    
    // Hàm khóa trang với UI cảnh báo
    const lockPage = () => {
        if (isLocked) return;
        isLocked = true;

        document.documentElement.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                color: #ff0000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: monospace;
                z-index: 999999999;
            ">
                <div style="font-size: 4em; color: #ff0000; text-shadow: 0 0 10px #ff0000; animation: glitch 0.5s infinite;">
                    ⚠️ CRITICAL SECURITY VIOLATION ⚠️
                </div>
                <div style="font-size: 2em; margin: 20px 0; color: #ff3333; text-shadow: 0 0 5px #ff3333;">
                    UNAUTHORIZED SYSTEM MANIPULATION DETECTED
                </div>
                <div style="font-size: 1.5em; color: #ff6666; text-shadow: 0 0 5px #ff6666;">
                    SECURITY PROTOCOL INITIATED - ALL ACTIONS LOGGED
                </div>
                <div style="font-size: 1.2em; margin: 20px 0; color: #ff4444;">
                    <div>TRACKING IP: <span id="ip" style="color: #ff0000"></span></div>
                    <div>SYSTEM: ${navigator.platform}</div>
                    <div>BROWSER FINGERPRINT: ${navigator.userAgent}</div>
                    <div>TIMESTAMP: ${new Date().toISOString()}</div>
                </div>
                <div style="font-size: 1.8em; color: #ff0000; margin: 20px 0; animation: blink 1s infinite;">
                    ⚠️ BREACH REPORTED TO SECURITY TEAM ⚠️
                </div>
                <div id="countdown" style="font-size: 2em; color: #ff0000; margin-top: 20px;"></div>
            </div>
        `;

        // Thêm style cho animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0% { transform: translate(0) skew(0deg) }
                20% { transform: translate(-2px, 2px) skew(2deg) }
                40% { transform: translate(-2px, -2px) skew(-2deg) }
                60% { transform: translate(2px, 2px) skew(-2deg) }
                80% { transform: translate(2px, -2px) skew(2deg) }
                100% { transform: translate(0) skew(0deg) }
            }
            @keyframes blink {
                0% { opacity: 1 }
                50% { opacity: 0 }
                100% { opacity: 1 }
            }
        `;
        document.head.appendChild(style);

        // Log IP
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => {
                document.getElementById('ip').textContent = data.ip;
            });

        // Countdown
        let timeLeft = 15;
        const countdown = document.getElementById('countdown');
        const timer = setInterval(() => {
            countdown.textContent = `SYSTEM TERMINATION IN: ${timeLeft}s`;
            if (timeLeft <= 5) {
                countdown.style.textShadow = '0 0 20px #ff0000';
            }
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(timer);
                window.location.href = "about:blank";
            }
        }, 1000);

        // Âm thanh cảnh báo
        try {
            const audio = new AudioContext();
            const oscillator = audio.createOscillator();
            const gainNode = audio.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, audio.currentTime);
            gainNode.gain.setValueAtTime(0.3, audio.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(audio.destination);
            
            oscillator.start();
            
            setInterval(() => {
                oscillator.frequency.setValueAtTime(
                    Math.sin(audio.currentTime * 2) * 50 + 100,
                    audio.currentTime
                );
            }, 100);

            setTimeout(() => oscillator.stop(), 15000);
        } catch(e) {}
    };

    // Chặn phím tắt
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' || 
            e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
        ) {
            e.preventDefault();
            e.stopPropagation();
            lockPage();
            return false;
        }
    }, true);

    // Chặn chuột phải
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // Kiểm tra DevTools
    setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            lockPage();
        }
    }, 100);
})();
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const postInput = document.getElementById('post-input');
    const postButton = document.getElementById('post-button');
    const mediaInput = document.getElementById('media-input');
    const postsContainer = document.getElementById('posts-container');
    const mediaPreview = document.querySelector('.media-preview');
    const profileName = document.querySelector('.profile-name').textContent;
    const profileUsername = document.querySelector('.profile-username').textContent;
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    

    let selectedMedia = [];

    // Navigation Tabs
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.dataset.tab;
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetTab}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
    

    // Auto resize textarea
    postInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        updatePostButton();
    });

    // Media Upload Handler
    mediaInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
                selectedMedia.push({
                    type: mediaType,
                    url: e.target.result,
                    file: file
                });
                updateMediaPreview();
                updatePostButton();
            }
            reader.readAsDataURL(file);
        });
    });

    // Update Media Preview
    function updateMediaPreview() {
        mediaPreview.innerHTML = selectedMedia.map((media, index) => `
            <div class="preview-item">
                ${media.type === 'image' 
                    ? `<img src="${media.url}" alt="Preview">`
                    : `<video src="${media.url}" controls></video>`
                }
                <button class="remove-preview" onclick="removeMedia(${index})">×</button>
            </div>
        `).join('');
        mediaPreview.style.display = selectedMedia.length ? 'grid' : 'none';
    }

    // Remove Media
    window.removeMedia = function(index) {
        selectedMedia.splice(index, 1);
        updateMediaPreview();
        updatePostButton();
    }

    // Update Post Button State
    function updatePostButton() {
        postButton.disabled = !postInput.value.trim() && selectedMedia.length === 0;
    }

    // Create New Post
    postButton.addEventListener('click', createPost);

    async function createPost() {
        const content = postInput.value.trim();
        if (!content && selectedMedia.length === 0) return;

        const postId = Date.now();
        const post = {
            id: postId,
            content: content,
            author: {
                name: profileName,
                username: profileUsername,
                avatar: document.querySelector('.profile-avatar img').src
            },
            media: selectedMedia,
            reactions: {
                likes: 0,
                hearts: 0,
                angry: 0
            },
            userReactions: {}, // Lưu reaction của từng user
            comments: [],
            timestamp: new Date().toISOString()
        };

        // Add post to DOM
        addPostToDOM(post);

        // Save to localStorage
        savePost(post);

        // Reset form
        postInput.value = '';
        postInput.style.height = 'auto';
        selectedMedia = [];
        mediaPreview.style.display = 'none';
        mediaPreview.innerHTML = '';
        mediaInput.value = '';
        updatePostButton();
    }


    // Initialize Video Players
    function initializeVideoPlayers() {
        const videos = document.querySelectorAll('.video-player');
        videos.forEach(video => {
            if (!video.hasAttribute('data-initialized')) {
                video.setAttribute('data-initialized', 'true');
                
                // Add custom controls if needed
                video.addEventListener('play', function() {
                    // Handle play event
                });
                
                video.addEventListener('pause', function() {
                    // Handle pause event
                });
            }
        });
    }

    // Post Actions
    window.togglePostMenu = function(postId) {
        const menu = document.getElementById(`menu-${postId}`);
        menu.classList.toggle('active');
    }

    window.deletePost = function(postId) {
        if (confirm('Bạn có chắc muốn xóa bài đăng này?')) {
            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            const updatedPosts = posts.filter(p => p.id !== postId);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            
            const post = document.querySelector(`[data-post-id="${postId}"]`);
            post.remove();
        }
    }

    window.toggleLike = function(postId) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === postId);
        const currentUser = document.querySelector('.profile-username').textContent;
        
        if (!post.likes) post.likes = 0;
        if (!post.likedBy) post.likedBy = [];
        
        const likeButton = document.querySelector(`[data-post-id="${postId}"] .like-button`);
        const likeIcon = likeButton.querySelector('i');
        const likeCount = likeButton.querySelector('.like-count');
        
        if (post.likedBy.includes(currentUser)) {
            // Unlike
            post.likes--;
            post.likedBy = post.likedBy.filter(user => user !== currentUser);
            post.userLiked = false;
            likeButton.classList.remove('liked');
            likeIcon.className = 'far fa-heart';
        } else {
            // Like
            post.likes++;
            post.likedBy.push(currentUser);
            post.userLiked = true;
            likeButton.classList.add('liked');
            likeIcon.className = 'fas fa-heart';
            
            // Thêm hiệu ứng animation khi like
            addLikeAnimation(likeButton);
        }
        
        likeCount.textContent = post.likes;
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Lưu trạng thái hiển thị vào localStorage
        const commentStates = JSON.parse(localStorage.getItem('commentStates') || '{}');
        commentStates[postId] = isHidden;
        localStorage.setItem('commentStates', JSON.stringify(commentStates));
    };
// Thêm hiệu ứng animation khi like
function addLikeAnimation(button) {
    const heart = button.querySelector('i');
    heart.classList.add('like-animation');
    setTimeout(() => {
        heart.classList.remove('like-animation');
    }, 500);
}
    // Thêm hàm để khôi phục trạng thái comments khi load trang
function restoreCommentStates() {
    const commentStates = JSON.parse(localStorage.getItem('commentStates') || '{}');
    Object.entries(commentStates).forEach(([postId, isVisible]) => {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (commentsSection) {
            commentsSection.style.display = isVisible ? 'block' : 'none';
        }
    });
}

function loadPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer.firstChild) {
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    } else {
        postsContainer.appendChild(postElement);
    }
    // Khởi tạo các tính năng sau khi thêm post
    setupCommentCollapse(post.id);
    if (post.comments) {
        post.comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                setupReplyCollapse(comment.id);
            }
        });
    }
}

// Thay đổi phần xử lý comment input
window.handleComment = function(event, postId) {
    const input = event.target;
    
    // Nếu nhấn Shift + Enter thì cho phép xuống dòng
    if (event.key === 'Enter' && event.shiftKey) {
        return; // Cho phép hành vi mặc định (xuống dòng)
    }
    
    // Nếu chỉ nhấn Enter thì gửi comment
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng
        const comment = input.value.trim();
        if (comment) {
            addComment(postId, comment);
            input.value = '';
            input.style.height = 'auto'; // Reset chiều cao
        }
    }
};


// Sửa lại hàm addComment để xử lý custom comment
function addComment(postId, content) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    // Xử lý nội dung comment để tìm custom tags
    function processCommentContent(content) {
        const lines = content.trim().split('\n');
        let processedContent = '';
        let customName = '';
        let customAvatar = '';
        
        // Xử lý từng dòng theo thứ tự
        if (lines.length >= 3) {
            // Dòng 1: Nội dung bình luận
            processedContent = lines[0].trim();
            // Dòng 2: Tên người dùng (bỏ @ nếu có)
            customName = lines[1].trim().replace(/^@/, '');
            // Dòng 3: URL avatar
            if (lines[2].match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
                customAvatar = lines[2].trim();
            }
        } else {
            // Nếu không đủ 3 dòng, coi tất cả là nội dung
            processedContent = lines.join('\n').trim();
        }
        
        return {
            content: processedContent,
            customName: customName || null,
            customAvatar: customAvatar || null
        };
    }

    const processedComment = processCommentContent(content);
    
    const comment = {
        id: Date.now(),
        content: processedComment.content,
        author: {
            name: processedComment.customName || document.querySelector('.profile-name').textContent,
            username: document.querySelector('.profile-username').textContent,
            avatar: processedComment.customAvatar || document.querySelector('.profile-avatar img').src
        },
        timestamp: new Date().toISOString(),
        reactions: {
            likes: 0,
            hearts: 0,
            angry: 0
        },
        userReactions: {},
        replies: []
    };
        

        post.comments.unshift(comment); // Thêm comment mới vào đầu mảng
        localStorage.setItem('posts', JSON.stringify(posts));
        
        const commentList = document.querySelector(`#comments-${postId} .comment-list`);
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.setAttribute('data-comment-id', comment.id);
        commentElement.innerHTML = `
        <img src="${comment.author.avatar}" alt="Avatar" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-text-container">
                <span class="comment-name">${comment.author.name}</span>
                <p class="comment-text">${comment.content}</p>
            </div>
            <div class="comment-actions">
                <button class="like-btn" onclick="handleReaction(${postId}, ${comment.id}, 'likes')">
                    <i class="far fa-thumbs-up"></i>
                    <span class="reaction-count">${comment.reactions?.likes || 0}</span>
                </button>
                <button class="heart-btn" onclick="handleReaction(${postId}, ${comment.id}, 'hearts')">
                    <i class="far fa-heart"></i>
                    <span class="reaction-count">${comment.reactions?.hearts || 0}</span>
                </button>
                <button class="angry-btn" onclick="handleReaction(${postId}, ${comment.id}, 'angry')">
                    <i class="far fa-angry"></i>
                    <span class="reaction-count">${comment.reactions?.angry || 0}</span>
                </button>
                <button class="reply-button" onclick="toggleReplyForm(${postId}, ${comment.id})">
                    Phản hồi
                </button>
                <span class="comment-time">${formatTime(comment.timestamp)}</span>
            </div>
            <div class="comment-menu">
                <button class="comment-menu-button" onclick="toggleCommentMenu(${postId}, ${comment.id})">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
                <div class="comment-menu-dropdown" id="comment-menu-${comment.id}">
                    <div class="menu-item edit" onclick="editComment(${postId}, ${comment.id})">
                        <i class="fas fa-edit"></i>
                        Chỉnh sửa
                    </div>
                    <div class="menu-item delete" onclick="deleteComment(${postId}, ${comment.id})">
                        <i class="fas fa-trash"></i>
                        Xóa
                    </div>
                </div>
            </div>
        <div class="reply-form" id="reply-form-${comment.id}">
            <textarea class="reply-input" 
                      placeholder="Viết phản hồi..." 
                      onkeydown="handleReply(event, ${postId}, ${comment.id})"
                      oninput="autoResizeTextarea(this)"></textarea>
            </div>
            <div class="replies" id="replies-${comment.id}">
                ${comment.replies ? comment.replies.map(reply => `
                    <div class="reply-comment" data-reply-id="${reply.id}">
                        <img src="${reply.author.avatar}" alt="Avatar" class="comment-avatar">
                        <div class="reply-content">
                            <div class="reply-text-container">
                                <span class="comment-name">${reply.author.name}</span>
                                <p class="reply-text">${reply.content}</p>
                            </div>
                            <div class="comment-actions">
                                <button>Thích</button>
                                <button>Phản hồi</button>
                                <span class="comment-time">${formatTime(reply.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `;
    commentList.appendChild(commentElement);
    setupCommentCollapse(postId);
    // Thêm hàm autoResizeTextarea
window.autoResizeTextarea = function(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
};
    // Update comment count
    const commentCount = document.querySelector(`[data-post-id="${postId}"] .comment-count`);
    commentCount.textContent = post.comments.length;
}

    // Utility Functions
  // Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds
    
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
    return date.toLocaleDateString('vi-VN');
}

function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}



// Khai báo biến global cho image modal
let currentImageIndex = 0;
let currentImages = [];

function addPostToDOM(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.setAttribute('data-post-id', post.id);
    postElement.setAttribute('data-timestamp', post.timestamp);

    const mediaHTML = post.media && post.media.length ? generateMediaGrid(post.media) : '';
    const commentsHTML = post.comments ? post.comments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <img src="${comment.author.avatar}" alt="Avatar" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-text-container">
                    <span class="comment-name">${comment.author.name}</span>
                    <p class="comment-text">${comment.content}</p>
                </div>
                <div class="comment-actions">
                    <button class="like-btn" onclick="handleReaction(${post.id}, ${comment.id}, 'likes')">
                        <i class="far fa-thumbs-up"></i>
                        <span class="reaction-count">${comment.reactions?.likes || 0}</span>
                    </button>
                    <button class="heart-btn" onclick="handleReaction(${post.id}, ${comment.id}, 'hearts')">
                        <i class="far fa-heart"></i>
                        <span class="reaction-count">${comment.reactions?.hearts || 0}</span>
                    </button>
                    <button class="angry-btn" onclick="handleReaction(${post.id}, ${comment.id}, 'angry')">
                        <i class="far fa-angry"></i>
                        <span class="reaction-count">${comment.reactions?.angry || 0}</span>
                    </button>
                    <button class="reply-button" onclick="toggleReplyForm(${post.id}, ${comment.id})">
                        Phản hồi
                    </button>
                    <span class="comment-time">${formatTime(comment.timestamp)}</span>
                </div>
                <div class="comment-menu">
                    <button class="comment-menu-button" onclick="toggleCommentMenu(${post.id}, ${comment.id})">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <div class="comment-menu-dropdown" id="comment-menu-${comment.id}">
                        <div class="menu-item edit" onclick="editComment(${post.id}, ${comment.id})">
                            <i class="fas fa-edit"></i>
                            Chỉnh sửa
                        </div>
                        <div class="menu-item delete" onclick="deleteComment(${post.id}, ${comment.id})">
                            <i class="fas fa-trash"></i>
                            Xóa
                        </div>
                    </div>
                </div>
                <div class="reply-form" id="reply-form-${comment.id}">
                    <input type="text" class="reply-input" 
                           placeholder="Viết phản hồi..." 
                           onkeypress="handleReply(event, ${post.id}, ${comment.id})">
                </div>
                <div class="replies" id="replies-${comment.id}">
                    ${comment.replies ? comment.replies.map(reply => `
                        <div class="reply-comment" data-reply-id="${reply.id}">
                            <img src="${reply.author.avatar}" alt="Avatar" class="reply-avatar">
                            <div class="reply-content">
                                <div class="reply-text-container">
                                    <span class="comment-name">${reply.author.name}</span>
                                    <span class="reply-target">@${comment.author.name}</span>
                                    <p class="reply-text">${reply.content}</p>
                                </div>
                                <div class="comment-actions">
                                    <button class="like-btn" onclick="handleReaction(${post.id}, ${reply.id}, 'likes')">
                                        <i class="far fa-thumbs-up"></i>
                                        <span class="reaction-count">${reply.reactions?.likes || 0}</span>
                                    </button>
                                    <button class="heart-btn" onclick="handleReaction(${post.id}, ${reply.id}, 'hearts')">
                                        <i class="far fa-heart"></i>
                                        <span class="reaction-count">${reply.reactions?.hearts || 0}</span>
                                    </button>
                                    <button class="angry-btn" onclick="handleReaction(${post.id}, ${reply.id}, 'angry')">
                                        <i class="far fa-angry"></i>
                                        <span class="reaction-count">${reply.reactions?.angry || 0}</span>
                                    </button>
                                    <span class="comment-time">${formatTime(reply.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        </div>
    `).join('') : '';

    postElement.innerHTML = `
        <img src="${post.author.avatar}" alt="Avatar" class="post-avatar">
        <div class="post-content">
            <div class="post-header">
                <div class="post-info">
                    <span class="post-name">${post.author.name}</span>
                    <span class="post-username">${post.author.username}</span>
                    <span class="post-time">${formatTime(post.timestamp)}</span>
                </div>
                <div class="post-menu">
                    <button class="post-menu-button" onclick="togglePostMenu(${post.id})">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
        <div class="post-menu-dropdown" id="menu-${post.id}">
            <div class="post-menu-item edit" onclick="editPost(${post.id})">
                <i class="fas fa-edit"></i>
                Chỉnh sửa
            </div>
            <div class="post-menu-item delete" onclick="deletePost(${post.id})">
                <i class="fas fa-trash"></i>
                Xóa
                        </div>
                    </div>
                </div>
            </div>
            ${post.content ? `<p class="post-text">${post.content}</p>` : ''}
            ${mediaHTML}
    <div class="post-actions">
        <button class="action-button like-button ${post.userLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            <i class="${post.userLiked ? 'fas' : 'far'} fa-heart"></i>
            <span class="like-count">${post.likes || 0}</span>
        </button>
        <button class="action-button like2-button ${post.userLiked2 ? 'liked' : ''}" onclick="toggleLike2(${post.id})">
            <i class="${post.userLiked2 ? 'fas' : 'far'} fa-thumbs-up"></i>
            <span class="like2-count">${post.likes2 || 0}</span>
        </button>
            <button class="action-button" onclick="toggleComments(${post.id})">
                <i class="far fa-comment"></i>
                <span class="comment-count">${post.comments ? post.comments.length : 0}</span>
            </button>
        </div>
            <div class="comments-section" id="comments-${post.id}">
                <div class="comment-form">
            <textarea class="comment-input" 
                      placeholder="Viết bình luận..." 
                      onkeydown="handleComment(event, ${post.id})"
                      oninput="autoResizeTextarea(this)"></textarea>
                </div>
                <div class="comment-list">
                    ${commentsHTML}
                </div>
            </div>
        </div>
    `;

    postsContainer.insertBefore(postElement, postsContainer.firstChild);
}


// Xóa định nghĩa cũ của generateMediaGrid và chỉ giữ lại phiên bản này
function generateMediaGrid(mediaItems) {
        if (!mediaItems.length) return '';

        const imageItems = mediaItems.filter(item => item.type === 'image');
        const videoItems = mediaItems.filter(item => item.type === 'video');

        let gridClass = getMediaGridClass(mediaItems.length);
        let html = `<div class="post-media ${gridClass}">`;

        // Xử lý videos
        videoItems.forEach(video => {
            html += `
                <div class="video-container">
                    <video src="${video.url}" controls></video>
                </div>
            `;
        });

        // Xử lý tất cả ảnh, không giới hạn số lượng
        const imageUrls = imageItems.map(img => img.url);
        imageItems.forEach((image, index) => {
            const imageData = encodeURIComponent(JSON.stringify(imageUrls));
            html += `
                <div class="image-container" onclick="openImageModal('${image.url}', ${index}, '${imageData}')">
                    <img src="${image.url}" alt="Post image">
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function getMediaGridClass(count) {
        if (count === 1) return 'single-image';
        if (count === 2) return 'two-images';
        if (count === 3) return 'three-images';
        if (count >= 4) return 'multiple-images';
    }

// Sửa lại hàm openImageModal
window.openImageModal = function(imageUrl, index, imagesArray) {
    // Parse mảng ảnh từ string JSON
    currentImages = JSON.parse(imagesArray);
    currentImageIndex = index;

    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${imageUrl}" class="modal-image" alt="Full size image">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            ${currentImages.length > 1 ? `
                <div class="modal-nav">
                    <button onclick="changeImage(-1)"><i class="fas fa-chevron-left"></i></button>
                    <button onclick="changeImage(1)"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="modal-counter">${currentImageIndex + 1} / ${currentImages.length}</div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

    window.changeImage = function(direction) {
        currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
        const modalImage = document.querySelector('.modal-image');
        const modalCounter = document.querySelector('.modal-counter');
        
        modalImage.src = currentImages[currentImageIndex].url;
        modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    window.closeModal = function() {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Thêm keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.image-modal')) {
            switch(e.key) {
                case 'ArrowLeft':
                    changeImage(-1);
                    break;
                case 'ArrowRight':
                    changeImage(1);
                    break;
                case 'Escape':
                    closeModal();
                    break;
            }
        }
    });

    // Initial load
    loadPosts();
});

// Thêm hàm xóa bình luận
window.deleteComment = function(postId, commentId) {
    if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
            // Lọc bỏ comment cần xóa
            posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId);
            
            // Cập nhật localStorage
            localStorage.setItem('posts', JSON.stringify(posts));
            
            // Xóa comment khỏi DOM
            const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
            if (commentElement) {
                commentElement.remove();
            }
            
            // Cập nhật số lượng comments
            const commentCount = document.querySelector(`[data-post-id="${postId}"] .comment-count`);
            commentCount.textContent = posts[postIndex].comments.length;
        }
    }
};

// Thêm hàm sửa bình luận
window.editComment = function(postId, commentId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    const comment = post.comments.find(c => c.id === commentId);
    
    if (comment) {
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"] .comment-text`);
        const currentContent = comment.content;
        
        // Tạo input để chỉnh sửa
        const editInput = document.createElement('textarea');
        editInput.value = currentContent;
        editInput.className = 'edit-comment-input';
        
        // Tạo div chứa các nút
        const actionButtons = document.createElement('div');
        actionButtons.className = 'edit-comment-actions';
        actionButtons.innerHTML = `
            <button class="save-edit">Lưu</button>
            <button class="cancel-edit">Hủy</button>
        `;
        
        // Thay thế text bằng input
        commentElement.replaceWith(editInput);
        editInput.parentNode.insertBefore(actionButtons, editInput.nextSibling);
        
        // Focus vào input
        editInput.focus();
        
        // Xử lý nút Lưu
        actionButtons.querySelector('.save-edit').addEventListener('click', function() {
            const newContent = editInput.value.trim();
            if (newContent) {
                // Cập nhật trong localStorage
                comment.content = newContent;
                localStorage.setItem('posts', JSON.stringify(posts));
                
                // Cập nhật UI
                const newText = document.createElement('p');
                newText.className = 'comment-text';
                newText.textContent = newContent;
                editInput.replaceWith(newText);
                actionButtons.remove();
            }
        });
        
        // Xử lý nút Hủy
        actionButtons.querySelector('.cancel-edit').addEventListener('click', function() {
            const newText = document.createElement('p');
            newText.className = 'comment-text';
            newText.textContent = currentContent;
            editInput.replaceWith(newText);
            actionButtons.remove();
        });
    }
};
// Kiểm tra đăng nhập và URL khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Chưa đăng nhập, chuyển về trang login
        window.location.replace('https://vantritech.github.io/Shop/login.html');
        return;
    }
    
    // Kiểm tra và sửa URL nếu cần
    normalizeURL();
});

// Sửa hàm handleLogout
function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.replace('https://vantritech.github.io/Shop/login.html');
    }
}
// Thêm hàm xử lý reaction
window.handleReaction = function(postId, commentId, reactionType) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    const comment = post.comments.find(c => c.id === commentId);
    
    // Khởi tạo reactions nếu chưa có
    if (!comment.reactions) {
        comment.reactions = { likes: 0, hearts: 0, angry: 0 };
    }
    // Xử lý tăng/giảm reaction dựa vào loại click
    if (event.button === 0) { // Click chuột trái
        comment.reactions[reactionType]++;
    } else if (event.button === 2) { // Click chuột phải
        if (comment.reactions[reactionType] > 0) {
            comment.reactions[reactionType]--;
        }
    }
    
    const currentUser = document.querySelector('.profile-username').textContent;
    
    // Xử lý reaction
    if (comment.userReactions[currentUser] === reactionType) {
        // Nếu đã reaction loại này rồi thì bỏ reaction
        comment.reactions[reactionType]--;
        delete comment.userReactions[currentUser];
    } else {
        // Nếu chưa reaction hoặc reaction khác loại
        if (comment.userReactions[currentUser]) {
            // Giảm reaction cũ
            comment.reactions[comment.userReactions[currentUser]]--;
        }
        // Tăng reaction mới
        comment.reactions[reactionType]++;
        comment.userReactions[currentUser] = reactionType;
    }
    
    // Lưu vào localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Cập nhật UI
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (commentElement) {
        // Cập nhật số lượng
        const reactionButton = commentElement.querySelector(`.${reactionType.slice(0, -1)}-btn`);
        const countElement = reactionButton.querySelector('.reaction-count');
        countElement.textContent = comment.reactions[reactionType];
        
        // Cập nhật trạng thái active
        const allButtons = commentElement.querySelectorAll('.comment-actions button');
        allButtons.forEach(btn => {
            if (btn.classList.contains('like-btn') || 
                btn.classList.contains('heart-btn') || 
                btn.classList.contains('angry-btn')) {
                btn.classList.remove('active');
            }
        });
        
        if (comment.userReactions[currentUser]) {
            const activeButton = commentElement.querySelector(
                `.${comment.userReactions[currentUser].slice(0, -1)}-btn`
            );
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
};

// Thêm hàm để khôi phục trạng thái reaction khi load trang
function restoreReactionStates() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = document.querySelector('.profile-username').textContent;
    
    posts.forEach(post => {
        post.comments.forEach(comment => {
            if (comment.userReactions && comment.userReactions[currentUser]) {
                const reactionType = comment.userReactions[currentUser];
                const commentElement = document.querySelector(`[data-comment-id="${comment.id}"]`);
                if (commentElement) {
                    const button = commentElement.querySelector(
                        `.${reactionType.slice(0, -1)}-btn`
                    );
                    if (button) {
                        button.classList.add('active');
                    }
                }
            }
        });
    });
}

// Thêm hàm toggleCommentMenu
window.toggleCommentMenu = function(postId, commentId) {
    const menu = document.getElementById(`comment-menu-${commentId}`);
    if (!menu) return;
    
    // Đóng tất cả các menu khác
    document.querySelectorAll('.comment-menu-dropdown.active').forEach(m => {
        if (m.id !== `comment-menu-${commentId}`) {
            m.classList.remove('active');
        }
    });
    
    menu.classList.toggle('active');
    
    // Đóng menu khi click ra ngoài
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && 
            !e.target.closest('.comment-menu-button')) {
            menu.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    };
    
    // Xóa event listener cũ nếu có
    document.removeEventListener('click', closeMenu);
    // Thêm event listener mới
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
    
    // Ngăn chặn sự kiện click lan ra ngoài
    event.stopPropagation();
};
// Thêm các hàm xử lý reply
window.toggleReplyForm = function(postId, commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    replyForm.classList.toggle('active');
    if (replyForm.classList.contains('active')) {
        replyForm.querySelector('input').focus();
    }
};

window.handleReply = function(event, postId, commentId) {
    const input = event.target;
    
    // Nếu nhấn Shift + Enter thì cho phép xuống dòng
    if (event.key === 'Enter' && event.shiftKey) {
        return true; // Cho phép xuống dòng
    }
    
    // Nếu chỉ nhấn Enter thì gửi reply
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng
        const content = input.value.trim();
        if (content) {
            addReply(postId, commentId, content);
            input.value = '';
        }
    }
};


function addReply(postId, commentId, content) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    const comment = post.comments.find(c => c.id === commentId);
    
    if (!comment.replies) {
        comment.replies = [];
    }
    
    const reply = {
        id: Date.now(),
        content: content,
        author: {
            name: document.querySelector('.profile-name').textContent,
            username: document.querySelector('.profile-username').textContent,
            avatar: document.querySelector('.profile-avatar img').src
        },
        timestamp: new Date().toISOString(),
        reactions: {
            likes: 0,
            hearts: 0,
            angry: 0
        }
    };
    
    comment.replies.push(reply);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    const repliesContainer = document.getElementById(`replies-${commentId}`);
    const replyElement = document.createElement('div');
    replyElement.className = 'reply-comment';
    replyElement.setAttribute('data-reply-id', reply.id);
    
    replyElement.innerHTML = `
        <img src="${reply.author.avatar}" alt="Avatar" class="reply-avatar">
        <div class="reply-content">
            <div class="reply-text-container">
                <span class="comment-name">${reply.author.name}</span>
                <span class="reply-target">@${comment.author.name}</span>
                <p class="reply-text">${content}</p>
            </div>
            <div class="comment-actions">
                <button class="like-btn" onclick="handleReaction(${postId}, ${reply.id}, 'likes')">
                    <i class="far fa-thumbs-up"></i>
                    <span class="reaction-count">0</span>
                </button>
                <button class="heart-btn" onclick="handleReaction(${postId}, ${reply.id}, 'hearts')">
                    <i class="far fa-heart"></i>
                    <span class="reaction-count">0</span>
                </button>
                <button class="angry-btn" onclick="handleReaction(${postId}, ${reply.id}, 'angry')">
                    <i class="far fa-angry"></i>
                    <span class="reaction-count">0</span>
                </button>
                <span class="comment-time">Vừa xong</span>
            </div>
        </div>
    `;
    
    if (repliesContainer.firstChild) {
        repliesContainer.insertBefore(replyElement, repliesContainer.firstChild);
    } else {
        repliesContainer.appendChild(replyElement);
    }
    
    setupReplyCollapse(commentId);
}

// Sửa lại hàm handleReaction để xử lý cả replies
window.handleReaction = function(postId, targetId, reactionType) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    // Tìm target (có thể là comment hoặc reply)
    let target = null;
    let isReply = false;
    
    // Tìm trong comments
    const comment = post.comments.find(c => c.id === targetId);
    if (comment) {
        target = comment;
    } else {
        // Tìm trong replies
        for (let comment of post.comments) {
            if (comment.replies) {
                const reply = comment.replies.find(r => r.id === targetId);
                if (reply) {
                    target = reply;
                    isReply = true;
                    break;
                }
            }
        }
    }
    
    if (!target) return;
    
    // Khởi tạo reactions nếu chưa có
    if (!target.reactions) {
        target.reactions = { likes: 0, hearts: 0, angry: 0 };
    }
    if (!target.userReactions) {
        target.userReactions = {};
    }
    
    const currentUser = document.querySelector('.profile-username').textContent;
    
    // Xử lý reaction
    if (target.userReactions[currentUser] === reactionType) {
        // Nếu đã reaction loại này rồi thì bỏ reaction
        target.reactions[reactionType]--;
        delete target.userReactions[currentUser];
    } else {
        // Nếu chưa reaction hoặc reaction khác loại
        if (target.userReactions[currentUser]) {
            // Giảm reaction cũ
            target.reactions[target.userReactions[currentUser]]--;
        }
        // Tăng reaction mới
        target.reactions[reactionType]++;
        target.userReactions[currentUser] = reactionType;
    }
    
    // Lưu vào localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Cập nhật UI
    const targetElement = document.querySelector(
        isReply ? `[data-reply-id="${targetId}"]` : `[data-comment-id="${targetId}"]`
    );
    
    if (targetElement) {
        // Cập nhật số lượng
        const reactionButton = targetElement.querySelector(`.${reactionType.slice(0, -1)}-btn`);
        const countElement = reactionButton.querySelector('.reaction-count');
        countElement.textContent = target.reactions[reactionType];
        
        // Cập nhật trạng thái active
        const allButtons = targetElement.querySelectorAll('.comment-actions button');
        allButtons.forEach(btn => {
            if (btn.classList.contains('like-btn') || 
                btn.classList.contains('heart-btn') || 
                btn.classList.contains('angry-btn')) {
                btn.classList.remove('active');
            }
        });
        
        if (target.userReactions[currentUser]) {
            const activeButton = targetElement.querySelector(
                `.${target.userReactions[currentUser].slice(0, -1)}-btn`
            );
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
};

// Thêm biến để theo dõi số comments đang hiển thị
let visibleCommentsCount = {};

function setupCommentCollapse(postId) {
    const commentList = document.querySelector(`#comments-${postId} .comment-list`);
    const comments = Array.from(commentList.querySelectorAll('.comment'));
    
    // Khởi tạo số comments hiển thị cho post này
    if (!visibleCommentsCount[postId]) {
        visibleCommentsCount[postId] = 3;
    }
    
    if (comments.length > 3) {
        // Sắp xếp comments từ mới đến cũ
        comments.sort((a, b) => {
            const timeA = new Date(a.getAttribute('data-timestamp'));
            const timeB = new Date(b.getAttribute('data-timestamp'));
            return timeB - timeA;
        });
        
        // Ẩn/hiện comments dựa trên số lượng hiện tại
        comments.forEach((comment, index) => {
            if (index >= visibleCommentsCount[postId]) {
                comment.classList.add('hidden');
            } else {
                comment.classList.remove('hidden');
            }
        });
        
        // Xóa nút "Xem thêm" cũ nếu có
        const oldShowMoreBtn = commentList.querySelector('.show-more-comments');
        if (oldShowMoreBtn) {
            oldShowMoreBtn.remove();
        }
        
        // Thêm nút "Xem thêm" nếu còn comments ẩn
        if (comments.length > visibleCommentsCount[postId]) {
            const remainingCount = comments.length - visibleCommentsCount[postId];
            const showMoreBtn = document.createElement('div');
            showMoreBtn.className = 'show-more-comments';
            showMoreBtn.innerHTML = `Xem thêm ${Math.min(3, remainingCount)} bình luận`;
            
            showMoreBtn.onclick = function() {
                // Tăng số lượng comments hiển thị thêm 3
                visibleCommentsCount[postId] += 3;
                setupCommentCollapse(postId);
            };
            
            // Chèn nút sau comment cuối cùng đang hiển thị
            const lastVisibleComment = comments[visibleCommentsCount[postId] - 1];
            if (lastVisibleComment) {
                lastVisibleComment.parentNode.insertBefore(showMoreBtn, lastVisibleComment.nextSibling);
            }
        }
    }
}

// Tương tự cho replies
let visibleRepliesCount = {};

function setupReplyCollapse(commentId) {
    const repliesContainer = document.getElementById(`replies-${commentId}`);
    const replies = Array.from(repliesContainer.querySelectorAll('.reply-comment'));
    
    if (!visibleRepliesCount[commentId]) {
        visibleRepliesCount[commentId] = 3;
    }
    
    if (replies.length > 3) {
        replies.sort((a, b) => {
            const timeA = new Date(a.getAttribute('data-timestamp'));
            const timeB = new Date(b.getAttribute('data-timestamp'));
            return timeB - timeA;
        });
        
        replies.forEach((reply, index) => {
            if (index >= visibleRepliesCount[commentId]) {
                reply.classList.add('hidden');
            } else {
                reply.classList.remove('hidden');
            }
        });
        
        const oldShowMoreBtn = repliesContainer.querySelector('.show-more-replies');
        if (oldShowMoreBtn) {
            oldShowMoreBtn.remove();
        }
        
        if (replies.length > visibleRepliesCount[commentId]) {
            const remainingCount = replies.length - visibleRepliesCount[commentId];
            const showMoreBtn = document.createElement('div');
            showMoreBtn.className = 'show-more-replies';
            showMoreBtn.innerHTML = `Xem thêm ${Math.min(3, remainingCount)} phản hồi`;
            
            showMoreBtn.onclick = function() {
                visibleRepliesCount[commentId] += 3;
                setupReplyCollapse(commentId);
            };
            
            const lastVisibleReply = replies[visibleRepliesCount[commentId] - 1];
            if (lastVisibleReply) {
                lastVisibleReply.parentNode.insertBefore(showMoreBtn, lastVisibleReply.nextSibling);
            }
        }
    }
}

// Thêm hàm editPost
window.editPost = function(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        const postText = postElement.querySelector('.post-text');
        const currentContent = post.content || '';
        
        // Tạo form chỉnh sửa
        const editForm = document.createElement('div');
        editForm.className = 'edit-post-form';
        editForm.innerHTML = `
            <textarea class="edit-post-input">${currentContent}</textarea>
            <div class="edit-post-actions">
                <button class="save-edit">Lưu</button>
                <button class="cancel-edit">Hủy</button>
            </div>
        `;
        
        // Thay thế nội dung cũ bằng form
        if (postText) {
            postText.replaceWith(editForm);
        } else {
            postElement.querySelector('.post-content').insertBefore(
                editForm,
                postElement.querySelector('.post-media')
            );
        }
        
        // Auto resize textarea
        const textarea = editForm.querySelector('textarea');
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.focus();
        
        // Xử lý nút Lưu
        editForm.querySelector('.save-edit').addEventListener('click', function() {
            const newContent = textarea.value.trim();
            post.content = newContent;
            localStorage.setItem('posts', JSON.stringify(posts));
            
            // Cập nhật UI
            editForm.replaceWith(createPostText(newContent));
        });
        
        // Xử lý nút Hủy
        editForm.querySelector('.cancel-edit').addEventListener('click', function() {
            editForm.replaceWith(createPostText(currentContent));
        });
    }
};

// Hàm tạo element post text
function createPostText(content) {
    if (!content) return document.createElement('div');
    const postText = document.createElement('p');
    postText.className = 'post-text';
    postText.textContent = content;
    return postText;
}
window.toggleLike2 = function(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    const currentUser = document.querySelector('.profile-username').textContent;
    
    if (!post.likes2) post.likes2 = 0;
    if (!post.liked2By) post.liked2By = [];
    
    const like2Button = document.querySelector(`[data-post-id="${postId}"] .like2-button`);
    const like2Icon = like2Button.querySelector('i');
    const like2Count = like2Button.querySelector('.like2-count');
    
    if (post.liked2By.includes(currentUser)) {
        // Unlike
        post.likes2--;
        post.liked2By = post.liked2By.filter(user => user !== currentUser);
        post.userLiked2 = false;
        like2Button.classList.remove('liked');
        like2Icon.className = 'far fa-thumbs-up';
    } else {
        // Like
        post.likes2++;
        post.liked2By.push(currentUser);
        post.userLiked2 = true;
        like2Button.classList.add('liked');
        like2Icon.className = 'fas fa-thumbs-up';
        
        // Thêm hiệu ứng animation khi like
        addLike2Animation(like2Button);
    }
    
    like2Count.textContent = post.likes2;
    localStorage.setItem('posts', JSON.stringify(posts));
};

// Thêm hiệu ứng animation cho like2
function addLike2Animation(button) {
    const thumbsUp = button.querySelector('i');
    thumbsUp.classList.add('like-animation');
    setTimeout(() => {
        thumbsUp.classList.remove('like-animation');
    }, 500);
}
