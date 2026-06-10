/**
 * Mod9 抉择电台 — 先看后果→再做选择
 * 核心机制：用户先看到选择的后果（5秒场景重现），再决定是否坚持
 */

const SCENES = [
    {
        title: '湘江渡口',
        year: '1934年11月',
        desc: '湘江之畔，敌人布下第四道封锁线。你必须决定：正面强渡，还是轻装急行绕道而行？',
        choices: [
            { label: '正面强渡', cost: 36000, aftermath: '湘江之水，被血染红。36000人倒在了渡口两岸。但主力部队渡过了湘江。' },
            { label: '轻装急行', cost: 20000, aftermath: '丢弃辎重急行军，但敌人追了上来。20000人牺牲，大部分是负责掩护的后卫部队。' }
        ],
        historical: { choice: 0, note: '历史选择了正面强渡。湘江战役后，红军从86000人锐减到30000人。' }
    },
    {
        title: '遵义会议',
        year: '1935年1月',
        desc: '军事路线失败，红军损失惨重。你必须决定：继续执行原定路线，还是更换军事指挥？',
        choices: [
            { label: '更换指挥', cost: 0, aftermath: '会议决定更换军事指挥。没有流血，但争论激烈。从此，毛泽东回到军事指挥岗位。' },
            { label: '维持原状', cost: 50000, aftermath: '如果继续原定路线，按当时的损失速度，红军可能在一个月内全军覆没。' }
        ],
        historical: { choice: 0, note: '遵义会议是中国革命的转折点。' }
    },
    {
        title: '飞夺泸定桥',
        year: '1935年5月',
        desc: '大渡河上，只剩下泸定桥。13根铁索，对面是敌人的机枪。你必须决定：强攻，还是寻找其他渡口？',
        choices: [
            { label: '强攻泸定桥', cost: 4, aftermath: '22名突击队员攀爬铁索，4人牺牲。但大部队渡过了大渡河，避免了石达开的覆灭。' },
            { label: '寻找其他渡口', cost: 15000, aftermath: '沿河搜索三天，遭遇敌人围追堵截。15000人牺牲，仍未找到渡口。' }
        ],
        historical: { choice: 0, note: '22名突击队员用生命打开了前进的道路。' }
    },
    {
        title: '过雪山',
        year: '1935年6月',
        desc: '夹金山，海拔4000米。空气稀薄，气温零下。你必须决定：翻越雪山，还是绕道而行？',
        choices: [
            { label: '翻越雪山', cost: 10000, aftermath: '缺氧、严寒、饥饿。10000人倒在了雪山上。但翻过雪山，就是希望。' },
            { label: '绕道而行', cost: 30000, aftermath: '绕道意味着多走两个月。敌人的包围圈会收紧，30000人可能无法突围。' }
        ],
        historical: { choice: 0, note: '红军翻越了夹金山，与红四方面军在懋功会师。' }
    },
    {
        title: '最后的抉择',
        year: '1936年10月',
        desc: '长征即将结束。但你面前还有一个选择：继续前进，还是停下休整？',
        choices: [
            { label: '继续前进', cost: 500, aftermath: '最后500人倒在了会宁城外。但三大主力终于会师。长征结束了。' },
            { label: '停下休整', cost: 0, aftermath: '停下来，意味着活下来。但也意味着，可能错过会师的那一刻。' }
        ],
        historical: { choice: 0, note: '1936年10月，红军三大主力在会宁胜利会师。长征结束。' },
        noChoice: true // 最后一个场景，用户无法操作
    }
];

class Mod9ChoiceRadio {
    constructor() {
        this.currentScene = 0;
        this.totalCost = 0;
        this.choices = [];

        this.costNumber = document.getElementById('cost-number');
        this.sceneContainer = document.getElementById('scene-container');
        this.aftermathOverlay = document.getElementById('aftermath-overlay');
        this.comparisonSection = document.getElementById('comparison-section');

        this.init();
    }

    init() {
        this.renderScene(0);
    }

    updateCost() {
        this.costNumber.textContent = this.totalCost.toLocaleString();
    }

    renderScene(index) {
        if (index >= SCENES.length) {
            this.showJudgment();
            return;
        }

        const scene = SCENES[index];
        this.sceneContainer.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'scene-card';
        card.innerHTML = `
            <h2 class="scene-title">${scene.title}</h2>
            <div class="scene-year">${scene.year}</div>
            <p class="scene-desc">${scene.desc}</p>
            <div class="choice-btns">
                ${scene.choices.map((c, i) =>
                    `<button class="choice-btn" data-scene="${index}" data-choice="${i}">${c.label}</button>`
                ).join('')}
            </div>
        `;
        this.sceneContainer.appendChild(card);

        // 绑定选择事件
        card.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ci = parseInt(btn.dataset.choice);
                this.makeChoice(index, ci);
            });
        });

        // 无法选择场景：禁用按钮，显示倒计时
        if (scene.noChoice) {
            card.querySelectorAll('.choice-btn').forEach(btn => {
                btn.classList.add('disabled');
                btn.disabled = true;
            });
            this.showNoChoice(index);
        }
    }

    makeChoice(sceneIndex, choiceIndex) {
        const scene = SCENES[sceneIndex];
        const choice = scene.choices[choiceIndex];

        this.choices.push({ scene: sceneIndex, choice: choiceIndex });

        // 立即更新代价计数器
        this.totalCost += choice.cost;
        this.updateCost();

        // VHS倒带效果
        this.playRewindEffect(() => {
            // 先显示后果场景
            this.showAftermath(scene, choice, () => {
                // 然后显示历史对比
                this.showComparison(scene, choiceIndex, () => {
                    // 下一个场景
                    this.renderScene(sceneIndex + 1);
                });
            });
        });
    }

    /** VHS 倒带效果 */
    playRewindEffect(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'rewind-overlay';
        overlay.innerHTML = `
            <div class="rewind-lines"></div>
            <div class="rewind-text">◀◀ 倒带中...</div>
        `;
        document.body.appendChild(overlay);

        // 静态噪声音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playStatic(0.4);
        }

        setTimeout(() => {
            overlay.classList.add('active');
        }, 50);

        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 500);
            callback();
        }, 1200);
    }

    showAftermath(scene, choice, callback) {
        this.aftermathOverlay.classList.add('active');
        document.getElementById('aftermath-title').textContent = '如果选择了"' + choice.label + '"';
        document.getElementById('aftermath-desc').textContent = choice.aftermath;
        document.getElementById('aftermath-cost').textContent = '代价：' + choice.cost.toLocaleString() + ' 人';

        const btn = document.getElementById('aftermath-btn');
        btn.textContent = '继续';
        btn.onclick = () => {
            this.aftermathOverlay.classList.remove('active');
            callback();
        };
    }

    showComparison(scene, choiceIndex, callback) {
        const histChoice = scene.historical.choice;
        const userChoice = scene.choices[choiceIndex];
        const histChoiceData = scene.choices[histChoice];

        this.comparisonSection.classList.add('active');
        this.comparisonSection.innerHTML = `
            <div class="comp-side">
                <h3>你的选择</h3>
                <div class="comp-text">${userChoice.label}</div>
                <div class="comp-cost">${userChoice.cost.toLocaleString()} 人</div>
            </div>
            <div class="comp-side">
                <h3>历史的选择</h3>
                <div class="comp-text">${histChoiceData.label}</div>
                <div class="comp-cost">${histChoiceData.cost.toLocaleString()} 人</div>
            </div>
            <div style="grid-column: 1 / -1; text-align: center; padding: 1rem;">
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${scene.historical.note}</p>
                <button class="aftermath-btn" id="comp-continue">继续</button>
            </div>
        `;

        document.getElementById('comp-continue').addEventListener('click', () => {
            this.comparisonSection.classList.remove('active');
            callback();
        });
    }

    showNoChoice(sceneIndex) {
        const scene = SCENES[sceneIndex];
        const noChoiceDiv = document.createElement('div');
        noChoiceDiv.className = 'no-choice';
        noChoiceDiv.innerHTML = `
            <p class="no-choice-text">有些时刻，你什么都做不了。<br>只能看着。</p>
            <div class="no-choice-timer" id="no-choice-timer">10</div>
        `;
        this.sceneContainer.appendChild(noChoiceDiv);

        let countdown = 10;
        const timerEl = document.getElementById('no-choice-timer');
        const timer = setInterval(() => {
            countdown--;
            timerEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timer);
                this.totalCost += SCENES[sceneIndex].choices[0].cost;
                this.updateCost();
                this.renderScene(sceneIndex + 1);
            }
        }, 1000);
    }

    showJudgment() {
        this.sceneContainer.innerHTML = '';
        const historicalTotal = 79000;

        // 构建对比图表数据
        const chartBars = this.choices.map((c, i) => {
            const scene = SCENES[c.scene];
            const userCost = scene.choices[c.choice].cost;
            const histCost = scene.choices[scene.historical.choice].cost;
            return { title: scene.title, userCost, histCost };
        });

        const maxCost = Math.max(...chartBars.map(b => Math.max(b.userCost, b.histCost)), 1);

        const chartHTML = chartBars.map(b => {
            const userW = (b.userCost / maxCost * 100) || 1;
            const histW = (b.histCost / maxCost * 100) || 1;
            return `
                <div class="chart-row">
                    <div class="chart-label">${b.title}</div>
                    <div class="chart-bars">
                        <div class="chart-bar chart-bar-user" style="width:${userW}%">
                            <span>${b.userCost.toLocaleString()}</span>
                        </div>
                        <div class="chart-bar chart-bar-hist" style="width:${histW}%">
                            <span>${b.histCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const judgment = document.createElement('div');
        judgment.className = 'judgment';
        judgment.innerHTML = `
            <h2 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 1.5rem;">审判结果</h2>
            <p class="judgment-text">
                你做出了 ${this.choices.length} 个选择。<br>
                在你的选择中，共有 <span class="number-red">${this.totalCost.toLocaleString()}</span> 人牺牲。<br>
            </p>
            <div class="chart-container">
                <div class="chart-legend">
                    <span class="legend-user">你的选择</span>
                    <span class="legend-hist">历史的选择</span>
                </div>
                ${chartHTML}
            </div>
            <p class="judgment-text" style="margin-top:2rem;">
                历史中的选择，牺牲了更多人。<br>
                86000人出发，7000人到达。<br>
                <span class="number-red">79000</span>人，再也没有回来。
            </p>
            <div class="judgment-total">${this.totalCost.toLocaleString()}</div>
            <p class="judgment-quote">
                "历史没有'如果'。<br>
                但每一个'如果'，都值得我们思考。<br>
                因为理解选择的代价，才能珍惜今天的一切。"
            </p>
        `;
        this.sceneContainer.appendChild(judgment);

        // 条形图动画
        setTimeout(() => {
            judgment.querySelectorAll('.chart-bar').forEach(bar => {
                bar.style.transition = 'width 1s ease';
            });
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod9ChoiceRadio();
    });
});
