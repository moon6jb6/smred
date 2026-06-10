/**
 * 模块底部导航组件
 * 自动插入"返回首页"和"下一个穿越"按钮
 *
 * 用法：
 *   createNavigation(1);  // mod1 页面，底部显示导航
 */

// 导航顺序：index → mod1 → mod3 → mod4 → mod5 → mod6 → mod2 → mod7 → ... → mod15 → index
const NAV_ORDER = [1, 3, 4, 5, 6, 2, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// 每个模块的目录名映射
const MODULE_DIRS = {
    1: 'longfight_rouit_mod1',
    2: 'chess_mod2',
    3: 'timeriver_museum_mod3',
    4: 'sacrifice_mod4',
    5: 'greatman_mod5',
    6: 'china_power_mod6',
    7: 'mod7',
    8: 'mod8',
    9: 'mod9',
    10: 'mod10',
    11: 'mod11',
    12: 'mod12',
    13: 'mod13',
    14: 'mod14',
    15: 'mod15'
};

// 每个模块的叙事文字（进入时显示）
const MODULE_NARRATIVES = {
    1: '1934年，86000人从江西出发。两年后，7000人到达陕北。这是他们的故事。',
    3: '时间不会说话。但每一件物品，都记得。',
    4: '他们在黑暗中守护了我们。现在，轮到你去找他们。',
    5: '一个人的三次选择，改变了一个国家的命运。',
    6: '70年。从35岁到78岁。从134元到今天。',
    2: '每一场战役，都有代价。棋盘会告诉你。',
    7: '电波穿过黑夜。有些信号，永远不会被听到。',
    8: '你看到的，不一定是真的。你没看到的，才是。',
    9: '如果历史可以重来，你会做出不同的选择吗？',
    10: '照片不会说谎。但它们需要时间来显影。',
    11: '每一个事件，都不是孤立的。找到它们之间的线。',
    12: '每一次点击，都是一次纪念。每一次纪念，都是一次传承。',
    13: '听。这是我们的歌。跟着节拍，走完这段路。',
    14: '他们迈出最后一步时，没有犹豫。记住他们的名字。',
    15: '真相需要审判。而你，是审判者。'
};

/**
 * 创建底部导航
 * @param {number} currentModule - 当前模块编号 (1-15)
 */
function createNavigation(currentModule) {
    const idx = NAV_ORDER.indexOf(currentModule);
    if (idx === -1) return;

    const prevModule = idx > 0 ? NAV_ORDER[idx - 1] : null;
    const nextModule = idx < NAV_ORDER.length - 1 ? NAV_ORDER[idx + 1] : null;

    const nav = document.createElement('nav');
    nav.className = 'module-nav';
    nav.setAttribute('aria-label', '模块导航');

    // 返回首页
    const homeBtn = document.createElement('button');
    homeBtn.className = 'nav-home';
    homeBtn.textContent = '返回首页';
    homeBtn.setAttribute('aria-label', '返回首页');
    homeBtn.addEventListener('click', function() {
        if (typeof filmstripTransition === 'function') {
            filmstripTransition('../index.html', null);
        } else {
            window.location.href = '../index.html';
        }
    });

    // 下一个穿越
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-next';
    if (nextModule !== null) {
        const nextDir = MODULE_DIRS[nextModule];
        const nextNarrative = MODULE_NARRATIVES[nextModule] || null;
        nextBtn.textContent = '下一个穿越';
        nextBtn.setAttribute('aria-label', '进入下一个模块');
        nextBtn.addEventListener('click', function() {
            const url = '../page/' + nextDir + '/mod' + nextModule + '.html';
            if (typeof filmstripTransition === 'function') {
                filmstripTransition(url, nextNarrative);
            } else {
                window.location.href = url;
            }
        });
    } else {
        // 最后一个模块，返回首页
        nextBtn.textContent = '回到起点';
        nextBtn.setAttribute('aria-label', '回到首页');
        nextBtn.addEventListener('click', function() {
            if (typeof filmstripTransition === 'function') {
                filmstripTransition('../index.html', '你走完了这段路。但历史，永远不会结束。');
            } else {
                window.location.href = '../index.html';
            }
        });
    }

    nav.appendChild(homeBtn);
    nav.appendChild(nextBtn);
    document.body.appendChild(nav);
}
