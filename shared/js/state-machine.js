/**
 * 有限状态机
 * 复用于：mod8(元游戏三层揭示)、mod9(抉择电台倒带)、mod15(审判席四结局)
 *
 * 用法：
 *   const sm = new StateMachine({
 *     states: {
 *       idle:    { onEnter() { console.log('idle'); } },
 *       running: { onEnter() { start(); }, onExit() { stop(); } },
 *       paused:  { onEnter() { showPause(); } }
 *     },
 *     transitions: [
 *       { from: 'idle', to: 'running', event: 'start' },
 *       { from: 'running', to: 'paused', event: 'pause' },
 *       { from: 'paused', to: 'running', event: 'resume' },
 *       { from: 'running', to: 'idle', event: 'reset' }
 *     ],
 *     initial: 'idle'
 *   });
 *
 *   sm.transition('start');          // idle → running
 *   sm.can('pause');                 // true
 *   sm.on('stateChange', (data) => {});
 */
class StateMachine {
    constructor(config) {
        this._states = config.states || {};
        this._transitions = config.transitions || [];
        this._state = config.initial || Object.keys(this._states)[0];
        this._data = {};
        this._listeners = {};

        // 进入初始状态
        const initial = this._states[this._state];
        if (initial && initial.onEnter) {
            initial.onEnter(this._data);
        }
    }

    /** 当前状态名 */
    get state() {
        return this._state;
    }

    /** 状态数据 */
    get data() {
        return this._data;
    }

    /** 设置状态数据 */
    set data(value) {
        this._data = value;
    }

    /** 执行状态转换 */
    transition(event, payload) {
        const t = this._transitions.find(
            tr => tr.from === this._state && tr.event === event
        );

        if (!t) {
            console.warn(`StateMachine: no transition for "${event}" from state "${this._state}"`);
            return false;
        }

        const oldState = this._state;
        const oldHandler = this._states[oldState];
        const newHandler = this._states[t.to];

        // 退出旧状态
        if (oldHandler && oldHandler.onExit) {
            oldHandler.onExit(this._data, payload);
        }

        // 更新状态
        this._state = t.to;

        // 进入新状态
        if (newHandler && newHandler.onEnter) {
            newHandler.onEnter(this._data, payload);
        }

        // 触发事件
        this._emit('stateChange', {
            from: oldState,
            to: t.to,
            event: event,
            payload: payload
        });

        return true;
    }

    /** 检查是否可执行事件 */
    can(event) {
        return this._transitions.some(
            tr => tr.from === this._state && tr.event === event
        );
    }

    /** 获取当前状态可用的所有事件 */
    availableEvents() {
        return this._transitions
            .filter(tr => tr.from === this._state)
            .map(tr => tr.event);
    }

    /** 监听事件 */
    on(event, handler) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(handler);
    }

    /** 取消监听 */
    off(event, handler) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(h => h !== handler);
    }

    /** 触发事件 */
    _emit(event, data) {
        if (this._listeners[event]) {
            this._listeners[event].forEach(h => h(data));
        }
    }

    /** 强制设置状态（跳过 onExit/onEnter，仅用于恢复状态） */
    forceState(state) {
        if (this._states[state]) {
            this._state = state;
        }
    }

    /** 序列化当前状态（用于存储） */
    serialize() {
        return {
            state: this._state,
            data: JSON.parse(JSON.stringify(this._data))
        };
    }

    /** 从序列化数据恢复 */
    restore(serialized) {
        if (serialized && serialized.state && this._states[serialized.state]) {
            this._state = serialized.state;
            this._data = serialized.data || {};
        }
    }
}
