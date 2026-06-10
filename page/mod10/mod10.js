/**
 * Mod10 历史显影 — 拍立得摩擦显影 + SVG手写动画
 * 核心机制：用鼠标/手指在拍立得上摩擦，让历史照片逐渐显影
 */

const PHOTOS = [
    {
        icon: '🚢', label: '南湖红船',
        date: '1921年8月',
        title: '开天辟地',
        desc: '浙江嘉兴南湖，一艘小船上，中国共产党诞生了。13位代表，代表全国50多名党员。谁能想到，这艘小船会改变整个中国？',
        handwriting: '星星之火'
    },
    {
        icon: '🏔️', label: '井冈山会师',
        date: '1928年4月',
        title: '革命摇篮',
        desc: '毛泽东和朱德在井冈山会师。从此，"朱毛红军"成为中国革命的一面旗帜。井冈山，成为中国革命的摇篮。',
        handwriting: '农村包围城市'
    },
    {
        icon: '❄️', label: '过雪山',
        date: '1935年6月',
        title: '信念的力量',
        desc: '夹金山，海拔4000米。空气稀薄，气温零下30度。红军战士穿着单衣，一步一步翻过了雪山。许多人倒下了，再也没有站起来。',
        handwriting: '不怕牺牲'
    },
    {
        icon: '🌉', label: '卢沟桥事变',
        date: '1937年7月',
        title: '全面抗战',
        desc: '卢沟桥的枪声，拉开了全面抗战的序幕。中华民族到了最危险的时刻。"宁为战死鬼，不做亡国奴。"',
        handwriting: '起来'
    },
    {
        icon: '🎌', label: '日本投降',
        date: '1945年8月',
        title: '正义的胜利',
        desc: '1945年8月15日，日本宣布无条件投降。十四年抗战，中国军民伤亡超过3500万人。这一天，整个中国都在欢呼。',
        handwriting: '我们胜利了'
    },
    {
        icon: '🏛️', label: '开国大典',
        date: '1949年10月1日',
        title: '人民站起来了',
        desc: '毛泽东在天安门城楼上庄严宣告："中华人民共和国中央人民政府今天成立了！"中国人民从此站起来了。',
        handwriting: '中国人民站起来了'
    }
];

class Mod10PhotoDevelop {
    constructor() {
        this.developed = [];
        this.currentDetail = null;

        this.photoArea = document.getElementById('photo-area');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.detailPanel = document.getElementById('detail-panel');
        this.ending = document.getElementById('ending');

        this.init();
    }

    init() {
        this.createPhotos();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.detailPanel.classList.contains('active')) {
                this.detailPanel.classList.remove('active');
            }
        });
    }

    /** 创建拍立得卡片 */
    createPhotos() {
        PHOTOS.forEach((photo, i) => {
            const card = document.createElement('div');
            card.className = 'polaroid';
            card.dataset.index = i;

            const frame = document.createElement('div');
            frame.className = 'photo-frame';

            // 照片内容
            const content = document.createElement('div');
            content.className = 'photo-content';
            content.innerHTML = `
                <div class="photo-icon">${photo.icon}</div>
                <div class="photo-label">${photo.label}</div>
            `;
            frame.appendChild(content);

            // 摩擦遮罩（用canvas实现）
            const canvas = document.createElement('canvas');
            canvas.className = 'photo-mask';
            canvas.width = 280;
            canvas.height = 210;
            frame.appendChild(canvas);

            // 摩擦进度
            const progress = document.createElement('div');
            progress.className = 'friction-progress';
            progress.textContent = '0%';
            frame.appendChild(progress);

            card.appendChild(frame);

            // 底部文字
            const caption = document.createElement('div');
            caption.className = 'polaroid-caption';
            caption.innerHTML = `
                <div class="caption-date">${photo.date}</div>
                <div class="caption-text" id="caption-${i}">${photo.title}</div>
            `;
            card.appendChild(caption);

            this.photoArea.appendChild(card);

            // 初始化canvas遮罩
            this.initFriction(canvas, i, progress, content, card);
        });
    }

    /** 初始化摩擦交互 */
    initFriction(canvas, index, progressEl, contentEl, cardEl) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // 填充初始颜色
        const fillMask = () => {
            ctx.fillStyle = '#c8c2b8';
            ctx.fillRect(0, 0, w, h);
            // 添加纹理
            for (let i = 0; i < 500; i++) {
                ctx.fillStyle = `rgba(${180 + Math.random() * 30}, ${175 + Math.random() * 30}, ${165 + Math.random() * 30}, 0.3)`;
                ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
            }
        };
        fillMask();

        let isDrawing = false;
        let erasedPixels = 0;
        const totalPixels = w * h;
        const threshold = 0.55; // 55%擦除即显影

        const erase = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // 计算擦除比例
            const imageData = ctx.getImageData(0, 0, w, h);
            let transparent = 0;
            for (let i = 3; i < imageData.data.length; i += 4) {
                if (imageData.data[i] < 128) transparent++;
            }
            erasedPixels = transparent / totalPixels;

            // 更新进度
            const pct = Math.min(100, Math.round(erasedPixels * 100));
            progressEl.textContent = pct + '%';
            progressEl.classList.add('visible');

            if (erasedPixels > 0.1) {
                contentEl.style.opacity = Math.min(1, erasedPixels / threshold);
                // 高斯模糊渐变 — 照片从模糊到清晰
                const blur = Math.max(0, 8 * (1 - erasedPixels / threshold));
                contentEl.style.filter = `blur(${blur}px)`;
            }

            if (erasedPixels >= threshold && !this.developed.includes(index)) {
                this.onDeveloped(index, contentEl, cardEl, canvas);
            }
        };

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = w / rect.width;
            const scaleY = h / rect.height;
            const pos = e.touches ? e.touches[0] : e;
            return {
                x: (pos.clientX - rect.left) * scaleX,
                y: (pos.clientY - rect.top) * scaleY
            };
        };

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const p = getPos(e);
            erase(p.x, p.y);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const p = getPos(e);
            erase(p.x, p.y);
        });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        // 触摸
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const p = getPos(e);
            erase(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const p = getPos(e);
            erase(p.x, p.y);
        }, { passive: false });
        canvas.addEventListener('touchend', () => isDrawing = false);
    }

    /** 照片显影完成 */
    onDeveloped(index, contentEl, cardEl, canvas) {
        this.developed.push(index);

        // 显示内容 — 完全清晰
        contentEl.style.filter = 'blur(0)';
        contentEl.style.opacity = '1';
        contentEl.classList.add('revealed');
        cardEl.classList.add('done');

        // 显示标题
        const caption = document.getElementById(`caption-${index}`);
        if (caption) caption.classList.add('visible');

        // 更新进度
        this.progressFill.style.width = (this.developed.length / PHOTOS.length * 100) + '%';
        this.progressText.textContent = `${this.developed.length} / ${PHOTOS.length}`;

        // 音效
        if (typeof AudioEngine !== 'undefined') {
            AudioEngine.playTone(880, 0.15, 'sine');
            setTimeout(() => AudioEngine.playTone(1100, 0.1, 'sine'), 200);
        }

        // 点击查看详情
        cardEl.addEventListener('click', () => this.showDetail(index));

        // 全部完成
        if (this.developed.length >= PHOTOS.length) {
            setTimeout(() => this.showEnding(), 2000);
        }
    }

    /** 显示详情 */
    showDetail(index) {
        const photo = PHOTOS[index];
        this.currentDetail = index;

        document.getElementById('detail-photo').textContent = photo.icon;
        document.getElementById('detail-title').textContent = photo.title;
        document.getElementById('detail-date').textContent = photo.date;
        document.getElementById('detail-desc').textContent = photo.desc;

        // SVG手写动画
        this.animateHandwriting(photo.handwriting);

        this.detailPanel.classList.add('active');

        document.getElementById('detail-close').onclick = () => {
            this.detailPanel.classList.remove('active');
        };
    }

    /** SVG手写动画 */
    animateHandwriting(text) {
        const svg = document.getElementById('handwriting-svg');
        svg.innerHTML = '';

        // 用简单的路径模拟手写
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = 'M 10 40';
        const charWidth = 280 / Math.max(text.length, 1);

        for (let i = 0; i < text.length; i++) {
            const x = 10 + (i + 1) * charWidth;
            const y = 35 + Math.sin(i * 0.8) * 8;
            // 用贝塞尔曲线模拟手写
            const cp1x = 10 + (i + 0.3) * charWidth;
            const cp1y = 30 + Math.cos(i * 1.2) * 12;
            const cp2x = 10 + (i + 0.7) * charWidth;
            const cp2y = 40 + Math.sin(i * 0.6) * 10;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }

        path.setAttribute('d', d);
        svg.appendChild(path);

        // 计算路径长度
        const length = path.getTotalLength();
        path.style.setProperty('--path-length', length);
        path.classList.add('handwriting-path');

        // 触发动画
        requestAnimationFrame(() => {
            path.classList.add('animate');
        });
    }

    /** 结尾 */
    showEnding() {
        const grid = document.getElementById('ending-grid');
        PHOTOS.forEach(photo => {
            const thumb = document.createElement('div');
            thumb.className = 'ending-thumb';
            thumb.innerHTML = `
                ${photo.icon}
                <div class="thumb-caption">${photo.date}</div>
            `;
            grid.appendChild(thumb);
        });

        this.ending.classList.add('active');
        this.ending.scrollIntoView({ behavior: 'smooth' });

        // 保存
        if (typeof Storage !== 'undefined') {
            Storage.setModuleProgress('mod10', { completed: true, photos: this.developed.length });
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod10PhotoDevelop();
    });
});
