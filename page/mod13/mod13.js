/**
 * Mod13 节拍革命 — 节拍同步 + 历史节点
 * 核心机制：跟着节拍敲击，每次敲击揭示一个历史事件
 */

const BEAT_EVENTS = [
    { year: 1919, title: '五四运动', desc: '外争主权，内除国贼',
      detail: '巴黎和会外交失败，北京3000学生高喊口号走上街头。火烧赵家楼，痛打章宗祥。马克思主义开始在中国传播，中国青年第一次以群体姿态登上历史舞台。' },
    { year: 1921, title: '中共一大', desc: '开天辟地的大事变',
      detail: '13位代表在上海法租界秘密召开会议，后转移至嘉兴南湖。平均年龄28岁，代表全国50多名党员。一个改变中国命运的政党就此诞生。' },
    { year: 1927, title: '南昌起义', desc: '打响第一枪',
      detail: '1927年8月1日凌晨2点，2万余起义军激战5小时占领南昌城。周恩来、贺龙、叶挺、朱德、刘伯承指挥作战。人民军队由此诞生，8月1日成为建军节。' },
    { year: 1934, title: '长征开始', desc: '二万五千里的信念',
      detail: '中央红军86000人从瑞金出发，开始二万五千里长征。这是一次理想信念的伟大远征。两年后，只有7000人走到了终点。79000人再也没有回来。' },
    { year: 1935, title: '遵义会议', desc: '生死攸关的转折点',
      detail: '遵义会议开了三天，争论激烈，没有流血。确立了毛泽东在党中央和红军的领导地位。这是党的历史上一个生死攸关的转折点。遵义会议后，红军好像忽然活过来了。' },
    { year: 1937, title: '全面抗战', desc: '中华民族到了最危险的时候',
      detail: '1937年7月7日，卢沟桥事变。"宁为战死鬼，不做亡国奴。"国共第二次合作，全国军民奋起抵抗。八年全面抗战，中国军民伤亡超过3500万人。' },
    { year: 1945, title: '抗战胜利', desc: '正义必胜',
      detail: '1945年8月15日，日本宣布无条件投降。十四年抗战，中国军民伤亡超过3500万人。这是近代以来中国抗击外敌入侵的第一次完全胜利。整个中国都在欢呼。' },
    { year: 1949, title: '开国大典', desc: '中国人民站起来了',
      detail: '1949年10月1日，毛泽东在天安门城楼上宣告中华人民共和国成立。30万军民见证，54门礼炮齐鸣28响。中国人民从此站起来了。' },
    { year: 1950, title: '抗美援朝', desc: '保家卫国',
      detail: '中国人民志愿军跨过鸭绿江，在零下40度的严寒中与世界最强军队作战。长津湖战役，冰雕连战士保持战斗姿势冻死在阵地上。19万7千多名志愿军将士牺牲在异国他乡。' },
    { year: 1964, title: '原子弹', desc: '东方巨响',
      detail: '1964年10月16日，中国第一颗原子弹在罗布泊爆炸成功。邓稼先等科学家在戈壁滩隐姓埋名28年。中国成为世界第五个拥核国家，从此不再受核讹诈。' },
    { year: 1978, title: '改革开放', desc: '春天的故事',
      detail: '十一届三中全会召开，中国进入改革开放新时期。小岗村18户农民按下红手印，拉开了改革序幕。从此，中国从封闭走向开放，从贫穷走向富裕。' },
    { year: 1997, title: '香港回归', desc: '百年耻辱一朝洗',
      detail: '1997年7月1日零点，英国国旗降下，五星红旗在香港升起。等了156年，香港终于回家了。交接仪式上，中方代表安文彬与英方代表进行了16轮谈判，只为让国旗在零点零分零秒准时升起。' },
    { year: 2008, title: '北京奥运', desc: '同一个世界，同一个梦想',
      detail: '2008年8月8日，29个焰火脚印沿北京中轴线走向鸟巢。中国代表团首次获得金牌榜第一名。汶川地震同年发生，15名空降兵在5000米高空写下遗书跳伞。' },
    { year: 2020, title: '全面脱贫', desc: '人间奇迹',
      detail: '9899万农村贫困人口全部脱贫，832个贫困县全部摘帽。25.5万个驻村工作队、300多万名第一书记和驻村干部奋战在扶贫一线。1800多人牺牲在脱贫攻坚一线。' },
    { year: 2021, title: '建党百年', desc: '不忘初心',
      detail: '中国共产党走过100年。从50多名党员发展到9500多万名党员，从一叶红船到巍巍巨轮。天安门广场上，青少年齐声喊出"请党放心，强国有我"。' }
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

        // 键盘（Enter/Space）
        this.beatRing.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.onTap();
            }
        });

        // 全局空格键
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
        // 显示详情
        const detailEl = document.getElementById('event-detail');
        if (detailEl) detailEl.textContent = event.detail || event.desc;
        this.eventDisplay.classList.add('visible');

        // 3秒后隐藏（清除之前的定时器防止堆叠）
        if (this._hideEventTimer) clearTimeout(this._hideEventTimer);
        this._hideEventTimer = setTimeout(() => {
            this.eventDisplay.classList.remove('visible');
        }, 3000);

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

        if (typeof Storage !== 'undefined' && typeof Storage.setModuleProgress === 'function') {
            Storage.setModuleProgress('mod13', { completed: true, taps: this.tapCount });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    const init = function() {
        new Mod13BeatRevolution();
    };
    if (typeof checkNarrativeTransition === 'function') {
        checkNarrativeTransition(init);
    } else {
        init();
    }
});
