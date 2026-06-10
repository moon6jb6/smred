/**
 * Mod7 电报战士 — 电台调频+信号干扰+解密
 */

const TELEGRAMS = [
    {
        freq: 7.1,
        date: '1934年11月',
        sender: '中央军委',
        text: '紧急命令：各军团务必于27日至30日全部渡过湘江，突破敌人第四道封锁线。█（重复）█。中央纵队携带大量辎重，行军缓慢，各军团必须死守阵地掩护渡江。',
        detail: '湘江战役是长征中最惨烈的一仗。红军从11月25日开始强渡湘江，历时四天四夜，与数十万国民党军展开殊死搏斗。中央红军8.6万人锐减至3万人，36000多名将士血染湘江，当地百姓流传"三年不饮湘江水，十年不食湘江鱼"的悲壮民谣。',
        quote: '我们不为胜利者，即为战亡者。——陈树湘师长断肠明志前',
        encrypted: [{ word: '不惜一切代价', options: ['不惜一切代价', '尽量减少伤亡', '保存有生力量'], correct: 0 }],
        emergency: false
    },
    {
        freq: 8.3,
        date: '1935年1月',
        sender: '遵义电台',
        text: '会议历时三天三夜，决定：彻底否定博古、李德的错误军事路线，取消其最高军事指挥权。增选█同志为政治局常委，由其负责军事指挥。全军振奋。',
        detail: '遵义会议是中国共产党历史上生死攸关的转折点。会议从1月15日开到17日，经过激烈辩论，纠正了"左"倾冒险主义的军事错误，确立了毛泽东在党中央和红军中的领导地位。这次会议挽救了党，挽救了红军，挽救了中国革命。',
        quote: '遵义会议后，红军从此有了正确的方向。——周恩来',
        encrypted: [{ word: '█', options: ['周恩来', '毛泽东', '朱德'], correct: 1 }],
        emergency: false
    },
    {
        freq: 5.8,
        date: '1935年5月',
        sender: '红一军团',
        text: '十万火急！泸定桥13根铁索横跨大渡河，桥板已被敌军全部拆除。22名勇士身背大刀、手持短枪，冒着枪林弹雨攀爬铁索。我军昼夜急行240里山路赶到泸定城，已成功夺桥！█',
        detail: '飞夺泸定桥是长征中的经典战役。红四团在瓢泼大雨中沿大渡河西岸急行军240里（约120公里），创造了昼夜行军的奇迹。22名突击队员冒着对岸敌军密集火力，攀着光溜溜的铁索链冲过泸定桥，用鲜血和生命为红军打开了北上通道。',
        quote: '同志们！为了党的事业，冲啊！——突击队长廖大珠',
        encrypted: [{ word: '█', options: ['请求增援', '已成功夺桥', '伤亡惨重'], correct: 1 }],
        emergency: true
    },
    {
        freq: 9.2,
        date: '1935年6月',
        sender: '先遣队',
        text: '翻越夹金山。海拔4930米，终年积雪，空气含氧量不足平地一半。许多战士衣衫单薄，在风雪中坐下休息就再也没能站起来，永远留在了雪山上。山下会合在即，不能停下，绝不能停下。',
        detail: '夹金山是红军翻越的第一座大雪山，海拔4930米，藏语意为"很高很陡的山"。山上天气变幻莫测，时而狂风暴雨，时而冰雹大雪，空气稀薄令人窒息。许多战士因饥寒交迫、高原反应倒在雪山上，坐在路边休息的人往往一坐下就再也无法站起，身体被风雪掩埋。',
        quote: '翻过去！翻过去就是胜利！——毛泽东过夹金山时对战士们说',
        encrypted: [{ word: '█', options: ['冻伤', '掉队', '牺牲'], correct: 2 }],
        emergency: false
    },
    {
        freq: 6.5,
        date: '1935年9月',
        sender: '红一方面军',
        text: '到达甘肃哈达铺，获得重大情报！从一张《大公报》上得知：陕北有█和刘志丹领导的红军根据地，徐海东部也在陕南活动。中央决定改变行军方向，全军向陕北进发！',
        detail: '哈达铺是红军长征途中命运转折之地。毛泽东在当地邮政代办所缴获的报纸上，读到了关于陕北红军和根据地的详细报道，首次得知陕北还存在一块稳固的革命根据地。这个消息如同黑暗中的灯塔，让疲惫不堪的红军终于有了明确的落脚点和前进方向。',
        quote: '感谢国民党的报纸，给我们提供了陕北红军的消息。——毛泽东在哈达铺',
        encrypted: [{ word: '█', options: ['红军', '游击队', '苏区'], correct: 0 }],
        emergency: false
    },
    {
        freq: 4.7,
        date: '1936年10月',
        sender: '会宁电台',
        text: '特大喜讯！红一方面军、红二方面军、红四方面军三大主力在甘肃会宁胜利█！历时两年，纵横十一个省，翻越十八座山脉，渡过二十四条河流，行程二万五千里的伟大长征，今日宣告结束！',
        detail: '1936年10月，红一、红二、红四方面军在甘肃会宁和将台堡胜利会师，标志着中国工农红军长征的胜利结束。红军长征历时两年，行程约25000里（约12500公里），跨越11个省，是人类历史上的伟大壮举。美国记者斯诺称之为"军事史上最伟大的业绩之一"。',
        quote: '长征是宣言书，长征是宣传队，长征是播种机。——毛泽东',
        encrypted: [{ word: '█', options: ['突围', '会师', '集结'], correct: 1 }],
        emergency: false
    }
];

class Mod7Telegraph {
    constructor() {
        this.currentFreq = 5.0;
        this.targetFreq = 7.1;
        this.currentTelegram = null;
        this.receivedTelegrams = [];
        this.emergencyActive = false;
        this.knobAngle = 0;

        this.freqDisplay = document.getElementById('freq-display');
        this.signalFill = document.getElementById('signal-fill');
        this.knob = document.getElementById('tuning-knob');
        this.status = document.getElementById('radio-status');
        this.telegramPanel = document.getElementById('telegram-panel');
        this.emergencyOverlay = document.getElementById('emergency-overlay');
        this.diaryList = document.getElementById('diary-list');

        this.init();
    }

    init() {
        this.initKnob();
        this.initEmergency();
        this.loadDiary();
        this.renderDiary();
        this.initSpectrum();
        // 随机延迟后触发紧急电报
        setTimeout(() => this.maybeEmergency(), 15000);
    }

    /** 频谱可视化 */
    initSpectrum() {
        const canvas = document.getElementById('spectrum-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        };
        resize();
        window.addEventListener('resize', resize);

        const bars = 64;
        const barValues = new Float32Array(bars);
        let signalStrength = 0;

        const animate = () => {
            const w = canvas.getBoundingClientRect().width;
            const h = canvas.getBoundingClientRect().height;
            ctx.clearRect(0, 0, w, h);

            // 根据信号强度调整频谱行为
            const minDist = this.currentMinDist || 2;
            signalStrength = Math.max(0, 1 - minDist / 2);
            const noiseLevel = 0.1 + (1 - signalStrength) * 0.6;
            const signalPeak = signalStrength > 0.5 ? this.currentFreq / 10 * bars : -1;

            const barW = w / bars;
            for (let i = 0; i < bars; i++) {
                // 基础噪声
                let val = Math.random() * noiseLevel;
                // 信号峰
                if (signalPeak >= 0) {
                    const dist = Math.abs(i - signalPeak);
                    if (dist < 5) {
                        val += (1 - dist / 5) * signalStrength * 0.8;
                    }
                }
                // 平滑
                barValues[i] = barValues[i] * 0.7 + val * 0.3;

                const barH = barValues[i] * h * 0.8;
                const hue = barValues[i] > 0.6 ? 45 : 200;
                const alpha = 0.3 + barValues[i] * 0.5;
                ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
                ctx.fillRect(i * barW, h - barH, barW - 1, barH);
            }

            // 频率标记线
            if (signalStrength > 0.5) {
                const markerX = (this.currentFreq - 4) / 6 * w;
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(markerX, 0);
                ctx.lineTo(markerX, h);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };
        animate();
    }

    /** 旋钮交互 */
    initKnob() {
        let isDragging = false;
        let startAngle = 0;

        const getAngle = (e) => {
            const rect = this.knob.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const pos = e.touches ? e.touches[0] : e;
            return Math.atan2(pos.clientY - cy, pos.clientX - cx) * 180 / Math.PI;
        };

        const onStart = (e) => {
            isDragging = true;
            startAngle = getAngle(e) - this.knobAngle;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const angle = getAngle(e);
            this.knobAngle = angle - startAngle;
            this.knob.style.transform = `rotate(${this.knobAngle}deg)`;

            // 将角度映射到频率 (4.0 - 10.0)
            const normalized = ((this.knobAngle % 360 + 360) % 360) / 360;
            this.currentFreq = 4.0 + normalized * 6.0;
            this.updateFrequency();
        };

        const onEnd = () => {
            isDragging = false;
        };

        this.knob.addEventListener('mousedown', onStart);
        this.knob.addEventListener('touchstart', onStart, { passive: true });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);

        // 滑块辅助
        const slider = document.getElementById('freq-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.currentFreq = parseFloat(e.target.value);
                this.knobAngle = ((this.currentFreq - 4.0) / 6.0) * 360;
                this.knob.style.transform = `rotate(${this.knobAngle}deg)`;
                this.updateFrequency();
            });
        }
    }

    /** 更新频率 */
    updateFrequency() {
        const freq = this.currentFreq.toFixed(1);
        // 只更新数字部分，保留 MHz 单位span
        if (this.freqDisplay.childNodes[0]) {
            this.freqDisplay.childNodes[0].textContent = freq;
        } else {
            this.freqDisplay.textContent = freq;
        }

        // 检查是否接近某个电报频率
        let closest = null;
        let minDist = Infinity;
        TELEGRAMS.forEach(t => {
            const dist = Math.abs(this.currentFreq - t.freq);
            if (dist < minDist) {
                minDist = dist;
                closest = t;
            }
        });
        this.currentMinDist = minDist;

        // 信号强度
        const signal = Math.max(0, 1 - minDist / 2);
        this.signalFill.style.width = (signal * 100) + '%';

        // 干扰音效
        if (typeof AudioEngine !== 'undefined' && AudioEngine._initialized) {
            if (signal < 0.3) {
                AudioEngine.playStatic(0.8);
            } else if (signal < 0.7) {
                AudioEngine.playStatic(0.3);
            }
        }

        // 接收电报
        if (signal > 0.8 && closest && !this.receivedTelegrams.includes(closest)) {
            this.receiveTelegram(closest);
        }

        // 状态文字
        if (signal > 0.8) {
            this.status.textContent = '信号清晰';
            this.status.className = 'radio-status decoded';
        } else if (signal > 0.3) {
            this.status.textContent = '有干扰...继续调频';
            this.status.className = 'radio-status';
        } else {
            this.status.textContent = '搜索信号中...';
            this.status.className = 'radio-status';
        }
    }

    /** 接收电报 */
    receiveTelegram(telegram) {
        this.currentTelegram = telegram;
        this.receivedTelegrams.push(telegram);

        // 存入日记
        this.saveDiary(telegram);

        // 显示电报面板
        this.telegramPanel.classList.add('visible');
        document.getElementById('tg-date').textContent = telegram.date;
        document.getElementById('tg-sender').textContent = telegram.sender;

        // 渲染电报内容（含加密词）
        const bodyEl = document.getElementById('tg-body');
        let html = telegram.text;
        telegram.encrypted.forEach((enc, i) => {
            html = html.replace(enc.word,
                `<span class="encrypted" data-index="${i}">${enc.word}</span>`);
        });
        bodyEl.innerHTML = html;

        // 点击加密词解密
        bodyEl.querySelectorAll('.encrypted').forEach(el => {
            el.addEventListener('click', () => this.showDecodeOptions(el, telegram));
        });

        // 提示音
        if (typeof AudioEngine !== 'undefined' && AudioEngine._initialized) {
            AudioEngine.playTone(800, 0.2, 'sine');
            setTimeout(() => AudioEngine.playTone(1000, 0.2, 'sine'), 250);
        }

        // 更新日记
        this.renderDiary();
    }

    /** 显示解密选项 */
    showDecodeOptions(el, telegram) {
        const index = parseInt(el.dataset.index);
        const enc = telegram.encrypted[index];
        if (!enc) return;

        // 已解密
        if (el.classList.contains('revealed')) return;

        // 创建选项
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'decode-options';
        enc.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'decode-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                if (i === enc.correct) {
                    el.textContent = opt;
                    el.classList.add('revealed');
                    optionsDiv.remove();
                    // 解密成功音效
                    if (typeof AudioEngine !== 'undefined' && AudioEngine._initialized) {
                        AudioEngine.playTone(1200, 0.3, 'sine');
                    }
                } else {
                    btn.classList.add('wrong');
                    btn.disabled = true;
                }
            });
            optionsDiv.appendChild(btn);
        });

        el.parentNode.insertBefore(optionsDiv, el.nextSibling);
    }

    /** 紧急电报 */
    initEmergency() {
        this.emergencyTimer = null;
        const recvBtn = document.getElementById('emergency-recv');
        recvBtn.addEventListener('click', () => {
            if (this.emergencyTimer) { clearInterval(this.emergencyTimer); this.emergencyTimer = null; }
            this.emergencyOverlay.classList.remove('active');
            this.emergencyActive = false;
            // 接收紧急电报
            const emergency = TELEGRAMS.find(t => t.emergency && !this.receivedTelegrams.includes(t));
            if (emergency) this.receiveTelegram(emergency);
        });
    }

    maybeEmergency() {
        if (this.emergencyActive) return;
        const unreceived = TELEGRAMS.filter(t => t.emergency && !this.receivedTelegrams.includes(t));
        if (unreceived.length === 0) return;

        this.emergencyActive = true;
        this.emergencyOverlay.classList.add('active');

        // 10秒倒计时
        let countdown = 10;
        const countEl = document.getElementById('emergency-countdown');
        countEl.textContent = countdown;
        this.emergencyTimer = setInterval(() => {
            countdown--;
            countEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(this.emergencyTimer);
                this.emergencyTimer = null;
                this.emergencyOverlay.classList.remove('active');
                this.emergencyActive = false;
                this.status.textContent = '紧急电报信号已消失...';
            }
        }, 1000);
    }

    /** 日记系统 */
    saveDiary(telegram) {
        const diary = this.loadDiaryData();
        diary.push({
            date: telegram.date,
            sender: telegram.sender,
            text: telegram.text.replace(/█/g, '██'),
            freq: telegram.freq
        });
        try { localStorage.setItem('rb_mod7_diary', JSON.stringify(diary)); } catch (e) {}
    }

    loadDiaryData() {
        try {
            return JSON.parse(localStorage.getItem('rb_mod7_diary')) || [];
        } catch (e) { return []; }
    }

    loadDiary() {}

    renderDiary() {
        const diary = this.loadDiaryData();
        this.diaryList.innerHTML = '';
        if (diary.length === 0) {
            this.diaryList.innerHTML = '<div class="diary-empty">还没有收到任何电报...</div>';
            return;
        }
        diary.forEach(entry => {
            const el = document.createElement('div');
            el.className = 'diary-entry';
            el.innerHTML = `
                <div class="entry-date">${entry.date} | ${entry.sender} | ${entry.freq}MHz</div>
                <div class="entry-text">${entry.text}</div>
            `;
            this.diaryList.appendChild(el);
        });
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        // 初始化音频
        document.addEventListener('click', function initAudio() {
            if (typeof AudioEngine !== 'undefined') AudioEngine.init();
            document.removeEventListener('click', initAudio);
        }, { once: true });
        new Mod7Telegraph();
    });
});
