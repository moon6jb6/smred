/**
 * 动效降级检测 — prefers-reduced-motion
 * 检测用户是否在系统设置中开启了"减少动态效果"
 */
const Motion = {
    _reduced: false,
    _callbacks: [],

    /** 初始化检测 */
    init() {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        this._reduced = mq.matches;
        mq.addEventListener('change', (e) => {
            this._reduced = e.matches;
            this._callbacks.forEach(cb => cb(e.matches));
        });
    },

    /** 返回当前是否启用减少动态效果 */
    get reduced() {
        return this._reduced;
    },

    /** 监听变化 */
    onChange(callback) {
        this._callbacks.push(callback);
    },

    /** 根据动效偏好返回值：reduced时返回降级值，否则返回正常值 */
    pick(normal, reduced) {
        return this._reduced ? reduced : normal;
    },

    /** 如果允许动效则执行函数 */
    ifAllowed(fn) {
        if (!this._reduced) fn();
    }
};

// 自动初始化
Motion.init();
