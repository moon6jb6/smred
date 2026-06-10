/**
 * Mod8 暗线 — 黑暗潜伏 + 元游戏三层揭示
 * 核心机制：
 *   层1 - 黑暗探索：光源跟随鼠标/手指，发现隐藏线索
 *   层2 - 故事拼合：每发现一个线索，解锁一段故事
 *   层3 - 元游戏：页面"故障"→ 假崩溃 → 真相揭示
 */

const CLUES = [
    {
        type: 'text', x: '15%', y: '20%',
        content: '1931年4月，顾顺章叛变。上海地下党组织面临灭顶之灾。',
        story: '白色恐怖笼罩上海。每天都有同志被捕，每天都有人消失。'
    },
    {
        type: 'photo', x: '70%', y: '15%', icon: '📷',
        content: '一张模糊的合影 — 中央特科成员',
        story: '他们没有名字，只有代号。代号背后，是一群把生死置之度外的人。'
    },
    {
        type: 'code', x: '30%', y: '55%',
        content: '密电：今夜转移，销毁一切文件。——影子',
        story: '"影子"是潜伏在国民党情报机关的共产党员。他的每一条情报，都可能改变历史。'
    },
    {
        type: 'object', x: '80%', y: '45%', icon: '🔑',
        content: '一把锈迹斑斑的钥匙 — 打开保险柜用',
        story: '保险柜里存放着党员名单。如果落入敌手，整个组织将被连根拔起。'
    },
    {
        type: 'text', x: '50%', y: '75%',
        content: '钱壮飞在48小时内通知所有相关同志转移。与死神赛跑。',
        story: '钱壮飞，中共情报史上最传奇的人物之一。他截获了顾顺章叛变的密电，冒死通知组织。'
    },
    {
        type: 'code', x: '20%', y: '80%',
        content: '代号"医生"已安全撤离。代号"裁缝"牺牲。',
        story: '有人活下来了，有人没有。活着的人继续潜伏，牺牲的人连真名都不能刻在墓碑上。'
    },
    {
        type: 'photo', x: '60%', y: '35%', icon: '📜',
        content: '一份用米汤写的密信 — 只有用碘酒才能显现',
        story: '看不见的文字，看不见的人。他们用生命书写了一部无人知晓的历史。'
    },
    {
        type: 'object', x: '40%', y: '30%', icon: '⌚',
        content: '一块怀表，表盖内侧刻着"忍"字',
        story: '忍，不是软弱。是在黑暗中等待黎明的勇气。是明知可能等不到黎明，依然选择等待。'
    }
];

const HEROES = [
    { name: '钱壮飞', role: '中共情报系统奠基人', years: '1895-1935' },
    { name: '李克农', role: '红色特工之王', years: '1899-1962' },
    { name: '胡底', role: '龙潭三杰之一', years: '1905-1935' },
    { name: '阎宝航', role: '战略情报专家', years: '1895-1968' },
    { name: '沈安娜', role: '按住蒋介石脉搏的人', years: '1915-2010' },
    { name: '熊向晖', role: '胡宗南身边的红色卧底', years: '1919-2005' }
];

class Mod8DarkLine {
    constructor() {
        this.foundClues = [];
        this.storyFragments = [];
        this.phase = 'explore'; // explore → glitch → truth → memorial
        this.isMobile = 'ontouchstart' in window;

        // 行为追踪（元游戏数据）
        this.startTime = Date.now();
        this.cursorDistance = 0;
        this.lastCursorX = window.innerWidth / 2;
        this.lastCursorY = window.innerHeight / 2;
        this.clickCount = 0;
        this.hesitationCount = 0; // 光源在线索附近停留但未点击

        this.darkLayer = document.getElementById('dark-layer');
        this.lightCircle = document.getElementById('light-circle');
        this.foundCounter = document.getElementById('found-counter');
        this.foundNum = document.getElementById('found-num');
        this.totalNum = document.getElementById('total-num');
        this.storyPanel = document.getElementById('story-panel');
        this.storyText = document.getElementById('story-text');
        this.glitchOverlay = document.getElementById('glitch-overlay');
        this.truthOverlay = document.getElementById('truth-overlay');
        this.truthNames = document.getElementById('truth-names');
        this.memorialEnd = document.getElementById('memorial-end');
        this.memorialGrid = document.getElementById('memorial-grid');

        this.init();
    }

    init() {
        this.totalNum.textContent = CLUES.length;
        this.createClues();
        this.initLight();
        this.addTouchHint();

        // 行为追踪
        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastCursorX;
            const dy = e.clientY - this.lastCursorY;
            this.cursorDistance += Math.sqrt(dx * dx + dy * dy);
            this.lastCursorX = e.clientX;
            this.lastCursorY = e.clientY;
        });
        document.addEventListener('click', () => this.clickCount++);

        // 延迟后显示计数器
        setTimeout(() => {
            this.foundCounter.classList.add('visible');
        }, 4000);
    }

    /** 创建线索元素 */
    createClues() {
        const main = document.getElementById('main-content');
        CLUES.forEach((clue, i) => {
            const el = document.createElement('div');
            el.className = 'clue';
            el.style.left = clue.x;
            el.style.top = clue.y;
            el.dataset.index = i;

            if (clue.type === 'text') {
                el.innerHTML = `<div class="clue-text">${clue.content}</div>`;
            } else if (clue.type === 'photo') {
                el.innerHTML = `<div class="clue-photo">${clue.icon}</div>`;
            } else if (clue.type === 'code') {
                el.innerHTML = `<div class="clue-code">${clue.content}</div>`;
            } else if (clue.type === 'object') {
                el.innerHTML = `<div class="clue-object">${clue.icon}</div>`;
            }

            el.addEventListener('click', () => this.revealClue(i));
            main.appendChild(el);
        });
    }

    /** 光源跟随 */
    initLight() {
        const move = (x, y) => {
            this.lightCircle.style.left = x + 'px';
            this.lightCircle.style.top = y + 'px';
            this.checkProximity(x, y);
        };

        document.addEventListener('mousemove', (e) => {
            move(e.clientX, e.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            move(touch.clientX, touch.clientY);
        }, { passive: true });

        // 键盘支持
        let kbX = window.innerWidth / 2;
        let kbY = window.innerHeight / 2;
        move(kbX, kbY);

        document.addEventListener('keydown', (e) => {
            const step = 30;
            switch (e.key) {
                case 'ArrowLeft': kbX -= step; break;
                case 'ArrowRight': kbX += step; break;
                case 'ArrowUp': kbY -= step; break;
                case 'ArrowDown': kbY += step; break;
                case 'Enter':
                case ' ':
                    this.revealNearest(kbX, kbY);
                    return;
                default: return;
            }
            e.preventDefault();
            kbX = Math.max(0, Math.min(window.innerWidth, kbX));
            kbY = Math.max(0, Math.min(window.innerHeight, kbY));
            move(kbX, kbY);
        });
    }

    /** 移动端触控提示 */
    addTouchHint() {
        if (!this.isMobile) return;
        const hint = document.createElement('div');
        hint.className = 'touch-hint';
        hint.textContent = '移动手指，探索黑暗';
        document.body.appendChild(hint);
        setTimeout(() => hint.classList.add('visible'), 3500);
        setTimeout(() => hint.classList.remove('visible'), 8000);
    }

    /** 检查光源与线索的距离 */
    checkProximity(x, y) {
        if (this.phase !== 'explore') return;

        const clues = document.querySelectorAll('.clue:not(.revealed)');
        clues.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(x - cx, y - cy);
            const radius = this.isMobile ? 80 : 100;

            if (dist < radius) {
                const index = parseInt(el.dataset.index);
                if (!this.foundClues.includes(index)) {
                    this.revealClue(index);
                }
            }
        });
    }

    /** 显示最近的未发现线索 */
    revealNearest(x, y) {
        if (this.phase !== 'explore') return;

        let closest = null;
        let minDist = Infinity;
        document.querySelectorAll('.clue:not(.revealed)').forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(x - cx, y - cy);
            if (dist < minDist) {
                minDist = dist;
                closest = el;
            }
        });

        if (closest && minDist < 200) {
            this.revealClue(parseInt(closest.dataset.index));
        }
    }

    /** 发现线索 */
    revealClue(index) {
        if (this.foundClues.includes(index)) return;
        this.foundClues.push(index);

        const clue = CLUES[index];
        const el = document.querySelector(`.clue[data-index="${index}"]`);
        el.classList.add('revealed');

        if (el.querySelector('.clue-photo')) {
            el.querySelector('.clue-photo').classList.add('revealed-active');
        }

        // 扩大光源
        this.lightCircle.classList.add('large');
        setTimeout(() => this.lightCircle.classList.remove('large'), 1000);

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playTone(600 + this.foundClues.length * 50, 0.15, 'sine');
        }

        // 收集故事片段
        this.storyFragments.push(clue.story);

        // 更新计数
        this.foundNum.textContent = this.foundClues.length;

        // 显示故事
        setTimeout(() => this.showStory(clue.story), 500);

        // 检查是否全部发现
        if (this.foundClues.length >= CLUES.length) {
            setTimeout(() => this.startGlitch(), 2000);
        }
    }

    /** 显示故事片段 */
    showStory(text) {
        this.storyText.textContent = text;
        this.storyPanel.classList.add('active');

        document.getElementById('story-close').onclick = () => {
            this.storyPanel.classList.remove('active');
        };
    }

    /** 第二层：系统故障 + CSS逐步被删除 */
    startGlitch() {
        this.phase = 'glitch';
        this.storyPanel.classList.remove('active');
        this.darkLayer.style.display = 'none';
        this.foundCounter.style.display = 'none';
        this.lightCircle.style.display = 'none';

        // 故障音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playStatic(1.0);
            setTimeout(() => AudioEngine.playStatic(0.6), 1000);
            setTimeout(() => AudioEngine.playStatic(0.8), 2500);
        }

        this.glitchOverlay.classList.add('active');

        // CSS 规则逐步"被删除" — 视觉上颜色、圆角、阴影逐渐消失
        const degradeSteps = [
            () => { document.body.style.transition = 'all 0.3s'; document.body.style.borderRadius = '0'; },
            () => { document.querySelectorAll('*').forEach(el => el.style.boxShadow = 'none'); },
            () => { document.body.style.filter = 'saturate(0.5)'; },
            () => { document.body.style.filter = 'saturate(0.2)'; },
            () => { document.body.style.filter = 'saturate(0) contrast(1.5)'; },
        ];
        degradeSteps.forEach((fn, i) => setTimeout(fn, i * 800));

        // 5秒后进入真相
        setTimeout(() => this.showTruth(), 5000);
    }

    /** 第三层：真相揭示 + 行为数据暴露 */
    showTruth() {
        this.phase = 'truth';
        this.glitchOverlay.classList.remove('active');

        // 恢复视觉
        document.body.style.filter = '';
        document.body.style.borderRadius = '';

        // 填入英雄名字
        this.truthNames.innerHTML = HEROES.map(h =>
            `<span class="truth-name">${h.name}</span>`
        ).join('');

        // 行为追踪数据揭示
        const elapsed = Math.round((Date.now() - this.startTime) / 1000);
        const distMeters = Math.round(this.cursorDistance / 100);
        const trackEl = document.getElementById('truth-tracking');
        if (trackEl) {
            trackEl.innerHTML =
                `<div class="tracking-title">你在这页面上的行为：</div>` +
                `<div class="tracking-data">停留时间：${elapsed}秒</div>` +
                `<div class="tracking-data">鼠标移动：${distMeters}米</div>` +
                `<div class="tracking-data">点击次数：${this.clickCount}次</div>` +
                `<div class="tracking-data">发现线索：${this.foundClues.length}个</div>` +
                `<div class="tracking-reveal">你的一举一动，都被记录了。</div>` +
                `<div class="tracking-reveal" style="margin-top:15px;font-size:0.85rem;color:rgba(255,255,255,0.4)">` +
                `当年的地下党员，也是这样被监视的。<br>他们每走一步，都可能是最后一步。</div>`;
        }

        // 恢复CSS
        document.body.style.filter = '';

        this.truthOverlay.classList.add('active');

        document.getElementById('truth-btn').onclick = () => {
            this.truthOverlay.classList.remove('active');
            this.showMemorial();
        };
    }

    /** 结尾纪念碑 */
    showMemorial() {
        this.phase = 'memorial';

        this.memorialGrid.innerHTML = HEROES.map(h => `
            <div class="memorial-card">
                <div class="card-name">${h.name}</div>
                <div class="card-role">${h.role}</div>
                <div class="card-years">${h.years}</div>
            </div>
        `).join('');

        this.memorialEnd.classList.add('active');
        this.memorialEnd.scrollIntoView({ behavior: 'smooth' });

        // 保存进度
        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod8', { completed: true, cluesFound: this.foundClues.length });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        // 初始化音频（需要用户交互）
        document.addEventListener('click', function initAudio() {
            if (typeof AudioEngine !== 'undefined') AudioEngine.init();
            document.removeEventListener('click', initAudio);
        }, { once: true });

        new Mod8DarkLine();
    });
});
