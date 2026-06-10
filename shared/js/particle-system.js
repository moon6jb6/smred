/**
 * Canvas 粒子系统
 * 复用于：mod1(血色粒子)、mod4(光点)、mod12(花瓣雨)、mod14(金色光点)
 *
 * 用法：
 *   const ps = new ParticleSystem(canvas, { colors: ['#8b0000'], maxParticles: 800 });
 *   ps.emit(100, 100, 50);
 *   ps.burst(200, 200, 100, Math.PI);
 *   ps.rain(50);
 *   ps.start();
 */
class ParticleSystem {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this._rafId = null;

        const defaults = {
            maxParticles: 500,
            colors: ['#ffd700'],
            gravity: 0,
            friction: 0.98,
            speed: { min: 1, max: 4 },
            size: { min: 1, max: 3 },
            fade: true,
            fadeSpeed: 0.01,
            shape: 'circle',   // circle / square / petal / glow
            wind: 0,
            reducedMotion: false
        };

        this.options = Object.assign({}, defaults, options);

        // 检测 prefers-reduced-motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.options.reducedMotion = true;
        }

        this.resize();
    }

    /** 调整canvas尺寸 */
    resize() {
        const rect = this.canvas.parentElement
            ? this.canvas.parentElement.getBoundingClientRect()
            : { width: window.innerWidth, height: window.innerHeight };
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    /** 创建单个粒子 */
    _createParticle(x, y, overrides) {
        const o = this.options;
        const angle = overrides && overrides.angle !== undefined
            ? overrides.angle
            : Math.random() * Math.PI * 2;
        const speed = overrides && overrides.speed !== undefined
            ? overrides.speed
            : o.speed.min + Math.random() * (o.speed.max - o.speed.min);

        return {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: o.size.min + Math.random() * (o.size.max - o.size.min),
            color: o.colors[Math.floor(Math.random() * o.colors.length)],
            alpha: 1,
            life: 1,
            decay: o.fade ? o.fadeSpeed + Math.random() * 0.005 : 0,
            gravity: o.gravity,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1
        };
    }

    /** 在(x,y)发射count个粒子 */
    emit(x, y, count) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.options.maxParticles) break;
            this.particles.push(this._createParticle(x, y));
        }
    }

    /** 爆发：指定角度范围 */
    burst(x, y, count, angleRange, direction) {
        if (!angleRange) angleRange = Math.PI * 2;
        if (!direction) direction = -Math.PI / 2; // 默认向上

        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.options.maxParticles) break;
            const angle = direction - angleRange / 2 + Math.random() * angleRange;
            const speed = this.options.speed.min + Math.random() * (this.options.speed.max - this.options.speed.min) * 2;
            this.particles.push(this._createParticle(x, y, { angle, speed }));
        }
    }

    /** 从顶部飘落 */
    rain(count) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.options.maxParticles) break;
            const x = Math.random() * this.canvas.width;
            const p = this._createParticle(x, -10, {
                angle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
                speed: 0.5 + Math.random() * 1.5
            });
            p.gravity = 0.02;
            p.decay = 0.002;
            this.particles.push(p);
        }
    }

    /** 持续发射（用于背景粒子） */
    emitContinuous(x, y, rate) {
        this._continuousEmit = { x, y, rate };
    }

    /** 更新单个粒子 */
    _updateParticle(p) {
        p.vx *= this.options.friction;
        p.vy *= this.options.friction;
        p.vy += p.gravity;
        p.vx += this.options.wind;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);
        p.rotation += p.rotSpeed;
        return p.life > 0;
    }

    /** 绘制单个粒子 */
    _drawParticle(p) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        switch (this.options.shape) {
            case 'square':
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                break;

            case 'petal':
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'glow':
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
                ctx.fill();
                break;

            default: // circle
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
        }

        ctx.restore();
    }

    /** 主循环 */
    _loop() {
        if (!this.running) return;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // reduced-motion: 只绘制一帧静态粒子
        if (this.options.reducedMotion) {
            this.particles.forEach(p => this._drawParticle(p));
            return;
        }

        // 持续发射
        if (this._continuousEmit) {
            const { x, y, rate } = this._continuousEmit;
            if (Math.random() < rate) {
                this.emit(x, y, 1);
            }
        }

        // 更新并绘制
        this.particles = this.particles.filter(p => {
            const alive = this._updateParticle(p);
            if (alive) this._drawParticle(p);
            return alive;
        });

        this._rafId = requestAnimationFrame(() => this._loop());
    }

    /** 启动动画循环 */
    start() {
        if (this.running) return;
        this.running = true;
        this._loop();
    }

    /** 停止动画 */
    stop() {
        this.running = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    /** 清空所有粒子 */
    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** 获取当前粒子数量 */
    get count() {
        return this.particles.length;
    }
}
