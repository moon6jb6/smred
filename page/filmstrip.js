/**
 * 胶片转场效果 — 旧电影黑白条纹闪过，0.8s
 * 用法：filmstripTransition(targetUrl, narrativeText)
 *   narrativeText: 可选，转场后在目标页面显示的叙事文字
 */
function filmstripTransition(targetUrl, narrativeText) {
    if (document.querySelector('.filmstrip-overlay')) return;

    // 如果有叙事文字，存入 sessionStorage
    if (narrativeText) {
        try { sessionStorage.setItem('filmstrip_narrative', narrativeText); } catch(e) {}
    }

    const overlay = document.createElement('div');
    overlay.className = 'filmstrip-overlay';
    overlay.innerHTML = `
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
        <div class="filmstrip-bar"></div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 700);
}

/**
 * 叙事过渡遮罩 — 在目标页面加载时调用
 * 检查 sessionStorage 中是否有叙事文字，有则显示黑屏+白字 2.5s
 * 用法：checkNarrativeTransition() — 放在页面 script 的开头
 */
function checkNarrativeTransition(callback) {
    let text = null;
    try { text = sessionStorage.getItem('filmstrip_narrative'); } catch(e) {}
    if (!text) { if (callback) callback(); return; }
    try { sessionStorage.removeItem('filmstrip_narrative'); } catch(e) {}

    // 创建叙事遮罩
    const overlay = document.createElement('div');
    overlay.className = 'narrative-overlay';
    overlay.innerHTML = `<div class="narrative-text">${text}</div>`;
    document.body.appendChild(overlay);

    // 淡入
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
    });

    // 2.5s 后淡出
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 800);
    }, 2500);
}

(function injectFilmstripCSS() {
    if (document.getElementById('filmstrip-css')) return;
    const style = document.createElement('style');
    style.id = 'filmstrip-css';
    style.textContent = `
        /* 胶片转场 */
        .filmstrip-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            pointer-events: none;
        }
        .filmstrip-bar {
            flex: 1;
            background: #000;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.1s ease;
        }
        .filmstrip-overlay.active .filmstrip-bar {
            transform: scaleX(1);
        }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(1) { transition-delay: 0s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(2) { transition-delay: 0.06s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(3) { transition-delay: 0.12s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(4) { transition-delay: 0.18s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(5) { transition-delay: 0.24s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(6) { transition-delay: 0.30s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(7) { transition-delay: 0.36s; }
        .filmstrip-overlay.active .filmstrip-bar:nth-child(8) { transition-delay: 0.42s; }

        /* 叙事过渡遮罩 */
        .narrative-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000;
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 1s ease;
        }
        .narrative-overlay.visible {
            opacity: 1;
        }
        .narrative-overlay.fade-out {
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        .narrative-text {
            font-family: 'Microsoft YaHei', 'Heiti SC', sans-serif;
            font-size: 1.3rem;
            color: rgba(255, 255, 255, 0.85);
            letter-spacing: 3px;
            line-height: 2;
            text-align: center;
            max-width: 80%;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
        }
        .narrative-overlay.visible .narrative-text {
            opacity: 1;
            transform: translateY(0);
        }
        @media (max-width: 768px) {
            .narrative-text {
                font-size: 1.05rem;
                letter-spacing: 2px;
            }
        }
        @media (max-width: 480px) {
            .narrative-text {
                font-size: 0.9rem;
                letter-spacing: 1px;
            }
        }
    `;
    document.head.appendChild(style);
})();
