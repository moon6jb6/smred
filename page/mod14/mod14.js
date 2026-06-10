/**
 * Mod14 最后一步 — 冲锋→倒下→纪念
 * "失败即纪念"：每次冲锋必然倒下，但名字会被记住
 */

// 烈士数据（虚构但有历史依据的典型人物）
const MARTYRS = [
    { name: '陈树湘', origin: '湖南长沙', age: 29, last: '为苏维埃流尽最后一滴血' },
    { name: '刘仁堪', origin: '江西莲花', age: 34, last: '革命一定会胜利' },
    { name: '方志敏', origin: '江西弋阳', age: 36, last: '可爱的中国' },
    { name: '瞿秋白', origin: '江苏常州', age: 36, last: '此地甚好' },
    { name: '赵一曼', origin: '四川宜宾', age: 31, last: '未惜头颅新故国' },
    { name: '杨靖宇', origin: '河南确山', age: 35, last: '我们中国人都投降了，还有中国吗？' },
    { name: '左权', origin: '湖南醴陵', age: 37, last: '愿拼热血卫吾华' },
    { name: '张自忠', origin: '山东临清', age: 49, last: '为国家民族死之决心' },
    { name: '狼牙山五壮士', origin: '河北易县', age: 21, last: '打倒日本帝国主义' },
    { name: '董存瑞', origin: '河北怀来', age: 19, last: '为了新中国，前进！' },
    { name: '邱少云', origin: '重庆铜梁', age: 26, last: '' },
    { name: '黄继光', origin: '四川中江', age: 21, last: '' }
];

class Mod14LastStep {
    constructor() {
        this.memorialCount = 0;
        this.martyrIndex = 0;
        this.audioStarted = false;
        this.maxRounds = 3; // 3轮后显示纪念碑

        this.introScreen = document.getElementById('intro-screen');
        this.introText = document.getElementById('intro-text');
        this.startBtn = document.getElementById('start-btn');
        this.chargeScreen = document.getElementById('charge-screen');
        this.silhouette = document.getElementById('charge-silhouette');
        this.chargeText = document.getElementById('charge-text');
        this.heartbeatFlash = document.getElementById('heartbeat-flash');
        this.memorialScreen = document.getElementById('memorial-screen');
        this.lightDot = document.getElementById('light-dot');
        this.martyrName = document.getElementById('martyr-name');
        this.martyrInfo = document.getElementById('martyr-info');
        this.riseAgain = document.getElementById('rise-again');
        this.riseDot = document.getElementById('rise-dot');
        this.nameEcho = document.getElementById('name-echo');
        this.standOverlay = document.getElementById('stand-up-overlay');
        this.standSilhouette = document.getElementById('stand-silhouette');
        this.monumentScreen = document.getElementById('monument-screen');

        this.init();
    }

    init() {
        // 开场
        setTimeout(() => this.introText.classList.add('visible'), 500);
        setTimeout(() => this.startBtn.classList.add('visible'), 2000);

        this.startBtn.addEventListener('click', () => this.startCharge());
        this.riseDot.addEventListener('click', () => this.riseAgainHandler());

        // 纪念碑返回
        document.getElementById('monument-return').addEventListener('click', () => {
            if (typeof filmstripTransition === 'function') {
                filmstripTransition('../index.html', null);
            } else {
                window.location.href = '../index.html';
            }
        });
    }

    /** 初始化音频 */
    initAudio() {
        if (this.audioStarted) return;
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.init();
            this.audioStarted = true;
        }
    }

    /** 开始冲锋 */
    startCharge() {
        this.initAudio();
        this.introScreen.classList.add('fade-out');
        setTimeout(() => {
            this.introScreen.style.display = 'none';
            this.doCharge();
        }, 1000);
    }

    /** 冲锋过程 */
    doCharge() {
        this.chargeScreen.classList.add('active');
        this.silhouette.classList.add('visible');

        // 阶段1：起身（心跳渐起）
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.startHeartbeat(60);
        }

        // 阶段2：冲锋（心跳加速）
        setTimeout(() => {
            this.silhouette.classList.add('running');
            this.chargeText.textContent = '冲 锋';
            this.chargeText.classList.add('visible');
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.stopAll();
                AudioEngine.startHeartbeat(120);
            }
            // 屏幕震动
            document.body.style.animation = 'charge-shake 0.1s infinite';
        }, 2000);

        // 阶段3：心跳更快
        setTimeout(() => {
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.stopAll();
                AudioEngine.startHeartbeat(180);
            }
        }, 3500);

        // 阶段4：倒下（心跳骤停 + 血迹粒子）
        setTimeout(() => {
            this.silhouette.classList.remove('running');
            this.silhouette.classList.add('fallen');
            this.chargeText.textContent = '';
            document.body.style.animation = '';
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.stopAll();
            }
            // 心跳闪
            this.heartbeatFlash.classList.add('pulse');
            setTimeout(() => this.heartbeatFlash.classList.remove('pulse'), 300);
            // 血迹粒子爆发
            this.emitBloodSplatter();
        }, 5000);

        // 阶段5：寂静后进入纪念
        setTimeout(() => {
            this.chargeScreen.classList.remove('active');
            this.silhouette.classList.remove('visible', 'fallen');
            this.showMemorial();
        }, 6500);
    }

    /** 显示纪念 */
    showMemorial() {
        const martyr = MARTYRS[this.martyrIndex % MARTYRS.length];
        this.martyrIndex++;

        this.memorialScreen.classList.add('active');

        // 光点出现
        setTimeout(() => this.lightDot.classList.add('visible'), 500);

        // 光点扩展成光束
        setTimeout(() => this.lightDot.classList.add('expand'), 1500);

        // 姓名浮现
        setTimeout(() => {
            this.martyrName.textContent = martyr.name;
            this.martyrName.classList.add('visible');
        }, 2500);

        // 信息逐行显示
        setTimeout(() => {
            const lines = this.martyrInfo.querySelectorAll('.info-line');
            this.martyrInfo.classList.add('visible');
            lines[0].textContent = martyr.origin;
            lines[0].classList.add('visible');

            setTimeout(() => {
                lines[1].textContent = '牺牲时年仅 ' + martyr.age + ' 岁';
                lines[1].classList.add('visible');
            }, 800);

            setTimeout(() => {
                if (martyr.last) {
                    lines[2].textContent = '"' + martyr.last + '"';
                } else {
                    lines[2].textContent = '没有留下遗言';
                }
                lines[2].classList.add('visible');
            }, 1600);
        }, 3500);

        // 添加名字回响
        setTimeout(() => this.addNameEcho(martyr.name), 4000);

        // 显示"再起"按钮
        setTimeout(() => this.riseAgain.classList.add('visible'), 5500);

        // 更新浏览器标题
        this.memorialCount++;
        document.title = '你记住了 ' + this.memorialCount + ' 个名字 — 最后一步';
    }

    /** 添加名字回响 */
    addNameEcho(name) {
        const el = document.createElement('div');
        el.className = 'echo-name';
        el.textContent = name;
        el.style.left = (10 + Math.random() * 80) + '%';
        el.style.top = (10 + Math.random() * 80) + '%';
        this.nameEcho.appendChild(el);
        // 动画结束后清理DOM
        el.addEventListener('animationend', () => el.remove());
    }

    /** 再起 */
    riseAgainHandler() {
        // 隐藏纪念画面
        this.memorialScreen.classList.remove('active');
        this.riseAgain.classList.remove('visible');
        this.lightDot.classList.remove('visible', 'expand');
        this.martyrName.classList.remove('visible');
        this.martyrInfo.classList.remove('visible');
        this.martyrInfo.querySelectorAll('.info-line').forEach(l => l.classList.remove('visible'));

        // 检查是否应该结束（最后一轮前询问用户姓名）
        if (this.memorialCount >= this.maxRounds) {
            this.askUserName();
            return;
        }

        // 站起动画
        this.standOverlay.classList.add('active');
        setTimeout(() => this.standSilhouette.classList.add('rising'), 500);

        // 然后开始下一次冲锋
        setTimeout(() => {
            this.standOverlay.classList.remove('active');
            this.standSilhouette.classList.remove('rising');
            this.doCharge();
        }, 3000);
    }

    /** 血迹粒子 */
    emitBloodSplatter() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.7;
        const particles = [];

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 3 + Math.random() * 6,
                life: 1,
                decay: 0.01 + Math.random() * 0.01
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12;
                p.life -= p.decay;
                if (p.life > 0) {
                    alive = true;
                    ctx.globalAlpha = p.life * 0.7;
                    ctx.fillStyle = `hsl(${355 + Math.random() * 10}, 70%, ${25 + Math.random() * 15}%)`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            if (alive) requestAnimationFrame(animate);
            else canvas.remove();
        };
        requestAnimationFrame(animate);
    }

    /** 询问用户名字（最后一轮） */
    askUserName() {
        // 创建输入弹窗
        const modal = document.createElement('div');
        modal.className = 'name-ask-modal';
        modal.innerHTML = `
            <div class="name-ask-content">
                <p class="name-ask-text">最后一个名字，是你自己的。</p>
                <input type="text" class="name-ask-input" id="userNameInput" placeholder="你的名字" maxlength="10">
                <button class="name-ask-btn" id="userNameConfirm">刻下</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 50);

        const input = document.getElementById('userNameInput');
        input.focus();

        const confirm = () => {
            const name = input.value.trim() || '无名者';
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 500);
            // 用用户的名字作为最后一个烈士
            this.userMartyrName = name;
            this.showMonument();
        };

        document.getElementById('userNameConfirm').addEventListener('click', confirm);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirm(); });
    }

    /** 显示纪念碑 */
    showMonument() {
        // 填充名字
        const namesDiv = document.getElementById('monument-names');
        namesDiv.innerHTML = '';
        for (let i = 0; i < this.memorialCount; i++) {
            const martyr = MARTYRS[i % MARTYRS.length];
            const span = document.createElement('span');
            span.className = 'monument-name';
            span.textContent = martyr.name;
            namesDiv.appendChild(span);
        }

        // 用户名字作为最后一个
        if (this.userMartyrName) {
            const userSpan = document.createElement('span');
            userSpan.className = 'monument-name monument-name-user';
            userSpan.textContent = this.userMartyrName;
            namesDiv.appendChild(userSpan);
        }

        const totalCount = this.memorialCount + (this.userMartyrName ? 1 : 0);
        document.getElementById('monument-count').textContent =
            '你记住了 ' + totalCount + ' 个名字' + (this.userMartyrName ? '，最后一个是你自己' : '');

        this.monumentScreen.classList.add('active');

        // 保存进度
        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod14', { completed: true, names: totalCount });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    new Mod14LastStep();
});

// 充电shake动画注入
(function() {
    const style = document.createElement('style');
    style.textContent = '@keyframes charge-shake { 0%,100% { transform: translate(0); } 25% { transform: translate(-2px,1px); } 50% { transform: translate(2px,-1px); } 75% { transform: translate(-1px,2px); } }';
    document.head.appendChild(style);
})();
