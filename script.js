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
            likes: 0,
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

    // Add Post to DOM
    function addPostToDOM(post) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.setAttribute('data-post-id', post.id);

        const mediaHTML = post.media.length ? `
            <div class="post-media ${post.media.length === 1 ? 'single-media' : ''}">
                ${post.media.map(item => 
                    item.type === 'image' 
                        ? `<img src="${item.url}" alt="Post image">`
                        : `<video src="${item.url}" controls class="video-player">
                            <source src="${item.url}" type="video/mp4">
                           </video>`
                ).join('')}
            </div>
        ` : '';

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
                    <button class="action-button like-button" onclick="toggleLike(${post.id})">
                        <i class="far fa-heart"></i>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="action-button" onclick="toggleComments(${post.id})">
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${post.comments.length}</span>
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div class="comment-form">
                        <input type="text" class="comment-input" placeholder="Viết bình luận..." 
                               onkeypress="handleComment(event, ${post.id})">
                    </div>
                    <div class="comment-list"></div>
                </div>
            </div>
        `;

        postsContainer.insertBefore(postElement, postsContainer.firstChild);
        initializeVideoPlayers();
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
        const likeButton = document.querySelector(`[data-post-id="${postId}"] .like-button`);
        const likeCount = likeButton.querySelector('.like-count');
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === postId);
        
        if (likeButton.classList.contains('liked')) {
            post.likes--;
            likeButton.classList.remove('liked');
            likeButton.querySelector('i').className = 'far fa-heart';
        } else {
            post.likes++;
            likeButton.classList.add('liked');
            likeButton.querySelector('i').className = 'fas fa-heart';
        }
        
        likeCount.textContent = post.likes;
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    window.toggleComments = function(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }

    window.handleComment = function(event, postId) {
        if (event.key === 'Enter') {
            const input = event.target;
            const comment = input.value.trim();
            if (comment) {
                addComment(postId, comment);
                input.value = '';
            }
        }
    }

    function addComment(postId, content) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === postId);
        const comment = {
            id: Date.now(),
            content: content,
            author: {
                name: profileName,
                username: profileUsername,
                avatar: document.querySelector('.profile-avatar img').src
            },
            timestamp: new Date().toISOString()
        };
        
        post.comments.push(comment);
        localStorage.setItem('posts', JSON.stringify(posts));
        
        const commentList = document.querySelector(`#comments-${postId} .comment-list`);
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <img src="${comment.author.avatar}" alt="Avatar" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-name">${comment.author.name}</span>
                    <span class="comment-username">${comment.author.username}</span>
                    <span class="comment-time">${formatTime(comment.timestamp)}</span>
                </div>
                <p>${comment.content}</p>
            </div>
        `;
        commentList.appendChild(commentElement);
        
        // Update comment count
        const commentCount = document.querySelector(`[data-post-id="${postId}"] .comment-count`);
        commentCount.textContent = post.comments.length;
    }

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

    // Load saved posts
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.forEach(post => addPostToDOM(post));
    }

    // Initial load
    loadPosts();
});
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Chưa đăng nhập, chuyển hướng về login.html
        window.location.href = 'login.html';
    }
});
function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
        window.location.href = 'login.html'; // Chuyển hướng về trang đăng nhập
    }
}
