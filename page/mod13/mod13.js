/**
 * Mod13 节拍革命 — 节拍同步 + 历史节点
 * 核心机制：跟着节拍敲击，每次敲击揭示一个历史事件
 */

const BEAT_EVENTS = [
    { year: 1919, title: '五四运动', desc: '外争主权，内除国贼' },
    { year: 1921, title: '中共一大', desc: '开天辟地的大事变' },
    { year: 1927, title: '南昌起义', desc: '打响第一枪' },
    { year: 1934, title: '长征开始', desc: '二万五千里的信念' },
    { year: 1935, title: '遵义会议', desc: '生死攸关的转折点' },
    { year: 1937, title: '全面抗战', desc: '中华民族到了最危险的时候' },
    { year: 1945, title: '抗战胜利', desc: '正义必胜' },
    { year: 1949, title: '开国大典', desc: '中国人民站起来了' },
    { year: 1950, title: '抗美援朝', desc: '保家卫国' },
    { year: 1964, title: '原子弹', desc: '东方巨响' },
    { year: 1978, title: '改革开放', desc: '春天的故事' },
    { year: 1997, title: '香港回归', desc: '百年耻辱一朝洗' },
    { year: 2008, title: '北京奥运', desc: '同一个世界，同一个梦想' },
    { year: 2020, title: '全面脱贫', desc: '人间奇迹' },
    { year: 2021, title: '建党百年', desc: '不忘初心' }
];

class Mod13BeatRevolution {
    constructor() {
        this.tapCount = 0;
        this.currentEvent = 0;
        this.bpm = 72;
        this.particles = [];
        this.isStarted = false;

        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.beatRing = document.getElementById('beat-ring');
        this.bpmNum = document.getElementById('bpm-num');
        this.eventDisplay = document.getElementById('event-display');
        this.eventYear = document.getElementById('event-year');
        this.eventTitle = document.getElementById('event-title');
        this.timelineStrip = document.getElementById('timeline-strip');
        this.ending = document.getElementById('ending');

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createTimeline();
        this.initInteraction();
        this.startParticleLoop();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /** 创建时间线 */
    createTimeline() {
        BEAT_EVENTS.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'timeline-dot';
            dot.dataset.index = i;
            this.timelineStrip.appendChild(dot);
        });
    }

    /** 交互初始化 */
    initInteraction() {
        // 点击
        this.beatRing.addEventListener('click', () => this.onTap());

        // 键盘
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                this.onTap();
            }
        });

        // 触摸
        this.beatRing.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.onTap();
        }, { passive: false });
    }

    /** 敲击 */
    onTap() {
        if (this.currentEvent >= BEAT_EVENTS.length) return;

        this.tapCount++;

        // 视觉反馈
        this.beatRing.classList.add('hit');
        setTimeout(() => this.beatRing.classList.remove('hit'), 150);

        // 粒子爆发
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        this.emitParticles(cx, cy, 15);

        // 扩展环波
        this.emitRingWave(cx, cy);

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playDrum(0.3);
            AudioEngine.playTone(220 + this.currentEvent * 20, 0.1, 'triangle');
        }

        // 揭示事件
        this.revealEvent();

        // BPM逐渐加快
        if (this.tapCount % 3 === 0 && this.bpm < 120) {
            this.bpm += 2;
            this.bpmNum.textContent = this.bpm;
        }
    }

    /** 扩展环波 */
    emitRingWave(x, y) {
        this.particles.push({
            type: 'ring',
            x, y,
            radius: 10,
            maxRadius: 200 + Math.random() * 100,
            life: 1,
            decay: 0.015,
            color: `hsl(${35 + this.currentEvent * 5}, 70%, 60%)`
        });
    }

    /** 揭示事件 */
    revealEvent() {
        const event = BEAT_EVENTS[this.currentEvent];
        if (!event) return;

        // 更新时间线
        const dots = this.timelineStrip.querySelectorAll('.timeline-dot');
        dots.forEach((dot, i) => {
            if (i < this.currentEvent) dot.classList.add('passed');
            if (i === this.currentEvent) dot.classList.add('active');
        });

        // 显示事件
        this.eventYear.textContent = event.year + '年';
        this.eventTitle.textContent = event.title;
        this.eventDisplay.classList.add('visible');

        // 2秒后隐藏
        setTimeout(() => {
            this.eventDisplay.classList.remove('visible');
        }, 2000);

        this.currentEvent++;

        // 全部揭示
        if (this.currentEvent >= BEAT_EVENTS.length) {
            setTimeout(() => this.showEnding(), 2500);
        }
    }

    /** 发射粒子 */
    emitParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                color: `hsl(${35 + Math.random() * 15}, 70%, ${60 + Math.random() * 20}%)`
            });
        }
    }

    /** 粒子动画循环 */
    startParticleLoop() {
        if (typeof Motion !== 'undefined' && Motion._reduced) return;

        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                if (p.type === 'ring') {
                    // 环波
                    p.radius += (p.maxRadius - p.radius) * 0.05;
                    p.life -= p.decay;
                    if (p.life > 0) {
                        this.ctx.globalAlpha = p.life * 0.5;
                        this.ctx.strokeStyle = p.color;
                        this.ctx.lineWidth = 2 * p.life;
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        this.ctx.stroke();
                    }
                } else {
                    // 普通粒子
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.98;
                    p.vy *= 0.98;
                    p.life -= p.decay;

                    if (p.life > 0) {
                        this.ctx.globalAlpha = p.life;
                        this.ctx.fillStyle = p.color;
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            });

            this.ctx.globalAlpha = 1;
            this.particles = this.particles.filter(p => p.life > 0);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    /** 结尾 */
    showEnding() {
        document.getElementById('total-taps').textContent = this.tapCount;

        const eventsDiv = document.getElementById('ending-events');
        BEAT_EVENTS.forEach(e => {
            const el = document.createElement('span');
            el.className = 'ending-event';
            el.textContent = `${e.year} ${e.title}`;
            eventsDiv.appendChild(el);
        });

        this.ending.classList.add('active');
        this.ending.scrollIntoView({ behavior: 'smooth' });

        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod13', { completed: true, taps: this.tapCount });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod13BeatRevolution();
    });
});
