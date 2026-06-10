/**
 * Mod12 觉醒纪念碑 — 花瓣粒子 + 纪念碑生长
 * 核心机制：点击献花 → 花瓣飘落 → 纪念碑上刻下名字
 */

const DEFAULT_NAMES = [
    '陈独秀', '李大钊', '鲁迅', '蔡元培', '胡适',
    '毛泽东', '周恩来', '邓小平', '刘少奇', '朱德',
    '赵世炎', '蔡和森', '向警予', '邓中夏', '瞿秋白',
    '方志敏', '杨靖宇', '赵一曼', '刘胡兰', '董存瑞'
];

class Mod12Monument {
    constructor() {
        this.flowerCount = 0;
        this.names = [];
        this.petalParticles = [];

        this.canvas = document.getElementById('petal-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.monumentBody = document.getElementById('monument-body');
        this.flowerNames = document.getElementById('flower-names');
        this.totalFlowers = document.getElementById('total-flowers');
        this.nameModal = document.getElementById('name-modal');
        this.nameInput = document.getElementById('name-input');
        this.ending = document.getElementById('ending');
        this.endingNumber = document.getElementById('ending-number');

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.loadData();
        this.renderMonument();
        this.renderNames();
        this.updateCounter();
        this.initPetalLoop();
        this.initOfferBtn();
        this.initModal();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /** 加载持久化数据 */
    loadData() {
        try {
            const data = JSON.parse(localStorage.getItem('rb_mod12_data'));
            if (data) {
                this.flowerCount = data.flowerCount || 0;
                this.names = data.names || [];
            }
        } catch (e) {}

        // 确保有一些默认名字
        if (this.names.length === 0) {
            this.names = DEFAULT_NAMES.slice(0, 5);
            this.flowerCount = 5;
            this.saveData();
        }
    }

    saveData() {
        try {
            localStorage.setItem('rb_mod12_data', JSON.stringify({
                flowerCount: this.flowerCount,
                names: this.names
            }));
        } catch (e) {}
    }

    /** 献花按钮 */
    initOfferBtn() {
        const btn = document.getElementById('offer-btn');
        btn.addEventListener('click', () => {
            this.emitPetals(20);
            this.showNameModal();

            // 音效
            if (typeof AudioEngine !== 'undefined') {
                AudioEngine.playTone(523, 0.1, 'sine');
                setTimeout(() => AudioEngine.playTone(659, 0.1, 'sine'), 100);
                setTimeout(() => AudioEngine.playTone(784, 0.1, 'sine'), 200);
            }
        });
    }

    /** 发射花瓣 */
    emitPetals(count) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height - 100;

        for (let i = 0; i < count; i++) {
            this.petalParticles.push({
                x: cx + (Math.random() - 0.5) * 100,
                y: cy,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 5 - 2,
                size: Math.random() * 8 + 4,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.1,
                life: 1,
                decay: 0.005 + Math.random() * 0.005,
                color: Math.random() > 0.5 ? '#f5a0b0' : '#f0c0d0',
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    /** 花瓣动画循环 */
    initPetalLoop() {
        if (typeof Motion !== 'undefined' && Motion._reduced) {
            // reduced motion: 静态绘制
            this.drawStaticPetals();
            return;
        }

        // 风力模拟
        this.windTime = 0;

        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.windTime += 0.01;
            const wind = Math.sin(this.windTime) * 1.5 + Math.sin(this.windTime * 2.3) * 0.5;

            this.petalParticles.forEach(p => {
                // 风力影响
                p.vx += wind * 0.01;
                p.x += p.vx + Math.sin(p.wobble) * 0.8;
                p.y += p.vy;
                p.vy += 0.02; // 重力
                p.vx *= 0.99; // 空气阻力
                p.rotation += p.rotSpeed;
                p.wobble += p.wobbleSpeed;
                p.life -= p.decay;

                if (p.life > 0) {
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation);
                    this.ctx.globalAlpha = p.life;

                    // 画花瓣形状 — 更真实的椭圆+渐变
                    const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
                    grad.addColorStop(0, p.color);
                    grad.addColorStop(1, 'rgba(245,160,176,0.2)');
                    this.ctx.fillStyle = grad;
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.restore();
                }
            });

            // 清理死亡粒子
            this.petalParticles = this.petalParticles.filter(p => p.life > 0);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    /** reduced motion 静态花瓣 */
    drawStaticPetals() {
        this.ctx.fillStyle = '#f5a0b0';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.8;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, 5, 3, Math.random() * Math.PI, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /** 名字输入弹窗 */
    showNameModal() {
        this.nameModal.classList.add('active');
        this.nameInput.value = '';
        this.nameInput.focus();
    }

    initModal() {
        document.getElementById('modal-confirm').addEventListener('click', () => {
            const name = this.nameInput.value.trim() || '匿名';
            this.addName(name);
            this.nameModal.classList.remove('active');
        });

        document.getElementById('modal-skip').addEventListener('click', () => {
            this.addName('匿名');
            this.nameModal.classList.remove('active');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.nameModal.classList.contains('active')) {
                this.addName('匿名');
                this.nameModal.classList.remove('active');
            }
        });

        this.nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const name = this.nameInput.value.trim() || '匿名';
                this.addName(name);
                this.nameModal.classList.remove('active');
            }
        });
    }

    /** 添加名字 */
    addName(name) {
        this.names.push(name);
        this.flowerCount++;
        this.saveData();
        this.updateCounter();
        this.renderMonument(name);
        this.renderNames();

        // 花瓣爆发
        this.emitPetals(10);

        // 检查里程碑
        if (this.flowerCount % 10 === 0) {
            this.emitPetals(30);
        }
    }

    /** 更新计数器 */
    updateCounter() {
        this.totalFlowers.textContent = this.flowerCount;
    }

    /** 渲染纪念碑 */
    renderMonument(newName) {
        this.monumentBody.innerHTML = '';
        // 显示最近的30个名字
        const recent = this.names.slice(-30);
        recent.forEach(name => {
            const stone = document.createElement('span');
            stone.className = 'stone';
            stone.textContent = name;
            if (name === newName) {
                stone.classList.add('just-carved');
                // 石刻音效
                if (typeof AudioEngine !== 'undefined') {
                    AudioEngine.playTone(150, 0.08, 'square');
                    setTimeout(() => AudioEngine.playTone(120, 0.06, 'square'), 100);
                }
            }
            this.monumentBody.appendChild(stone);
        });

        // 根据名字数量调整高度
        const height = Math.min(300, 60 + this.names.length * 3);
        this.monumentBody.style.minHeight = height + 'px';
    }

    /** 渲染献花者名单 */
    renderNames() {
        this.flowerNames.innerHTML = '';
        const unique = [...new Set(this.names)].slice(-20);
        unique.forEach(name => {
            const el = document.createElement('span');
            el.className = 'flower-name';
            el.textContent = name;
            this.flowerNames.appendChild(el);
        });
    }

    /** 显示结尾 */
    showEnding() {
        this.endingNumber.textContent = this.flowerCount;
        this.ending.classList.add('active');

        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod12', { completed: true, flowers: this.flowerCount });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        const mod = new Mod12Monument();

        // 30秒后如果还没操作，显示结尾
        setTimeout(() => {
            if (!mod.ending.classList.contains('active')) {
                mod.showEnding();
            }
        }, 30000);
    });
});
