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
        content: '1931年4月24日，顾顺章在武汉被捕叛变。这个掌握着中共中央几乎所有核心机密的特科负责人，一夜之间变成了最致命的叛徒。',
        story: '白色恐怖笼罩上海。顾顺章的叛变意味着周恩来、瞿秋白、王明等中央领导人的住所、联络点、安全屋全部暴露。武汉方面连发六封绝密急电到南京中统局，收件人是徐恩曾——而拆开这些电报的人，是钱壮飞。',
        detail: '顾顺章时任中央特科行动科科长，掌握着上海地下党的全部网络。1931年4月24日他在武汉被捕后当即叛变，要求面见蒋介石，声称可以一举破获中共中央机关。武汉方面致电南京中统局局长徐恩曾，电报在25日夜间陆续到达。'
    },
    {
        type: 'photo', x: '70%', y: '15%', icon: '📷',
        content: '一张模糊的合影 — 1929年冬，中央特科情报科核心成员在上海法租界秘密据点的合影。照片背面用铅笔写着五个代号，没有一个真名。',
        story: '他们没有名字，只有代号。"黎明""洛甫""伍豪"——这些代号背后，是一群把生死置之度外的人。中央特科成立于1927年11月，由周恩来直接领导，下设总务科、情报科、行动科和交通科。他们在上海租界的暗巷中穿行，在敌人的心脏里扎根。有人潜伏十年未暴露身份，有人至死没有留下一张照片。',
        detail: '中央特科是中共中央最早的专门情报保卫机构，1927年11月在上海成立。情报科科长陈赓化名"王庸"，在法租界巡捕房和青帮中都建立了秘密关系网。特科成员的合影极其稀少，大多在紧急撤离时被销毁，这张照片是从一位牺牲同志的遗物夹层中被发现的。'
    },
    {
        type: 'code', x: '30%', y: '55%',
        content: '密电原文："黎明已投诚，共匪中央机关即日可破获。请速呈蒋主席。——武汉行营"',
        story: '1931年4月25日深夜，钱壮飞在南京中统局值班室独自破译了这封密电。他的手在发抖——不是因为恐惧，而是因为他意识到，他只有不到48小时的时间来通知整个中共中央。他是潜伏在国民党情报核心的共产党员，代号"克潮"，此刻他必须做出选择：暴露自己，还是眼睁睁看着同志们走向死亡。',
        detail: '这封电报共七封，由武汉行营主任何成浚发出，经由徐恩曾的机要秘书钱壮飞之手。钱壮飞当晚独自值班，逐一译出电文后，立即派他的女婿刘杞夫连夜赶赴上海通知李克农。自己则在安排好一切后于次日凌晨撤离南京，从此结束了他在中统局近三年的潜伏生涯。'
    },
    {
        type: 'object', x: '80%', y: '45%', icon: '🔑',
        content: '一把锈迹斑斑的钥匙 — 打开保险柜用。这把钥匙的主人是白鑫，中央军委秘书，他在叛变后带敌人搜查了这个保险柜。',
        story: '保险柜里存放着上海地下党的党员名单、联络暗号、安全屋地址和交通路线图。白鑫叛变后，敌人用这把钥匙打开了保险柜，但里面只剩下几页无关紧要的废纸——真正的核心文件已经被提前转移。在情报战线上，有时一把钥匙的价值等于几百条人命。',
        detail: '1929年8月，中央军委秘书白鑫叛变，导致彭湃、杨殷、颜昌颐、邢士贞四位同志被捕后牺牲。周恩来亲自下令"锄奸"，中央特科红队在1929年11月11日将白鑫击毙于上海霞飞路。这次行动震动了整个上海滩，被称为"东方第一大暗杀案"。'
    },
    {
        type: 'text', x: '50%', y: '75%',
        content: '钱壮飞在48小时内完成了一项几乎不可能的任务：通知所有相关同志转移。他先派女婿刘杞夫赶赴上海通知李克农，再通过秘密联络渠道通知陈赓，由陈赓转报周恩来。中央机关在敌人破门之前全部安全撤离。',
        story: '钱壮飞，1895年生于浙江湖州，1925年加入中国共产党。他以国民党中统局局长徐恩曾私人秘书的身份潜伏近三年，每天在敌人眼皮底下工作。顾顺章叛变后，他截获密电、通知组织、安排撤离，整个行动滴水不漏。撤离前他还在办公桌上留了一张纸条："可均先生（徐恩曾字可均），大驾光临，未及远迎，恕罪恕罪。走时匆忙，未及面辞，见谅见谅。"这份从容，让徐恩曾又恨又怕。钱壮飞于1935年长征途中在贵州息烽附近牺牲，年仅40岁。',
        detail: '钱壮飞在中统局的身份极为特殊——他是徐恩曾最信任的私人秘书，掌管着中统局的核心密码本。正是利用这一身份，他才能在第一时间破译武汉方面的绝密电报。撤离时他不仅带走了密码本，还带走了徐恩曾的一些私密材料，使徐恩曾投鼠忌器，不敢深追。毛泽东后来评价说："如果没有钱壮飞，我们这些人早就不存在了。"'
    },
    {
        type: 'code', x: '20%', y: '80%',
        content: '代号"医生"已安全撤离至苏区。代号"裁缝"于1931年6月在杨树浦被捕，受尽酷刑后牺牲，时年28岁。代号"裁缝"的真名至今不详。',
        story: '有人活下来了，有人没有。活着的人继续潜伏，在更黑暗的地方执行更危险的任务。牺牲的人连真名都不能刻在墓碑上——他们用的是假身份证，住的是化名，连房东都不知道隔壁住的是谁。在那个年代，一个地下党员的死亡往往悄无声息，组织上可能几个月后才通过秘密渠道得知消息，而为了安全，甚至不能公开悼念。',
        detail: '1931年顾顺章叛变后，上海地下党遭受了严重的破坏。据统计，因顾顺章叛变直接或间接牺牲的共产党员超过百人。许多同志在转移途中与组织失去联系，有些人辗转数年才重新接上关系，有些人则永远消失在了历史的尘埃中。周恩来的住所在通知发出后的第二天就被敌人包围，仅仅差了几个小时。'
    },
    {
        type: 'photo', x: '60%', y: '35%', icon: '📜',
        content: '一份用米汤写的密信——只有用碘酒涂抹后才能显现文字。信中写着：中央机关已安全转移，切勿回原驻地，等待新的联络信号。——1931年5月',
        story: '看不见的文字，看不见的人。这是中共地下党最常用的密写技术之一：用毛笔蘸米汤在白纸上书写，晾干后字迹完全消失，只有用碘酒涂抹才能让文字重新显现。除此之外，他们还使用过柠檬汁密写、牛奶密写、甚至用五倍子溶液配合明矾水显影等技术。每一封密信背后，都是一个在黑暗中传递火种的人。',
        detail: '中共地下党的密写技术经历了从简单到复杂的发展过程。早期使用米汤、牛奶等日常用品密写，后期发展出更复杂的化学密写方法。情报传递还经常使用隐语和暗号系统，例如用"生意"代指革命工作，用"进货"代指运武器，用"朋友"代指同志。这些情报技术在没有现代加密手段的年代，是保护组织安全的最后一道屏障。'
    },
    {
        type: 'object', x: '40%', y: '30%', icon: '⌚',
        content: '一块怀表，表盖内侧刻着"忍"字。这块表属于一位在国民党内部潜伏了十二年的情报员。他每天都要在敌人面前伪装成一个忠诚的官员，回到住所后才能对着这块表，想起自己是谁。',
        story: '忍，不是软弱。是在黑暗中等待黎明的勇气。是明知可能等不到黎明，依然选择等待。对一个潜伏者来说，最难的不是完成任务，而是日复一日地伪装——要记住自己说过的每一句谎话，要控制住每一次看到同志被捕时的本能反应，要在敌人的宴席上举杯微笑，而心里知道那些酒杯碰在一起的声音，可能是某位同志生命的丧钟。十二年，四千多个日夜，没有一天可以做真正的自己。',
        detail: '长期潜伏对情报人员的心理考验是常人难以想象的。他们不仅要承受随时可能暴露的生命危险，更要承受身份撕裂带来的精神痛苦。有些人潜伏时间长达十年甚至二十年，期间不能与家人联系，不能表达真实情感，甚至在同志被捕时也不能流露出任何异常。许多潜伏者在晚年回忆说，最痛苦的不是危险，而是孤独。'
    }
];

const HEROES = [
    {
        name: '钱壮飞',
        role: '龙潭三杰之首，截获顾顺章叛变密电的英雄',
        years: '1895-1935',
        detail: '1929年打入国民党中统局核心，成为局长徐恩曾最信任的私人秘书，掌管中统核心密码本。1931年4月截获顾顺章叛变密电后，在48小时内通知中央机关全部安全撤离，挽救了周恩来等大批中央领导人。撤离时从容留书，令徐恩曾无可奈何。',
        quote: '他在办公桌上留下纸条："可均先生，大驾光临，未及远迎，恕罪恕罪。走时匆忙，未及面辞，见谅见谅。"'
    },
    {
        name: '李克农',
        role: '龙潭三杰之一，唯一没有领过兵的开国上将',
        years: '1899-1962',
        detail: '长期潜伏在国民党情报系统内部，与钱壮飞、胡底并称"龙潭三杰"。1931年顾顺章叛变后负责善后重建工作，重新编织了被破坏的情报网络。抗日战争期间主持对日情报工作，解放战争时期领导了多次关键的情报行动，为三大战役的胜利提供了重要的战略情报支持。',
        quote: '毛泽东曾说："李克农是中国共产党的大特务，但他是我们的人。"'
    },
    {
        name: '胡底',
        role: '龙潭三杰之一，北方情报网的缔造者',
        years: '1905-1935',
        detail: '以"北方通讯社"社长的公开身份为掩护，在北平建立了覆盖华北地区的情报网络，搜集了大量国民党军事和政治情报。1931年顾顺章叛变后被迫撤离，随红军参加长征。1935年在长征途中被张国焘以"国民党特务"的罪名秘密杀害，年仅30岁，直到1945年才被追认为革命烈士。',
        quote: '他是"龙潭三杰"中最年轻的一个，也是牺牲最早的一个，至死没有等到平反的那一天。'
    },
    {
        name: '阎宝航',
        role: '战略情报专家，被誉为"东方的佐尔格"',
        years: '1895-1968',
        detail: '1937年秘密加入中共后，以国民党高级官员的公开身份潜伏在蒋介石身边。1941年6月提前获取纳粹德国进攻苏联的"巴巴罗萨计划"确切日期，紧急通报苏联，使苏军得以提前备战。同年又提前获悉日军偷袭珍珠港的战略情报，是中共情报史上获取战略级情报最多的人之一。',
        quote: '周恩来评价他："阎宝航同志一个人的情报，抵得上一个军。"'
    },
    {
        name: '沈安娜',
        role: '潜伏在蒋介石身边十一年的速记员，"按住蒋介石脉搏的人"',
        years: '1915-2010',
        detail: '1938年打入国民党中央党部担任机要速记员，凭借一手漂亮的速记本领深得信任，参加了国民党几乎所有最高级别会议。蒋介石主持的国防最高委员会会议、国民党中央常务委员会会议，她都在场逐字记录，会后将速记内容秘密转交中共。十一年间从未暴露，被誉为"按住蒋介石脉搏的人"。',
        quote: '她晚年回忆说："我在会上记录蒋介石的每一句话，散会后就把速记稿交给组织。蒋介石做梦也想不到，他身边最不起眼的速记员，是共产党。"'
    },
    {
        name: '熊向晖',
        role: '潜伏在胡宗南身边十二年的"龙潭后三杰"之首',
        years: '1919-2005',
        detail: '1937年受周恩来亲自派遣打入胡宗南身边，从侍从副官升任机要秘书，深得胡宗南信任。1943年提前获取胡宗南闪击延安的作战计划，使中共中央得以从容应对，避免了一场重大危机。毛泽东称赞他"一个人能顶几个师"，周恩来称他是自己一生中最得意的两个秘密党员之一。',
        quote: '周恩来曾说："我党打入国民党内部的情报人员，最成功的是熊向晖。他一个人，就能抵得上几个师。"'
    }
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
        const fullStory = clue.detail ? clue.story + '\n\n' + clue.detail : clue.story;
        this.storyFragments.push(fullStory);

        // 更新计数
        this.foundNum.textContent = this.foundClues.length;

        // 显示故事
        setTimeout(() => this.showStory(fullStory), 500);

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
                <div class="card-detail">${h.detail}</div>
                <div class="card-quote">${h.quote}</div>
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
