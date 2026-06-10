/**
 * Mod12 觉醒纪念碑 — 花瓣粒子 + 纪念碑生长
 * 核心机制：点击献花 → 花瓣飘落 → 纪念碑上刻下名字
 */

const DEFAULT_NAMES = [
    { name: '陈独秀', title: '新文化运动旗手', detail: '创办《新青年》，唤醒一代青年。1921年建党时，他虽未出席，却被选为第一任总书记。他说："科学与民主，是人类社会进步的两大主要动力。"' },
    { name: '李大钊', title: '中国马克思主义先驱', detail: '他是中国第一个传播马克思主义的人。1927年被捕，绞刑三次才牺牲，年仅38岁。他说："试看将来的环球，必是赤旗的世界！"' },
    { name: '鲁迅', title: '民族魂', detail: '弃医从文，因为"凡是愚弱的国民，即使体格如何健全，如何茁壮，也只能做毫无意义的示众的材料和看客"。一支笔，唤醒了整个民族的自觉。' },
    { name: '蔡元培', title: '北大之父', detail: '主持北大改革，提出"思想自由，兼容并包"。聘请陈独秀、胡适、李大钊、鲁迅等人任教，使北大成为新文化运动的中心。' },
    { name: '毛泽东', title: '人民领袖', detail: '从湖南韶山的农家少年，到缔造新中国。28年革命生涯，带领中国人民站起来。他说："人民，只有人民，才是创造世界历史的动力。"' },
    { name: '周恩来', title: '人民的好总理', detail: '一生鞠躬尽瘁，死而后已。长征中重病仍坚持工作，万隆会议提出"求同存异"。去世时联合国降半旗，十里长街送总理。' },
    { name: '邓小平', title: '改革开放总设计师', detail: '三落三起，永不言弃。1978年推动改革开放，让中国从封闭走向开放，从贫穷走向富裕。他说："我是中国人民的儿子。"' },
    { name: '朱德', title: '红军之父', detail: '放弃国民党高官厚禄，追寻共产党。井冈山会师，创建红四军。长征中与士兵同甘共苦，亲自挑粮上山。他说："革命不是为了做官。"' },
    { name: '赵世炎', title: '上海工人运动领袖', detail: '26岁领导上海工人第三次武装起义，占领上海。被捕后英勇不屈，高呼"中国共产党万岁"走向刑场。' },
    { name: '蔡和森', title: '建党理论奠基人', detail: '最早提出"正式成立一个中国共产党"。与毛泽东并称"双雄"。1931年被捕，四肢被钉在墙上，仍不屈服，年仅36岁牺牲。' },
    { name: '向警予', title: '中国妇女运动先驱', detail: '中国共产党第一位女中央委员。1928年被捕，在狱中仍组织绝食斗争。就义前从容演讲，沿途群众无不动容。' },
    { name: '瞿秋白', title: '文学家与革命者', detail: '翻译《国际歌》，第一个完整介绍苏联的中国人。1935年被捕，蒋介石亲自劝降，他拒绝。临刑前说："此地甚好。"盘腿而坐，从容就义。' },
    { name: '方志敏', title: '清贫革命者', detail: '被捕时，国民党士兵搜遍全身，只搜出一块怀表和一支钢笔。在狱中写下《可爱的中国》和《清贫》。他说："清贫，洁白朴素的生活，正是我们革命者能够战胜许多困难的地方。"' },
    { name: '杨靖宇', title: '东北抗联第一人', detail: '在零下40度的雪原中孤身战斗到最后一刻。牺牲后，日军剖开他的胃，发现里面只有棉絮、树皮和草根，没有一粒粮食。连敌人都不得不敬佩。' },
    { name: '赵一曼', title: '白山黑水间的女英雄', detail: '东北抗联女政委，被捕后遭受9个月酷刑，始终不屈。临刑前给儿子留下遗书："母亲不用千言万语来教育你，就用实行来教育你。"' },
    { name: '刘胡兰', title: '生的伟大，死的光荣', detail: '15岁，面对铡刀毫无惧色。毛泽东亲笔题词"生的伟大，死的光荣"。她是革命烈士中年龄最小的一位。' },
    { name: '董存瑞', title: '舍身炸碉堡', detail: '1948年隆化战斗中，为扫除部队前进障碍，用手托起炸药包，高喊："为了新中国，前进！"牺牲时年仅19岁。' },
    { name: '黄继光', title: '用胸膛堵枪眼', detail: '1952年上甘岭战役中，用胸膛堵住了敌人的机枪射孔，为部队冲锋打开了通路。牺牲时年仅21岁。' },
    { name: '邱少云', title: '烈火中永生', detail: '1952年潜伏任务中，敌人的燃烧弹落在身边，为了不暴露部队，他一动不动，任凭烈火焚身。牺牲时年仅26岁。' },
    { name: '狼牙山五壮士', title: '宁死不屈', detail: '1941年，五位八路军战士为掩护群众和主力转移，将敌人引上绝路。弹尽粮毁后，五人纵身跳崖。三人牺牲，两人被树枝挂住幸存。' }
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
            this.names = DEFAULT_NAMES.slice(0, 5).map(n => n.name);
            this.flowerCount = 5;
            this.saveData();
        }
    }

    /** 获取历史人物详情 */
    getHeroDetail(name) {
        return DEFAULT_NAMES.find(n => n.name === name);
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
            // 历史人物显示title
            const hero = this.getHeroDetail(name);
            if (hero) {
                stone.title = hero.title + ' — ' + hero.detail.substring(0, 50) + '...';
            }
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
