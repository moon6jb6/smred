/**
 * Mod11 历史星图 — 地铁线路图式因果链
 * 核心机制：SVG节点+连线，探索节点发现因果关系
 */

const EVENTS = [
    { id: 'opium', year: 1840, title: '鸦片战争', x: 80, y: 100,
      desc: '英国用炮舰打开了中国的大门。清政府被迫签订《南京条约》，割让香港岛，赔款2100万银元。这是中国近代史上第一个不平等条约，从此，中国开始沦为半殖民地半封建社会。',
      causes: [] },
    { id: 'taiping', year: 1851, title: '太平天国', x: 180, y: 180,
      desc: '洪秀全发动金田起义，建立太平天国。这是中国历史上规模最大的农民起义，席卷半个中国，坚持了14年。虽然最终失败，但它动摇了清王朝的根基，也唤醒了后来者。',
      causes: ['opium'] },
    { id: 'reform', year: 1898, title: '戊戌变法', x: 280, y: 100,
      desc: '康有为、梁启超推动维新变法，试图用改良的方式拯救中国，但仅持续103天便失败。谭嗣同拒绝逃亡，从容就义。他说："各国变法，无不从流血而成。"',
      causes: ['opium'] },
    { id: 'revolution', year: 1911, title: '辛亥革命', x: 380, y: 200,
      desc: '孙中山领导的辛亥革命推翻了两千多年的封建帝制，建立了中华民国。武昌起义一声枪响，清帝退位。孙中山说："革命尚未成功，同志仍须努力。"',
      causes: ['reform'] },
    { id: 'may4th', year: 1919, title: '五四运动', x: 480, y: 100,
      desc: '巴黎和会上中国外交失败，引发五四运动。北京学生高喊"外争主权，内除国贼"走上街头。马克思主义开始在中国广泛传播，中国青年第一次以群体姿态登上历史舞台。',
      causes: ['revolution'] },
    { id: 'founding_cpc', year: 1921, title: '中共成立', x: 580, y: 180,
      desc: '中国共产党在上海法租界成立，后转移至嘉兴南湖。13位代表，平均年龄28岁，代表全国50多名党员。谁也不知道，这个组织将改变中国的命运。',
      causes: ['may4th'] },
    { id: 'nanchang', year: 1927, title: '南昌起义', x: 680, y: 100,
      desc: '1927年8月1日凌晨2点，南昌起义打响了武装反抗国民党反动派的第一枪。2万余起义军激战5小时占领南昌城。人民军队由此诞生，8月1日成为建军节。',
      causes: ['founding_cpc'] },
    { id: 'long_march', year: 1934, title: '长征开始', x: 680, y: 250,
      desc: '中央红军86000人从瑞金出发，开始二万五千里长征。这是一次理想信念的伟大远征。两年后，只有7000人走到了终点。79000人再也没有回来。',
      causes: ['nanchang'] },
    { id: 'zunyi', year: 1935, title: '遵义会议', x: 580, y: 320,
      desc: '遵义会议确立了毛泽东在党中央和红军的领导地位。会议开了三天，争论激烈，没有流血。这是党的历史上一个生死攸关的转折点。遵义会议后，红军好像忽然活过来了。',
      causes: ['long_march'] },
    { id: 'xian', year: 1936, title: '西安事变', x: 480, y: 280,
      desc: '张学良、杨虎城发动兵谏，扣押蒋介石，逼蒋抗日。西安事变的和平解决，促成了抗日民族统一战线的形成。国共第二次合作，枪口一致对外。',
      causes: ['founding_cpc'] },
    { id: 'war_start', year: 1937, title: '全面抗战', x: 380, y: 350,
      desc: '1937年7月7日，卢沟桥事变后，全面抗战爆发。中华民族到了最危险的时候。"宁为战死鬼，不做亡国奴。"国共第二次合作，全国军民奋起抵抗。',
      causes: ['xian'] },
    { id: 'war_end', year: 1945, title: '抗战胜利', x: 280, y: 400,
      desc: '1945年8月15日，日本宣布无条件投降。十四年抗战，中国军民伤亡超过3500万人。这是近代以来中国抗击外敌入侵的第一次完全胜利。整个中国都在欢呼。',
      causes: ['war_start', 'zunyi'] },
    { id: 'liberation', year: 1949, title: '新中国成立', x: 180, y: 450,
      desc: '1949年10月1日，毛泽东在天安门城楼上宣告中华人民共和国成立。30万军民见证，54门礼炮齐鸣28响。中国人民从此站起来了。',
      causes: ['war_end'] },
    { id: 'reform_open', year: 1978, title: '改革开放', x: 100, y: 520,
      desc: '十一届三中全会召开，中国进入改革开放新时期。小岗村18户农民按下红手印，拉开了改革序幕。从此，中国从封闭走向开放，从贫穷走向富裕。',
      causes: ['liberation'] }
];

// 因果关系边
const LINKS = [];
EVENTS.forEach(e => {
    e.causes.forEach(causeId => {
        LINKS.push({ from: causeId, to: e.id });
    });
});

class Mod11StarMap {
    constructor() {
        this.exploredNodes = new Set();
        this.discoveredLinks = new Set();
        this.totalLinks = LINKS.length;

        this.svg = document.getElementById('map-svg');
        this.nodeDetail = document.getElementById('node-detail');
        this.discoveryCount = document.getElementById('discovery-count');
        this.discoveryTotal = document.getElementById('discovery-total');
        this.ending = document.getElementById('ending');

        this.init();
    }

    init() {
        this.discoveryTotal.textContent = this.totalLinks;
        this.renderMap();
        this.initPersonalTimeline();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.nodeDetail.classList.contains('active')) {
                this.nodeDetail.classList.remove('active');
            }
        });
    }

    /** 个人历史图谱 */
    initPersonalTimeline() {
        const input = document.getElementById('birth-year-input');
        const result = document.getElementById('personal-result');
        if (!input || !result) return;

        input.addEventListener('input', () => {
            const year = parseInt(input.value);
            if (!year || year < 1840 || year > 2026) {
                result.textContent = '';
                this.svg.querySelectorAll('.node-group').forEach(g => g.classList.remove('in-lifetime', 'before-lifetime'));
                return;
            }

            let beforeCount = 0;
            let afterCount = 0;
            EVENTS.forEach(event => {
                const group = this.svg.querySelector(`g[data-id="${event.id}"]`);
                if (!group) return;
                if (event.year <= year) {
                    group.classList.add('in-lifetime');
                    group.classList.remove('before-lifetime');
                    afterCount++;
                } else {
                    group.classList.add('before-lifetime');
                    group.classList.remove('in-lifetime');
                    beforeCount++;
                }
            });

            result.innerHTML = `你出生前：<span style="color:var(--gold)">${beforeCount}</span> 个事件已发生<br>你出生后：<span style="color:var(--gold)">${afterCount}</span> 个事件在你的时代`;
        });
    }

    /** 渲染SVG地图 */
    renderMap() {
        // 先画连线
        LINKS.forEach(link => {
            const from = EVENTS.find(e => e.id === link.from);
            const to = EVENTS.find(e => e.id === link.to);
            if (!from || !to) return;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // 用曲线连接
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2 - 20;
            const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
            line.setAttribute('d', d);
            line.classList.add('link-line');
            line.dataset.from = link.from;
            line.dataset.to = link.to;
            this.svg.appendChild(line);
        });

        // 再画节点（覆盖连线）
        EVENTS.forEach(event => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.dataset.id = event.id;
            g.classList.add('node-group');

            // 节点圆圈
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', event.x);
            circle.setAttribute('cy', event.y);
            circle.setAttribute('r', '12');
            circle.classList.add('node-circle');
            g.appendChild(circle);

            // 标题
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', event.x);
            label.setAttribute('y', event.y - 20);
            label.classList.add('node-label');
            label.textContent = event.title;
            g.appendChild(label);

            // 年份
            const year = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            year.setAttribute('x', event.x);
            year.setAttribute('y', event.y + 25);
            year.classList.add('node-year');
            year.textContent = event.year;
            g.appendChild(year);

            // 点击事件
            g.addEventListener('click', () => this.exploreNode(event.id));

            this.svg.appendChild(g);
        });
    }

    /** 探索节点 */
    exploreNode(id) {
        if (this.exploredNodes.has(id)) {
            this.showDetail(id);
            return;
        }

        this.exploredNodes.add(id);
        const event = EVENTS.find(e => e.id === id);

        // 更新节点样式
        const group = this.svg.querySelector(`g[data-id="${id}"]`);
        if (group) {
            group.querySelector('.node-circle').classList.add('explored');
            group.querySelector('.node-label').classList.add('explored');
        }

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playTone(440 + this.exploredNodes.size * 40, 0.15, 'sine');
        }

        // 检查因果发现
        this.checkCausalDiscovery(id);

        // 显示详情
        this.showDetail(id);

        // 全部探索完
        if (this.exploredNodes.size >= EVENTS.length) {
            setTimeout(() => this.showEnding(), 1500);
        }
    }

    /** 检查因果关系发现 */
    checkCausalDiscovery(id) {
        LINKS.forEach(link => {
            const key = `${link.from}->${link.to}`;
            if (this.discoveredLinks.has(key)) return;

            // 如果两端都已探索，发现因果
            if (this.exploredNodes.has(link.from) && this.exploredNodes.has(link.to)) {
                this.discoveredLinks.add(key);

                // 高亮连线
                const line = this.svg.querySelector(`.link-line[data-from="${link.from}"][data-to="${link.to}"]`);
                if (line) {
                    line.classList.add('discovered');
                    // 添加动画线
                    const animated = line.cloneNode();
                    animated.classList.remove('link-line');
                    animated.classList.add('link-animated');
                    this.svg.appendChild(animated);
                }

                // 更新计数
                this.discoveryCount.textContent = this.discoveredLinks.size;

                // 音效
                if (typeof AudioEngine !== 'undefined') {
                    AudioEngine.playTone(880, 0.2, 'sine');
                    setTimeout(() => AudioEngine.playTone(1100, 0.15, 'sine'), 200);
                }
            }
        });
    }

    /** 显示节点详情 */
    showDetail(id) {
        const event = EVENTS.find(e => e.id === id);
        if (!event) return;

        document.getElementById('detail-year').textContent = event.year + '年';
        document.getElementById('detail-title').textContent = event.title;
        document.getElementById('detail-desc').textContent = event.desc;

        // 因果标签
        const causesDiv = document.getElementById('detail-causes');
        causesDiv.innerHTML = '';
        event.causes.forEach(causeId => {
            const cause = EVENTS.find(e => e.id === causeId);
            if (!cause) return;
            const tag = document.createElement('span');
            tag.className = 'cause-tag';
            tag.textContent = `${cause.title} (${cause.year})`;
            tag.addEventListener('click', () => {
                this.nodeDetail.classList.remove('active');
                this.exploreNode(causeId);
            });
            causesDiv.appendChild(tag);
        });

        // 被影响的事件
        const effects = LINKS.filter(l => l.from === id);
        effects.forEach(link => {
            const target = EVENTS.find(e => e.id === link.to);
            if (!target) return;
            const tag = document.createElement('span');
            tag.className = 'cause-tag';
            tag.style.transform = 'scaleX(-1)';
            tag.textContent = `→ ${target.title} (${target.year})`;
            tag.addEventListener('click', () => {
                this.nodeDetail.classList.remove('active');
                this.exploreNode(target.id);
            });
            causesDiv.appendChild(tag);
        });

        this._previousFocus = document.activeElement;
        this.nodeDetail.classList.add('active');
        document.getElementById('detail-btn').focus();

        // Focus trap
        this._trapFocus = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = this.nodeDetail.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        };
        this.nodeDetail.addEventListener('keydown', this._trapFocus);

        this._escHandler = (e) => {
            if (e.key === 'Escape') {
                this.nodeDetail.classList.remove('active');
                this.nodeDetail.removeEventListener('keydown', this._trapFocus);
                document.removeEventListener('keydown', this._escHandler);
                if (this._previousFocus) this._previousFocus.focus();
            }
        };
        document.addEventListener('keydown', this._escHandler);
    }

    /** 结尾 */
    showEnding() {
        const stats = document.getElementById('ending-stats');
        stats.innerHTML = `
            <div class="stat-item">
                <div class="stat-num">${this.exploredNodes.size}</div>
                <div class="stat-label">历史事件</div>
            </div>
            <div class="stat-item">
                <div class="stat-num">${this.discoveredLinks.size}</div>
                <div class="stat-label">因果关系</div>
            </div>
            <div class="stat-item">
                <div class="stat-num">1840-1978</div>
                <div class="stat-label">跨越年份</div>
            </div>
        `;

        this.ending.classList.add('active');
        this.ending.scrollIntoView({ behavior: 'smooth' });

        if (typeof Storage !== 'undefined' && typeof Storage.setModuleProgress === 'function') {
            Storage.setModuleProgress('mod11', {
                completed: true,
                nodes: this.exploredNodes.size,
                links: this.discoveredLinks.size
            });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    const init = function() {
        new Mod11StarMap();
    };
    if (typeof checkNarrativeTransition === 'function') {
        checkNarrativeTransition(init);
    } else {
        init();
    }
});
