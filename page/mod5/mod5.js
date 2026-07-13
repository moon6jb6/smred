/**
 * Mod5 毛泽东——三次选择
 * 三种不同交互：拖拽决策、SVG地图标注、Canvas路线绘制
 */

class Mod5ThreeChoices {
    constructor() {
        this.currentScene = 0;
        this.totalScenes = 5; // 开场 + 3次选择 + 总结
        this.choiceResults = [];

        this.progressFill = document.getElementById('progress-fill');
        this.sceneDots = document.querySelectorAll('.scene-dot');

        this.init();
    }

    init() {
        // 滚动监听场景切换
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scene = parseInt(entry.target.dataset.scene);
                    this.updateProgress(scene);
                    this.onSceneEnter(scene);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.scene').forEach(scene => {
            observer.observe(scene);
        });

        // 初始化各选择交互
        this.initDragChoice();
        this.initMapChoice();
        this.initRouteChoice();

        // 墨水晕开效果
        const inkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.ink-quote').forEach(el => inkObserver.observe(el));
    }

    /** 更新进度条 */
    updateProgress(scene) {
        this.currentScene = scene;
        const progress = ((scene + 1) / this.totalScenes) * 100;
        this.progressFill.style.width = progress + '%';
        this.sceneDots.forEach((dot, i) => {
            dot.classList.toggle('active', i <= scene);
        });
    }

    /** 场景进入 */
    onSceneEnter(scene) {
        // 可以在这里触发入场动画
    }

    /* ============================================================
       选择1：拖拽决策（秋收起义）
       ============================================================ */
    initDragChoice() {
        const item = document.getElementById('drag-item-1');
        const targetCity = document.getElementById('target-city');
        const targetCountry = document.getElementById('target-country');
        if (!item) return;

        let isDragging = false;
        let startX, startY;
        let resistance = 0;

        const onStart = (e) => {
            isDragging = true;
            item.classList.add('dragging');
            const pos = e.touches ? e.touches[0] : e;
            startX = pos.clientX;
            startY = pos.clientY;
            resistance = 0;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const pos = e.touches ? e.touches[0] : e;
            const dx = pos.clientX - startX;
            const dy = pos.clientY - startY;

            // 阻力效果：拖拽越远越重
            resistance = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 200);
            const scale = 1 - resistance * 0.15;
            item.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px) scale(${scale})`;

            // 高亮目标
            const rect1 = targetCity.getBoundingClientRect();
            const rect2 = targetCountry.getBoundingClientRect();
            targetCity.classList.toggle('highlight',
                pos.clientX > rect1.left && pos.clientX < rect1.right &&
                pos.clientY > rect1.top && pos.clientY < rect1.bottom);
            targetCountry.classList.toggle('highlight',
                pos.clientX > rect2.left && pos.clientX < rect2.right &&
                pos.clientY > rect2.top && pos.clientY < rect2.bottom);
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            item.classList.remove('dragging');
            item.style.transform = '';
            targetCity.classList.remove('highlight');
            targetCountry.classList.remove('highlight');

            const pos = e.changedTouches ? e.changedTouches[0] : e;
            const rect1 = targetCity.getBoundingClientRect();
            const rect2 = targetCountry.getBoundingClientRect();

            if (pos.clientX > rect1.left && pos.clientX < rect1.right &&
                pos.clientY > rect1.top && pos.clientY < rect1.bottom) {
                this.showChoiceResult(0, 'city');
            } else if (pos.clientX > rect2.left && pos.clientX < rect2.right &&
                       pos.clientY > rect2.top && pos.clientY < rect2.bottom) {
                this.showChoiceResult(0, 'country');
            }
        };

        item.addEventListener('mousedown', onStart);
        item.addEventListener('touchstart', onStart, { passive: true });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);

        // 点击目标也可以选择
        targetCity.addEventListener('click', () => this.showChoiceResult(0, 'city'));
        targetCountry.addEventListener('click', () => this.showChoiceResult(0, 'country'));
    }

    /* ============================================================
       选择2：SVG地图标注（井冈山）
       ============================================================ */
    initMapChoice() {
        const marker = document.getElementById('map-marker-2');
        const label = document.getElementById('map-label-2');
        const map = document.getElementById('china-map');
        if (!map) return;

        // 点击地图选择位置
        map.addEventListener('click', (e) => {
            const rect = map.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // 显示标记（viewBox 0 0 100 80，百分比直接映射）
            marker.setAttribute('cx', x);
            marker.setAttribute('cy', y * 0.8);
            marker.classList.add('visible');
            label.setAttribute('x', x);
            label.setAttribute('y', (y - 3) * 0.8);
            label.classList.add('visible');

            // 井冈山大致在 湖南江西交界 (约 60%, 55%)
            const targetX = 60, targetY = 55;
            const dist = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

            setTimeout(() => {
                this.showChoiceResult(1, { x, y, dist });
            }, 500);
        });
    }

    /* ============================================================
       选择3：Canvas路线绘制（长征路线）
       ============================================================ */
    initRouteChoice() {
        const canvas = document.getElementById('route-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const clearBtn = document.getElementById('route-clear');
        const doneBtn = document.getElementById('route-done');

        // 设置canvas尺寸
        let startX, startY, endX, endY;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            startX = rect.width * 0.72;
            startY = rect.height * 0.6;
            endX = rect.width * 0.35;
            endY = rect.height * 0.25;
            this.drawMapBase(ctx, rect.width, rect.height);
            this.drawEndpoints(ctx, startX, startY, endX, endY);
        };
        resize();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 100);
        });

        let isDrawing = false;
        let userPath = [];

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const pos = e.touches ? e.touches[0] : e;
            return {
                x: pos.clientX - rect.left,
                y: pos.clientY - rect.top
            };
        };

        const onDrawStart = (e) => {
            isDrawing = true;
            userPath = [];
            const pos = getPos(e);
            userPath.push(pos);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        const onDrawMove = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            userPath.push(pos);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const onDrawEnd = () => {
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', onDrawStart);
        canvas.addEventListener('mousemove', onDrawMove);
        canvas.addEventListener('mouseup', onDrawEnd);
        canvas.addEventListener('mouseleave', onDrawEnd);
        canvas.addEventListener('touchstart', onDrawStart, { passive: true });
        canvas.addEventListener('touchmove', onDrawMove, { passive: false });
        canvas.addEventListener('touchend', onDrawEnd);

        // 清除
        clearBtn.addEventListener('click', () => {
            userPath = [];
            const rect = canvas.getBoundingClientRect();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dpr = window.devicePixelRatio || 1;
            ctx.scale(dpr, dpr);
            this.drawMapBase(ctx, rect.width, rect.height);
            this.drawEndpoints(ctx, startX, startY, endX, endY);
        });

        // 完成
        doneBtn.addEventListener('click', () => {
            const rect = canvas.getBoundingClientRect();
            this.drawActualRoute(ctx, rect.width, rect.height);
            const pathLength = this.calculatePathLength(userPath);
            const canvasDiag = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
            const estimatedLi = Math.round((pathLength / canvasDiag) * 25000);

            setTimeout(() => {
                this.showChoiceResult(2, { estimatedLi, pathLength });
            }, 1500);
        });
    }

    drawMapBase(ctx, w, h) {
        // 简化的中国地图轮廓（用矩形区域表示）
        ctx.strokeStyle = 'rgba(201, 169, 110, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(w * 0.15, h * 0.1, w * 0.7, h * 0.8);

        // 关键地点标签
        ctx.fillStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.font = '10px Microsoft YaHei';
        ctx.fillText('江西', w * 0.68, h * 0.62);
        ctx.fillText('陕西', w * 0.35, h * 0.25);
        ctx.fillText('贵州', w * 0.5, h * 0.6);
        ctx.fillText('四川', w * 0.4, h * 0.45);
        ctx.fillText('甘肃', w * 0.35, h * 0.3);
    }

    drawEndpoints(ctx, sx, sy, ex, ey) {
        // 起点（江西）
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '11px Microsoft YaHei';
        ctx.fillText('出发：江西', sx + 10, sy + 4);

        // 终点（陕西）
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(ex, ey, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText('到达：陕西', ex + 10, ey + 4);
    }

    drawActualRoute(ctx, w, h) {
        ctx.strokeStyle = 'rgba(192, 57, 43, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        // 简化的长征路线：江西→湖南→贵州→四川→甘肃→陕西
        const points = [
            [0.72, 0.6], [0.65, 0.65], [0.55, 0.62], [0.5, 0.6],
            [0.45, 0.55], [0.42, 0.5], [0.38, 0.45], [0.35, 0.4],
            [0.32, 0.35], [0.35, 0.3], [0.35, 0.25]
        ];
        ctx.moveTo(points[0][0] * w, points[0][1] * h);
        points.forEach(([x, y]) => ctx.lineTo(x * w, y * h));
        ctx.stroke();
        ctx.setLineDash([]);

        // 标注
        ctx.fillStyle = 'rgba(192, 57, 43, 0.8)';
        ctx.font = '10px Microsoft YaHei';
        ctx.fillText('实际长征路线：25000里', w * 0.4, h * 0.9);
    }

    calculatePathLength(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    /* ============================================================
       结果展示
       ============================================================ */
    showChoiceResult(choiceIndex, result) {
        this.choiceResults[choiceIndex] = result;

        const overlay = document.getElementById('result-overlay');
        const altEl = document.getElementById('result-alternative');
        const truthEl = document.getElementById('result-truth');
        const costEl = document.getElementById('result-cost');
        const btnEl = document.getElementById('result-btn');

        const results = [
            {
                // 选择1：秋收起义
                alternative: '如果选择进攻城市——以当时的力量，可能付出更大的代价。',
                truth: '毛泽东选择了农村。秋收起义后，他带领队伍上了井冈山，开辟了"农村包围城市"的道路。',
                cost: '秋收起义：5000余人 → 保留约1000人'
            },
            {
                // 选择2：井冈山
                alternative: '如果根据地建在别处——可能无法坚持那么久。',
                truth: '井冈山，地势险要，易守难攻。毛泽东在这里建立了第一个农村革命根据地。',
                cost: '井冈山时期：红军从1000人发展到10000人'
            },
            {
                // 选择3：长征路线
                alternative: result && result.estimatedLi
                    ? `你画的路线约 ${result.estimatedLi} 里。`
                    : '你画了一条路线。',
                truth: '实际长征：25000里（12500公里）。翻越18座大山，跨过24条大河，走过荒草地，翻过雪山。',
                cost: '长征：86000人出发 → 7000人到达'
            }
        ];

        const r = results[choiceIndex];
        altEl.textContent = r.alternative;
        truthEl.textContent = r.truth;
        costEl.textContent = r.cost;
        btnEl.textContent = '继续';

        overlay.classList.add('active');
        overlay.setAttribute('tabindex', '-1');
        overlay.focus();
        btnEl.onclick = () => {
            overlay.classList.remove('active');
            // 滚动到下一个场景
            const nextScene = document.querySelector(`[data-scene="${choiceIndex + 2}"]`);
            if (nextScene) {
                nextScene.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod5ThreeChoices();
    });
});
