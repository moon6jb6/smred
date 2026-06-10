/**
 * Mod15 审判席 — 状态机 + 3D审判庭 + 4结局
 * 核心机制：用户在审判庭中接受历史的拷问，做出选择，最终获得判决
 *
 * 结局：
 *   A - 无罪：理解了历史的复杂性
 *   B - 有罪：过于轻率地评判历史
 *   C - 释然：接受历史没有简单的对错
 *   D - 觉醒：认识到自己也是历史的一部分
 */

const SCENES = {
    start: {
        speaker: '历史',
        judgeName: '历史',
        text: '你被传唤到审判席。不是为了审判你，而是请你来审判历史。\n\n在你面前的，是过去一百年的中国。每一个选择，都有代价。\n\n你准备好了吗？',
        options: [
            { text: '我准备好了', next: 'scene1' },
            { text: '我不够格审判历史', next: 'humble', score: { wisdom: 1 } }
        ],
        timer: 0
    },

    humble: {
        speaker: '历史',
        text: '谦逊，是理解历史的开始。\n\n那些自以为掌握真理的人，往往离真理最远。\n\n那么，让我们从一个简单的问题开始。',
        options: [
            { text: '请说', next: 'scene1' }
        ],
        timer: 0
    },

    scene1: {
        speaker: '审判官',
        judgeName: '审判官',
        text: '1934年，红军面临绝境。86000人，被40万敌军包围。\n\n有人主张正面突围，有人主张迂回撤退。\n\n如果你是指挥官，你怎么选？',
        options: [
            { text: '正面突围——哪怕付出巨大代价', next: 'scene1_a', score: { courage: 2 } },
            { text: '迂回撤退——保存有生力量', next: 'scene1_b', score: { wisdom: 1 } },
            { text: '这不是简单的军事问题', next: 'scene1_c', score: { insight: 2 }, hidden: true }
        ],
        timer: 30
    },

    scene1_a: {
        speaker: '审判官',
        text: '你选择了正面突围。历史也这么选了。\n\n湘江之战，36000人牺牲。红军从86000锐减到30000。\n\n但主力渡过了湘江。\n\n你认为这个代价值得吗？',
        options: [
            { text: '值得——战略目标达成了', next: 'scene2' },
            { text: '不值得——一定有更好的办法', next: 'scene2', score: { empathy: 1 } }
        ],
        timer: 20
    },

    scene1_b: {
        speaker: '审判官',
        text: '你选择了迂回撤退。但历史告诉我们，当时敌人已经布下了四道封锁线。\n\n迂回，意味着更多的时间，更多的包围，更多的牺牲。\n\n后卫部队20000人，可能全部牺牲。\n\n你还认为这是更好的选择吗？',
        options: [
            { text: '每个选择都有代价', next: 'scene2', score: { wisdom: 1 } },
            { text: '我低估了战争的残酷', next: 'scene2', score: { empathy: 1 } }
        ],
        timer: 20
    },

    scene1_c: {
        speaker: '审判官',
        text: '你说得对。这从来不只是军事问题。\n\n这关系到：谁来承担代价？谁来决定牺牲谁？\n\n36000人，不是数字。是36000个名字，36000个家庭。\n\n你看到了这一点，很好。',
        options: [
            { text: '继续', next: 'scene2', score: { insight: 1 } }
        ],
        timer: 0
    },

    scene2: {
        speaker: '审判官',
        text: '第二个问题。\n\n1935年，遵义。红军损失惨重，军事路线失败。\n\n有人主张更换领导，有人认为应该坚持原有路线。\n\n更换领导，意味着承认之前的牺牲是错误的。坚持路线，可能全军覆没。\n\n你怎么选？',
        options: [
            { text: '更换领导——必须改变', next: 'scene2_a', score: { courage: 1 } },
            { text: '坚持路线——不能否定过去的牺牲', next: 'scene2_b', score: { empathy: 1 } },
            { text: '问题不在于换谁，而在于路线本身', next: 'scene2_c', score: { insight: 2 }, hidden: true }
        ],
        timer: 30
    },

    scene2_a: {
        speaker: '审判官',
        text: '遵义会议召开了。没有流血，只有争论。\n\n毛泽东回到了军事指挥岗位。\n\n这是中国革命的转折点。\n\n但那些在之前路线中牺牲的人，他们的牺牲算什么？',
        options: [
            { text: '他们的牺牲不是白费的', next: 'scene3' },
            { text: '历史没有简单的答案', next: 'scene3', score: { wisdom: 1 } }
        ],
        timer: 20
    },

    scene2_b: {
        speaker: '审判官',
        text: '坚持路线，意味着继续走在可能通向灭亡的路上。\n\n但如果更换领导，那些已经牺牲的人——他们是为了什么而死的？\n\n这是一个没有正确答案的问题。\n\n你选择了坚持，是因为你不愿意否定那些牺牲。这本身，就是一种尊重。',
        options: [
            { text: '继续', next: 'scene3', score: { empathy: 1 } }
        ],
        timer: 0
    },

    scene2_c: {
        speaker: '审判官',
        text: '你看到了问题的本质。\n\n不是"换谁"的问题，是"走哪条路"的问题。\n\n路线错了，再好的将领也无力回天。\n路线对了，即使困难重重，也能找到出路。\n\n你比大多数人看得更透彻。',
        options: [
            { text: '继续', next: 'scene3', score: { insight: 1 } }
        ],
        timer: 0
    },

    scene3: {
        speaker: '审判官',
        text: '最后一个问题。\n\n1949年，新中国成立。但前方还有更大的挑战。\n\n如果你是决策者，面对一个积贫积弱的国家，你会怎么做？',
        options: [
            { text: '优先发展重工业——强国才能自立', next: 'scene3_a', score: { courage: 1 } },
            { text: '优先改善民生——人民需要吃饱饭', next: 'scene3_b', score: { empathy: 1 } },
            { text: '这不是"要么/要么"的选择', next: 'scene3_c', score: { insight: 2 }, hidden: true }
        ],
        timer: 30
    },

    scene3_a: {
        speaker: '审判官',
        text: '你选择了强国之路。历史也这么选了。\n\n代价是：一代人的青春，一代人的温饱。\n\n但换来的是：一个有完整工业体系的国家，一个不再被欺负的国家。\n\n你认为值得吗？',
        options: [
            { text: '值得', next: 'verdict', score: { courage: 1 } },
            { text: '不确定', next: 'verdict', score: { wisdom: 1 } }
        ],
        timer: 20
    },

    scene3_b: {
        speaker: '审判官',
        text: '你选择了人民。这是一个温暖的选择。\n\n但在当时的国际环境下，没有工业基础的国家，随时可能被颠覆。\n\n人民吃饱了饭，但如果国家不在了呢？\n\n这不是一个容易的回答。',
        options: [
            { text: '我理解了历史的艰难', next: 'verdict', score: { empathy: 1 } }
        ],
        timer: 0
    },

    scene3_c: {
        speaker: '审判官',
        text: '你再次看到了更深层的矛盾。\n\n强国与富民，从来不是二选一。\n但在资源有限的情况下，必须有所取舍。\n\n这就是历史的残酷：不是不知道什么是对的，而是对的太多了，资源太少了。\n\n你的理解，超越了简单的评判。',
        options: [
            { text: '我准备接受判决', next: 'verdict', score: { insight: 1 } }
        ],
        timer: 0
    },

    verdict: {
        speaker: '审判官',
        text: '审判结束。\n\n在你做出的选择中，我们看到了你的理解。\n\n现在，历史将给你最终的判决。',
        options: [
            { text: '接受判决', next: 'final' }
        ],
        timer: 0,
        action: 'calculateVerdict'
    },

    final: {
        speaker: '历史',
        text: '',
        options: [],
        timer: 0,
        action: 'showVerdict'
    }
};

const VERDICTS = {
    A: {
        title: '无罪',
        icon: '⚖️',
        text: '你理解了历史的复杂性。你知道每一个选择都有代价，每一个决策都有无奈。\n\n你不轻易评判，因为你尊重那些在绝境中做出选择的人。',
        quote: '"理解，是最好的纪念。"'
    },
    B: {
        title: '有罪',
        icon: '🔨',
        text: '你的选择过于轻率。历史不是非黑即白的判断题。\n\n那些在绝境中做出选择的人，他们面对的不是理论，而是生死。\n\n请重新审视你的理解。',
        quote: '"轻率的审判，是对历史的不尊重。"'
    },
    C: {
        title: '释然',
        icon: '🕊️',
        text: '你接受了历史没有简单的对错。\n\n每一条路都有代价，每一个选择都可能错。\n但不做选择，才是最大的错误。\n\n你释然了。',
        quote: '"历史没有如果，但思考如果，让我们更珍惜现在。"'
    },
    D: {
        title: '觉醒',
        icon: '⭐',
        text: '你认识到：你不是历史的旁观者，你是历史的一部分。\n\n每一个今天的选择，都会成为明天的历史。\n\n你的审判，不是对过去的评判，而是对未来的承诺。',
        quote: '"你就是历史。你做的每一个选择，都在书写它。"'
    }
};

class Mod15Judgment {
    constructor() {
        this.currentScene = 'start';
        this.scores = { courage: 0, wisdom: 0, empathy: 0, insight: 0 };
        this.choices = [];
        this.hiddenCluesFound = 0;
        this.timer = null;
        this.timeLeft = 0;

        this.dialogue = document.getElementById('dialogue');
        this.dialogueSpeaker = document.getElementById('dialogue-speaker');
        this.dialogueText = document.getElementById('dialogue-text');
        this.dialogueOptions = document.getElementById('dialogue-options');
        this.judgeName = document.getElementById('judge-name');
        this.countdown = document.getElementById('countdown');
        this.countdownNum = document.getElementById('countdown-num');
        this.clueHint = document.getElementById('clue-hint');
        this.clueText = document.getElementById('clue-text');
        this.verdictOverlay = document.getElementById('verdict-overlay');
        this.stats = document.getElementById('stats');

        this.init();
    }

    init() {
        this.showScene('start');
        this.initAmbientAudio();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.verdictOverlay.classList.contains('active')) {
                this.verdictOverlay.classList.remove('active');
                this.showStats();
            }
        });
    }

    /** 审判庭环境声 */
    initAmbientAudio() {
        try {
            this.ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
            // 低频嗡鸣 — 审判庭的压迫感
            const osc = this.ambientCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 55;
            const gain = this.ambientCtx.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            gain.connect(this.ambientCtx.destination);
            osc.start();

            // 用户交互后淡入
            const fadeIn = () => {
                if (this.ambientCtx.state === 'suspended') this.ambientCtx.resume();
                gain.gain.linearRampToValueAtTime(0.03, this.ambientCtx.currentTime + 3);
                document.removeEventListener('click', fadeIn);
            };
            document.addEventListener('click', fadeIn, { once: true });

            this.ambientGain = gain;
        } catch(e) {}
    }

    /** 显示场景 */
    showScene(id) {
        const scene = SCENES[id];
        if (!scene) return;

        this.currentScene = id;

        // 清除计时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // 执行动作
        if (scene.action === 'calculateVerdict') {
            this.calculateVerdict();
        } else if (scene.action === 'showVerdict') {
            this.showVerdict();
            return;
        }

        // 更新审判者
        if (scene.judgeName) {
            this.judgeName.textContent = scene.judgeName;
        }

        // 更新对话
        this.dialogueSpeaker.textContent = scene.speaker;
        this.dialogueText.textContent = scene.text;

        // 清空选项
        this.dialogueOptions.innerHTML = '';

        // 添加选项
        scene.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn' + (opt.hidden ? ' hidden-clue' : '');
            btn.textContent = opt.text;

            if (opt.hidden) {
                btn.addEventListener('mouseenter', () => this.showClueHint());
                btn.addEventListener('mouseleave', () => this.hideClueHint());
                btn.addEventListener('focus', () => this.showClueHint());
                btn.addEventListener('blur', () => this.hideClueHint());
            }

            btn.addEventListener('click', () => {
                this.makeChoice(id, opt);
            });

            this.dialogueOptions.appendChild(btn);
        });

        // 显示对话框
        this.dialogue.classList.add('active');

        // 倒计时
        if (scene.timer > 0) {
            this.startTimer(scene.timer);
        } else {
            this.countdown.classList.remove('visible');
        }
    }

    /** 做出选择 */
    makeChoice(fromScene, option) {
        this.choices.push({ scene: fromScene, choice: option.text });

        // 加分
        if (option.score) {
            Object.keys(option.score).forEach(key => {
                this.scores[key] = (this.scores[key] || 0) + option.score[key];
            });
        }

        if (option.hidden) {
            this.hiddenCluesFound++;
        }

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playTone(440, 0.1, 'sine');
        }

        // 跳转
        this.showScene(option.next);
    }

    /** 倒计时 */
    startTimer(seconds) {
        this.timeLeft = seconds;
        this.countdownNum.textContent = this.timeLeft;
        this.countdown.classList.add('visible');
        this.countdown.classList.remove('urgent');

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.countdownNum.textContent = this.timeLeft;

            if (this.timeLeft <= 10) {
                this.countdown.classList.add('urgent');
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                // 时间到，自动选择第一个选项
                const scene = SCENES[this.currentScene];
                if (scene && scene.options.length > 0) {
                    this.makeChoice(this.currentScene, scene.options[0]);
                }
            }
        }, 1000);
    }

    /** 隐藏线索提示 */
    showClueHint() {
        this.clueText.textContent = '这个选项需要更深的洞察力';
        this.clueHint.classList.add('visible');
    }

    hideClueHint() {
        this.clueHint.classList.remove('visible');
    }

    /** 计算判决 */
    calculateVerdict() {
        const { courage, wisdom, empathy, insight } = this.scores;
        const total = courage + wisdom + empathy + insight;

        let verdict;
        if (insight >= 4) {
            verdict = 'D'; // 觉醒
        } else if (empathy >= 3) {
            verdict = 'C'; // 释然
        } else if (courage >= 3 && wisdom < 2) {
            verdict = 'B'; // 有罪
        } else {
            verdict = 'A'; // 无罪
        }

        this.verdictType = verdict;
    }

    /** 显示判决 */
    showVerdict() {
        const v = VERDICTS[this.verdictType || 'A'];

        document.getElementById('verdict-title').textContent = '判决：' + v.title;
        document.getElementById('verdict-text').textContent = v.text;
        document.getElementById('verdict-icon').textContent = v.icon;
        document.getElementById('verdict-quote').textContent = v.quote;

        this.verdictOverlay.classList.add('active');

        // 环境声加强
        if (this.ambientGain) {
            this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ambientCtx.currentTime + 1);
            this.ambientGain.gain.linearRampToValueAtTime(0, this.ambientCtx.currentTime + 5);
        }

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playTone(220, 0.5, 'triangle');
        }

        // 地理位置个性化
        this.addLocationPersonalization();

        document.getElementById('verdict-btn').onclick = () => {
            this.verdictOverlay.classList.remove('active');
            if (this.ambientCtx) this.ambientCtx.close();
            this.showStats();
        };
    }

    /** 地理位置个性化 */
    addLocationPersonalization() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            // 简单判断是否在长征路线相关省份附近
            const locEl = document.getElementById('verdict-location');
            if (locEl) {
                locEl.textContent = `你此刻在北纬${lat.toFixed(1)}°，东经${lon.toFixed(1)}°。历史不在远方，就在你脚下。`;
                locEl.style.display = 'block';
            }
        }, () => {}); // 静默失败
    }

    /** 显示统计 */
    showStats() {
        const grid = document.getElementById('stats-grid');
        grid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${this.verdictType ? VERDICTS[this.verdictType].title : '无罪'}</div>
                <div class="stat-label">判决结果</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.choices.length}</div>
                <div class="stat-label">做出选择</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.hiddenCluesFound}</div>
                <div class="stat-label">发现隐藏线索</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.scores.insight || 0}</div>
                <div class="stat-label">洞察力</div>
            </div>
        `;

        this.stats.classList.add('active');
        this.stats.scrollIntoView({ behavior: 'smooth' });

        // 保存
        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod15', {
                completed: true,
                verdict: this.verdictType,
                choices: this.choices.length,
                hidden: this.hiddenCluesFound
            });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod15Judgment();
    });
});
