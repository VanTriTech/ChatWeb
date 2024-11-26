document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Hàm mã hóa string thành SHA-256
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Mock user data với mật khẩu đã được mã hóa
    const mockUsers = [
        { 
            username: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Admin
            password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Admin
            redirectTo: 'index.html' 
        },
        { 
            username: 'e5d6dc87d0a3d4c0c374ec7f5c8b16d3e850e24dd1fbf0e5b81c3783a4bc7f7a', // Admin1
            password: 'e5d6dc87d0a3d4c0c374ec7f5c8b16d3e850e24dd1fbf0e5b81c3783a4bc7f7a', // Admin1
            redirectTo: 'index1.html' 
        },
        { 
            username: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // LanAuKimLou123
            password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // LanAuKimLou123
            redirectTo: 'index.html' 
        }
    ];

    // Phần code cảnh báo Caps Lock
    const capsLockWarning = document.createElement('p');
    capsLockWarning.style.color = 'red';
    capsLockWarning.style.textAlign = 'center';
    capsLockWarning.textContent = 'Vui lòng tắt caps lock';
    capsLockWarning.style.display = 'none';
    loginForm.insertBefore(capsLockWarning, loginForm.firstChild);

    const checkCapsLock = (event) => {
        if (event.getModifierState && event.getModifierState('CapsLock')) {
            capsLockWarning.style.display = 'block';
        } else {
            capsLockWarning.style.display = 'none';
        }
    };

    document.getElementById('password').addEventListener('keyup', checkCapsLock);

    // Xử lý đăng nhập
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (capsLockWarning.style.display === 'block') {
            alert('Vui lòng tắt caps lock');
            return;
        }

        // Mã hóa input của người dùng
        const hashedUsername = await sha256(username);
        const hashedPassword = await sha256(password);

        const user = mockUsers.find((u) => u.username === hashedUsername);
        
        if (!user) {
            if (mockUsers.some((u) => u.password === hashedPassword)) {
                alert('Nhập sai tài khoản');
            } else {
                alert('Sai tài khoản và mật khẩu');
            }
        } else if (user.password !== hashedPassword) {
            alert('Nhập sai mật khẩu');
        } else {
            const button = event.target.querySelector('button');
            const originalButtonText = button.textContent;
            button.textContent = 'Đang tải...';
            button.disabled = true;

            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                // Lưu username gốc thay vì hash
                localStorage.setItem('currentUser', username);
                window.location.href = user.redirectTo;
            }, 3000);
        }
    });
});
