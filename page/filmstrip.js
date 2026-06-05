/**
 * 胶片转场效果 — 旧电影黑白条纹闪过，0.8s
 * 用法：filmstripTransition(targetUrl)
 */
function filmstripTransition(targetUrl) {
    if (document.querySelector('.filmstrip-overlay')) return;
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

(function injectFilmstripCSS() {
    if (document.getElementById('filmstrip-css')) return;
    const style = document.createElement('style');
    style.id = 'filmstrip-css';
    style.textContent = `
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
    `;
    document.head.appendChild(style);
})();
