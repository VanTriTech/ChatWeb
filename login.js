(function() {
    let isLocked = false;
    
    // Hàm khóa trang với UI đáng sợ
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

        // Countdown đáng sợ
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
            
            // Thay đổi tần số để tạo hiệu ứng siren
            setInterval(() => {
                oscillator.frequency.setValueAtTime(
                    Math.sin(audio.currentTime * 2) * 50 + 100,
                    audio.currentTime
                );
            }, 100);

            setTimeout(() => oscillator.stop(), 15000);
        } catch(e) {}
    };

    // Chặn triệt để phím tắt
    document.addEventListener('keydown', function(e) {
        // Chặn F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            lockPage();
            return false;
        }
        
        // Chặn Ctrl+Shift+I/J/C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            e.stopPropagation();
            lockPage();
            return false;
        }
        
        // Chặn Ctrl+U
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
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

    // Kiểm tra DevTools mỗi 100ms
    setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            lockPage();
        }
    }, 100);

    // Kiểm tra ngay khi load trang
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        lockPage();
    }
})();
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const mockUsers = [
        { 
            username: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Admin
            password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Admin
            redirectTo: '/' // Thay đổi từ 'index.html' thành '/'
        },
        { 
            username: 'e5d6dc87d0a3d4c0c374ec7f5c8b16d3e850e24dd1fbf0e5b81c3783a4bc7f7a', // Admin1
            password: 'e5d6dc87d0a3d4c0c374ec7f5c8b16d3e850e24dd1fbf0e5b81c3783a4bc7f7a', // Admin1
            redirectTo: '/' // Thay đổi từ 'index1.html' thành '/'
        },
        { 
            username: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // LanAuKimLou123
            password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // LanAuKimLou123
            redirectTo: '/' // Thay đổi từ 'index.html' thành '/'
        }
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
        
        if (user && user.password === hashedPassword) {
            const button = event.target.querySelector('button');
            button.textContent = 'Đang tải...';
            button.disabled = true;
    
            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                // Chuyển hướng về URL gốc của Shop
                window.location.replace('https://vantritech.github.io/Shop/');
            }, 3000);
        }
    });
});
// Thêm event listener để xử lý trường hợp trang không tự chuyển hướng
window.addEventListener('storage', (e) => {
    if (e.key === 'isLoggedIn' && e.newValue === 'true') {
        window.location.replace('https://vantritech.github.io/Shop/');
    }
});
