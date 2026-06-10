/**
 * Storage 安全封装 — localStorage/sessionStorage 操作
 * 所有操作带 try/catch，存储满/隐私模式下静默降级
 */
const Storage = {
    _prefix: 'rb_',  // red_blood 前缀，避免命名冲突

    /** 安全读取 */
    get(key, fallback) {
        if (fallback === undefined) fallback = null;
        try {
            const v = localStorage.getItem(this._prefix + key);
            if (v === null) return fallback;
            return JSON.parse(v);
        } catch (e) {
            return fallback;
        }
    },

    /** 安全写入 */
    set(key, value) {
        try {
            localStorage.setItem(this._prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    /** 安全删除 */
    remove(key) {
        try {
            localStorage.removeItem(this._prefix + key);
        } catch (e) {}
    },

    /** 清空所有项目数据 */
    clear() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith(this._prefix)) keys.push(k);
            }
            keys.forEach(k => localStorage.removeItem(k));
        } catch (e) {}
    },

    /** sessionStorage 读取 */
    getSession(key, fallback) {
        if (fallback === undefined) fallback = null;
        try {
            const v = sessionStorage.getItem(this._prefix + key);
            if (v === null) return fallback;
            return JSON.parse(v);
        } catch (e) {
            return fallback;
        }
    },

    /** sessionStorage 写入 */
    setSession(key, value) {
        try {
            sessionStorage.setItem(this._prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    /** sessionStorage 删除 */
    removeSession(key) {
        try {
            sessionStorage.removeItem(this._prefix + key);
        } catch (e) {}
    },

    /** 获取模块进度（如mod3收集数、mod4蜡烛数） */
    getModuleProgress(moduleId) {
        return this.get('progress_' + moduleId, { completed: false, data: {} });
    },

    /** 设置模块进度 */
    setModuleProgress(moduleId, data) {
        const current = this.getModuleProgress(moduleId);
        return this.set('progress_' + moduleId, { ...current, ...data });
    },

    /** 获取选择状态（如mod1湘江选择、mod9抉择） */
    getChoiceState(moduleId) {
        return this.get('choice_' + moduleId, null);
    },

    /** 设置选择状态 */
    setChoiceState(moduleId, choice) {
        return this.set('choice_' + moduleId, choice);
    }
};
