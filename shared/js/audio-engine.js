/**
 * Web Audio 合成音效引擎
 * 纯合成，无需音频文件（义勇军进行曲等预录用Howler.js）
 *
 * 用法：
 *   AudioEngine.init();                   // 用户交互后初始化
 *   AudioEngine.playDrum(80);             // 鼓声
 *   AudioEngine.playChain();              // 铁链声
 *   AudioEngine.startBreathing(4);        // 呼吸声 4秒周期
 *   AudioEngine.startHeartbeat(72);       // 心跳 72bpm
 *   AudioEngine.playMorse('... --- ...'); // 摩尔斯
 */
const AudioEngine = {
    ctx: null,
    masterGain: null,
    _activeSources: [],
    _intervals: [],
    _initialized: false,

    /** 初始化 AudioContext（必须在用户交互后调用） */
    init() {
        if (this._initialized) return true;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);
            this._initialized = true;

            // 自动恢复 suspended 状态
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    /** 确保已初始化且未被挂起 */
    _ensure() {
        if (!this._initialized) return false;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return true;
    },

    /** 设置主音量 0-1 */
    setVolume(v) {
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                Math.max(0, Math.min(1, v)),
                this.ctx.currentTime
            );
        }
    },

    /** 创建增益节点 */
    _createGain(value) {
        const g = this.ctx.createGain();
        g.gain.value = value !== undefined ? value : 1;
        g.connect(this.masterGain);
        return g;
    },

    /** 纯音：sine/square/sawtooth/triangle */
    playTone(freq, duration, type) {
        if (!this._ensure()) return;
        if (!type) type = 'sine';
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0);
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.start(t);
        osc.stop(t + duration);
    },

    /** 鼓声：低频脉冲+快速衰减 */
    playDrum(freq) {
        if (!this._ensure()) return;
        if (!freq) freq = 80;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);
        osc.connect(gain);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.35);
    },

    /** 铁链声：短促金属碰撞（高频谐波+快速衰减） */
    playChain() {
        if (!this._ensure()) return;
        const t = this.ctx.currentTime;
        // 两个高频谐波叠加模拟金属声
        [2800, 3500].forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0);
            osc.type = 'square';
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            osc.start(t);
            osc.stop(t + 0.1);
        });
    },

    /** 噪声：白噪声+可选低通滤波 */
    playNoise(duration, filterFreq) {
        if (!this._ensure()) return;
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const gain = this._createGain(0);

        if (filterFreq) {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = filterFreq;
            source.connect(filter);
            filter.connect(gain);
        } else {
            source.connect(gain);
        }

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        source.start(t);
        source.stop(t + duration);
    },

    /** 脉冲音：心跳/脚步（低频+节奏感） */
    playPulse(freq, duration, rate) {
        if (!this._ensure()) return;
        if (!freq) freq = 40;
        if (!duration) duration = 0.15;
        if (!rate) rate = 1;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this._createGain(0);
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.start(t);
        osc.stop(t + duration + 0.05);
    },

    /** 信号干扰音效：滋滋声（mod7用） */
    playStatic(intensity) {
        if (!this._ensure()) return;
        if (!intensity) intensity = 0.5;
        const duration = 0.3;
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * intensity;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this._createGain(0);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;
        source.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0.2 * intensity, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        source.start(t);
        source.stop(t + duration);
    },

    /**
     * 摩尔斯电码播放
     * @param {string} dots - 点划序列，如 '... --- ...'（SOS）
     * @param {number} wpm - 每分钟字数（默认15）
     */
    playMorse(dots, wpm) {
        if (!this._ensure()) return;
        if (!wpm) wpm = 15;
        const unit = 1200 / wpm; // 一个单位时间(ms)
        const freq = 700;
        let delay = 0;

        for (let i = 0; i < dots.length; i++) {
            const ch = dots[i];
            if (ch === '.') {
                setTimeout(() => this.playTone(freq, unit / 1000, 'sine'), delay);
                delay += unit * 2;
            } else if (ch === '-') {
                setTimeout(() => this.playTone(freq, unit * 3 / 1000, 'sine'), delay);
                delay += unit * 4;
            } else if (ch === ' ') {
                delay += unit * 3; // 词间停顿
            }
        }
    },

    /** 背景呼吸声：低频脉冲（mod4用） */
    startBreathing(cycleSec) {
        if (!this._ensure()) return null;
        if (!cycleSec) cycleSec = 4;
        const halfCycle = (cycleSec * 1000) / 2;

        const breathe = () => {
            if (!this._initialized) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this._createGain(0);
            osc.type = 'sine';
            osc.frequency.value = 30;
            osc.connect(gain);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.15, t + halfCycle / 1000);
            gain.gain.linearRampToValueAtTime(0, t + cycleSec);
            osc.start(t);
            osc.stop(t + cycleSec + 0.1);
        };

        breathe();
        const id = setInterval(breathe, cycleSec * 1000);
        this._intervals.push(id);
        return id;
    },

    /** 背景风声：白噪声+低通滤波（mod14用） */
    startWind() {
        if (!this._ensure()) return null;

        const playWind = () => {
            if (!this._initialized) return;
            const duration = 3;
            const t = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            const gain = this._createGain(0);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            source.connect(filter);
            filter.connect(gain);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.08, t + 1);
            gain.gain.linearRampToValueAtTime(0, t + duration);
            source.start(t);
            source.stop(t + duration + 0.1);
        };

        playWind();
        const id = setInterval(playWind, 2800);
        this._intervals.push(id);
        return id;
    },

    /** 背景心跳：可变速率（mod14用） */
    startHeartbeat(bpm) {
        if (!this._ensure()) return null;
        if (!bpm) bpm = 72;
        const interval = 60000 / bpm;

        const beat = () => {
            if (!this._initialized) return;
            this.playPulse(40, 0.12);
            setTimeout(() => this.playPulse(50, 0.08), 120);
        };

        beat();
        const id = setInterval(beat, interval);
        this._intervals.push(id);
        return id;
    },

    /** 更新心跳速率 */
    updateHeartbeat(id, newBpm) {
        if (id) clearInterval(id);
        return this.startHeartbeat(newBpm);
    },

    /** 淡入 */
    fadeIn(duration) {
        if (!this._ensure()) return;
        if (!duration) duration = 1;
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + duration);
    },

    /** 淡出 */
    fadeOut(duration) {
        if (!this._ensure()) return;
        if (!duration) duration = 1;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    },

    /** 停止所有循环音效 */
    stopAll() {
        this._intervals.forEach(id => clearInterval(id));
        this._intervals = [];
    },

    /** 挂起 AudioContext（省电） */
    suspend() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    },

    /** 恢复 AudioContext */
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
};
