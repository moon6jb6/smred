/**
 * Mod9 抉择电台 — 先看后果→再做选择
 * 核心机制：用户先看到选择的后果（5秒场景重现），再决定是否坚持
 */

const SCENES = [
    {
        title: '湘江渡口',
        year: '1934年11月27日',
        desc: '广西全州至兴安之间60里湘江渡口，蒋介石调集30万大军布下第四道封锁线，湘军、桂军、中央军三面合围。红三军团在新圩阻击桂军两个师，红一军团在脚山铺血战湘军四个师。每一小时的延误，都有数百人倒下。你必须决定：正面强渡湘江，还是丢弃辎重轻装急行绕道突围？',
        quote: '英雄血染湘江渡，江底尽埋英烈骨。三年不饮湘江水，十年不食湘江鱼。',
        detail: '湘江战役是长征中最惨烈的一战。红五军团第三十四师担任后卫，师长陈树湘率部拼死掩护主力过江。部队被截断后，陈树湘腹部中弹被俘。敌兵用担架抬着他去邀功，途中他从伤口处扯出自己的肠子绞断，壮烈牺牲，年仅29岁。他实现了"为苏维埃流尽最后一滴血"的誓言。那一夜，湘江的水真的变成了红色——两岸百姓多年不敢饮江水、食江鱼。',
        choices: [
            {
                label: '正面强渡',
                cost: 36000,
                aftermath: '湘江之水被鲜血染红，整整三天三夜没有恢复原来的颜色。36000人倒在了渡口两岸——新圩阵地上的红五师几乎全师阵亡，脚山铺的红一军团指挥所都被迫投入了战斗。但中央纵队带着所有辎重安全渡过了湘江。陈树湘的第三十四师被截断在江东，全师3000余人几乎无人生还。师长断肠明志，年仅29岁。'
            },
            {
                label: '轻装急行',
                cost: 20000,
                aftermath: '你下令丢弃所有辎重——印刷机、X光机、兵工厂的设备，那些从中央苏区一路抬来的"家当"全部沉入湘江。急行军中队伍拉成了一条长蛇，后卫部队被敌人追上。红三十四师师长陈树湘率5000人殿后，全部壮烈牺牲。20000人倒在了湘江两岸，其中包括大量没有武器的后勤人员和伤员。'
            }
        ],
        historical: { choice: 0, note: '历史选择了正面强渡。湘江战役后，红军从出发时的86000人锐减到30000余人。湘江的水被染红了三天。当地百姓说："三年不饮湘江水，十年不食湘江鱼。"' }
    },
    {
        title: '遵义会议',
        year: '1935年1月15日',
        desc: '贵州遵义，柏辉章公馆二楼。红军残部30000余人疲惫不堪，湘江惨败的阴影笼罩全军。博古做主报告时仍在为"三人团"的军事路线辩护，但会场气氛已经压抑到了极点。三天三夜的激烈争论即将开始——毛泽东、张闻天、王稼祥将联合发起对错误军事路线的批评。你必须决定：支持更换军事指挥，还是维持原定路线？',
        quote: '遵义会议放光芒，全党全军喜洋洋。挽救了革命挽救了党，中国革命有希望。',
        detail: '遵义会议历时三天三夜（1月15日至17日），是中共党史上生死攸关的转折点。博古作主报告后，张闻天首先发难，做了反对"左"倾军事路线的报告（史称"反报告"）。毛泽东随后作了长篇发言，系统批判了第五次反"围剿"和长征初期的军事错误，指出"堡垒对堡垒""短促突击"等战术的致命缺陷。王稼祥带病躺在担架上发言，第一个提议毛泽东出来指挥红军。会议最终决定：增选毛泽东为政治局常委，取消"三人团"，由周恩来、朱德指挥军事，毛泽东协助。这是毛泽东自1932年宁都会议被剥夺军权后，重新回到军事指挥岗位。',
        choices: [
            {
                label: '更换指挥',
                cost: 0,
                aftermath: '会议持续了三天三夜，争论激烈到几乎撕裂了整个领导层。博古的报告被彻底否定，李德（共产国际军事顾问）被解除了军事指挥权。王稼祥躺在担架上第一个发言支持毛泽东。没有流血，没有逮捕，但这场会议彻底改变了红军的命运——毛泽东回到了军事指挥岗位。从此以后，红军不再是那支被动挨打的军队。四渡赤水、巧渡金沙江，一连串灵活机动的战术即将展开。'
            },
            {
                label: '维持原状',
                cost: 50000,
                aftermath: '如果继续执行博古、李德的军事路线——堡垒对堡垒、短促突击、带着全部辎重行军——按湘江战役后的消耗速度推算，30000人的红军残部将在一个月内被蒋介石的40万大军逐步蚕食殆尽。红军将不复存在，中国革命将失去最核心的武装力量。那些在湘江边倒下的36000人，他们的牺牲将变得毫无意义。'
            }
        ],
        historical: { choice: 0, note: '遵义会议是中国革命生死攸关的转折点。毛泽东重新回到军事指挥岗位后，指挥红军四渡赤水、巧渡金沙江，彻底跳出了敌人的包围圈。周恩来后来说："遵义会议开了三天，改变了中国革命的命运。"' }
    },
    {
        title: '飞夺泸定桥',
        year: '1935年5月29日',
        desc: '大渡河安顺场渡口，河水湍急，浪高三丈。太平天国翼王石达开就是在此全军覆没。蒋介石放话要让红军成为"石达开第二"。全军仅有三条小船，每次只能渡40人，几万大军要渡完需要一个月。前有大渡河天险，后有薛岳十万追兵，唯一的希望是上游240里外的泸定桥——13根铁索横跨百米河面。但距泸定桥还有240里，只剩一天一夜。你必须决定：急行军240里强攻泸定桥，还是沿河搜索其他渡口？',
        quote: '泸定桥边万重山，高峰入云千里长。我们的红军都是英雄汉，千锤百炼不怕难。',
        detail: '1935年5月28日，红四团接到命令：必须在29日早晨赶到泸定桥。此时距泸定桥还有240里（120公里），山路崎岖，暴雨如注。团长黄开湘、政委杨成武率全团2400人日夜兼程，一边急行军一边消灭沿途阻击的敌军。到达泸定桥时，桥面木板已被敌人拆走，只剩13根寒光闪闪的铁索。下午四点，22名突击队员冒着枪林弹雨攀索过桥——他们身上挂着马刀，腰间别着手榴弹，脚踩铁索，身下是咆哮的大渡河。突击队员廖大珠第一个冲到对岸，后续战士边铺木板边跟进。经过两小时激战，红军占领泸定城，主力部队安全渡过大渡河。22名突击队员中，4人牺牲。',
        choices: [
            {
                label: '急行240里，强攻泸定桥',
                cost: 4,
                aftermath: '红四团在暴雨中急行军240里，创造了世界军事史上的行军奇迹。到达泸定桥时，22名突击队员攀着13根光溜溜的铁索，向对岸爬去。脚下是翻滚咆哮的大渡河，对面是敌人密集的机枪火舌。子弹打在铁索上火星四溅，第一个战士中弹坠入河中，紧接着第二个、第三个……但他们没有停下。4人牺牲在铁索上，其余18人冲到了对岸。两小时后，泸定桥被攻占，三万红军渡过了大渡河。石达开的悲剧，没有重演。'
            },
            {
                label: '沿河搜索其他渡口',
                cost: 15000,
                aftermath: '沿大渡河上下游搜索了三天，每一个可能的渡口都被敌人封锁。河水湍急，几次尝试用木筏渡河都被冲散。薛岳的追兵从身后压了上来，川军刘文辉的部队在对岸严阵以待。15000人在搜索、渡河、阻击中牺牲。最终不得不回头强攻泸定桥——但此时敌人已经加固了桥头工事，伤亡更加惨重。86年前石达开的悲剧，几乎在同一个地方重演。'
            }
        ],
        historical: { choice: 0, note: '22名突击队员冒着枪林弹雨攀索过桥，4人牺牲。红四团一天一夜急行军240里，创造了世界军事史上的奇迹。毛泽东站在泸定桥头说："我们的红军都是英雄汉。"' }
    },
    {
        title: '过雪山',
        year: '1935年6月',
        desc: '夹金山，海拔4900米，当地藏民称之为"神仙山"——鸟儿飞不过，神仙也难过。六月的山顶气温零下三十度，空气含氧量不到平地的一半。红军战士大多来自江西、湖南，从未见过雪山，身上穿的还是单衣草鞋。粮食已经断绝，许多人靠吃辣椒、喝姜汤驱寒。但翻过这座山，就是懋功——红四方面军在那里等着会师。你必须决定：翻越雪山，还是绕道而行？',
        quote: '夹金山，夹金山，鸟儿飞不过，人不攀。要想越过夹金山，除非神仙到人间。',
        detail: '1935年6月12日，红一方面军先头部队开始翻越夹金山。海拔4900米的山口，氧气含量不足平原的一半，气温低至零下三十度。战士们穿着单衣草鞋，靠吃辣椒、喝姜汤取暖。许多人在攀登途中坐下休息，就再也没有站起来——他们的身体已经被冻僵，脸上还保持着微笑的表情。有人走着走着突然倒下，身边的战友去拉他，才发现人已经停止了呼吸。最令人心碎的是那些背靠雪山坐着的战士，双手合在胸前，像是在祈祷，又像是在取暖——他们的生命永远留在了海拔4900米的雪山上。翻过夹金山后，红一方面军在懋功与红四方面军胜利会师，但翻山途中牺牲的战士超过了10000人。',
        choices: [
            {
                label: '翻越雪山',
                cost: 10000,
                aftermath: '凌晨三点出发，战士们在黑暗中沿着前人留下的脚印一步步往上爬。越往上走，空气越稀薄，每走一步都要大口喘气。有人坐下休息，就再也没有站起来——身体被冻成了冰雕，脸上还带着微笑。有人在雪地里挖了一个坑，把自己的棉衣脱下来盖在身边的战友身上，然后默默闭上了眼睛。10000人倒在了雪山上，他们没有名字，没有墓碑，只有那座永远不会融化的雪山记得他们。但翻过山顶的那一刻，远处的懋功方向升起了炊烟——红四方面军来了。'
            },
            {
                label: '绕道而行',
                cost: 30000,
                aftermath: '绕道意味着多走两个月的路程。敌人的包围圈正在收紧——薛岳的中央军从南面压来，胡宗南的部队在北面堵截，川军在东面布防。每多走一天，就有更多战士在饥饿、疾病和战斗中倒下。30000人可能无法突围。而翻过雪山的战友们，已经与红四方面军在懋功会师了。'
            }
        ],
        historical: { choice: 0, note: '红军翻越了夹金山——海拔4900米，气温零下三十度。10000多人在雪山上长眠，他们的身体被冰雪覆盖，成为雪山的一部分。翻过雪山后，红一、四方面军在懋功胜利会师。' }
    },
    {
        title: '最后的抉择',
        year: '1936年10月22日',
        desc: '甘肃会宁城外，红一、红二、红四方面军即将在这里胜利会师。两年零十天，纵横十一个省，翻越十八座山脉，渡过二十四条河流，走过荒草地，翻过雪山。出发时的86000人，只剩下不到7000人。你已经走到了最后一步——但面前还有一个选择：继续前进完成会师，还是停下休整？',
        quote: '长征是宣言书，长征是宣传队，长征是播种机。——毛泽东',
        detail: '1936年10月22日，红二方面军到达甘肃将台堡，与红一方面军会师。至此，红军三大主力全部会合，长征胜利结束。从1934年10月到1936年10月，整整两年。红军翻越了18座山脉（其中5座终年积雪），渡过了24条河流，经过了12个省份，占领过62座城市，突破了10个地方军阀的包围，追击的中央军超过100万人。出发时的86000人，到达陕北时只剩下不到7000人——每走12公里，就有一名红军战士倒下。但正是这支不到7000人的队伍，在十三年后建立了新中国。长征不是溃败，是播种——沿途留下的火种，后来燃遍了整个中国。',
        choices: [
            {
                label: '继续前进',
                cost: 500,
                aftermath: '最后500人倒在了会宁城外的最后几公里路上。他们中有的人已经走了两万五千里，却在距离终点不到一公里的地方闭上了眼睛。但他们的战友们替他们走完了最后的路。1936年10月22日，三面红旗在会宁城头飘扬。86000人出发，不到7000人到达。七万九千人，永远留在了长征路上。但他们赢了——不是赢了战役，是赢了信念。十三年后，那些活着走完长征的人，站在了天安门城楼上。'
            },
            {
                label: '停下休整',
                cost: 0,
                aftermath: '停下来，意味着活下来。你太累了，所有人都太累了。两年的行军、战斗、饥饿、寒冷，已经榨干了最后一丝力气。停下来休息，错过会师的那一刻——但也许，这是最人性的选择。那些在雪山上坐下就再也没有站起来的战友，那些在湘江里沉入水底的兄弟，他们会理解的。'
            }
        ],
        historical: { choice: 0, note: '1936年10月，红军三大主力在会宁胜利会师，长征结束。86000人出发，不到7000人到达。79000人永远留在了两万五千里的征途上。但毛泽东说："长征是宣言书，长征是宣传队，长征是播种机。"十三年后，这支不到7000人的队伍，建立了新中国。' },
        noChoice: true // 最后一个场景，用户无法操作
    }
];

class Mod9ChoiceRadio {
    constructor() {
        this.currentScene = 0;
        this.totalCost = 0;
        this.choices = [];
        this._noChoiceTimer = null;

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
        if (this._noChoiceTimer) {
            clearInterval(this._noChoiceTimer);
            this._noChoiceTimer = null;
        }
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

        let called = false;
        const close = () => {
            if (called) return;
            called = true;
            this.aftermathOverlay.classList.remove('active');
            this.aftermathOverlay.removeEventListener('keydown', onKeyDown);
            btn.removeEventListener('click', close);
            callback();
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };

        btn.addEventListener('click', close);
        this.aftermathOverlay.addEventListener('keydown', onKeyDown);
        btn.focus();
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
            <div class="no-choice-timer" id="no-choice-timer" aria-live="assertive" aria-atomic="true">10</div>
        `;
        this.sceneContainer.appendChild(noChoiceDiv);

        let countdown = 10;
        const timerEl = document.getElementById('no-choice-timer');
        if (this._noChoiceTimer) {
            clearInterval(this._noChoiceTimer);
        }
        this._noChoiceTimer = setInterval(() => {
            countdown--;
            timerEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(this._noChoiceTimer);
                this._noChoiceTimer = null;
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
                        <div class="chart-bar chart-bar-user" data-width="${userW}" style="width:0">
                            <span>${b.userCost.toLocaleString()}</span>
                        </div>
                        <div class="chart-bar chart-bar-hist" data-width="${histW}" style="width:0">
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
        if (typeof Motion !== 'undefined' && Motion.reduced) {
            judgment.querySelectorAll('.chart-bar').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        } else {
            requestAnimationFrame(() => {
                judgment.querySelectorAll('.chart-bar').forEach(bar => {
                    bar.style.transition = 'width 1s ease';
                    bar.style.width = bar.dataset.width + '%';
                });
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const init = function() {
        new Mod9ChoiceRadio();
    };
    if (typeof checkNarrativeTransition === 'function') {
        checkNarrativeTransition(init);
    } else {
        init();
    }
});
