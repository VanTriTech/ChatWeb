document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Mock user data
    const mockUsers = [
        { username: 'LanAuKimLou123', password: 'LanAuKimLou123' },
        { username: 'Admin', password: 'Admin' }
    ];

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

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (capsLockWarning.style.display === 'block') {
            alert('Vui lòng tắt caps lock');
            return;
        }

        const user = mockUsers.find((u) => u.username === username);
        if (!user) {
            if (mockUsers.some((u) => u.password === password)) {
                alert('Nhập sai tài khoản');
            } else {
                alert('Sai tài khoản và mật khẩu');
            }
        } else if (user.password !== password) {
            alert('Nhập sai mật khẩu');
        } else {
            // Show loading simulation
            const originalButtonText = event.target.querySelector('button').textContent;
            event.target.querySelector('button').textContent = 'Đang tải...';
            event.target.querySelector('button').disabled = true;

            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }, 3000);
        }
    });
});
