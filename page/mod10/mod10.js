/**
 * Mod10 历史显影 — 拍立得摩擦显影 + SVG手写动画
 * 核心机制：用鼠标/手指在拍立得上摩擦，让历史照片逐渐显影
 */

const PHOTOS = [
    {
        icon: '🚢', label: '南湖红船',
        date: '1921年8月',
        title: '开天辟地',
        desc: '1921年7月23日，中国共产党第一次全国代表大会在上海法租界望志路106号秘密召开。13位代表——毛泽东、何叔衡、董必武、陈潭秋、王尽美、邓恩铭、李达、李汉俊、张国焘、刘仁静、陈公博、周佛海、包惠僧——代表全国50余名党员出席会议。7月30日晚，一名神秘的陌生人突然闯入会场，引起警觉，会议被迫中断。代表们辗转来到浙江嘉兴南湖，在一艘租来的画舫上完成了最后的议程。谁能想到，这艘小小的红船，承载了一个改变中国命运的政党。',
        detail: '一大会址最初选在上海并非偶然——上海是中国工人阶级最集中的城市，也是马克思主义传播最早的地区之一。闯入会场的陌生人后来被确认为法租界巡捕房的密探程子卿，正是他的出现促成了南湖之行，历史的偶然成就了"红船精神"的永恒象征。这13位代表中，后来有7人脱党或叛变，只有毛泽东和董必武走到了最后。',
        quote: '其作始也简，其将毕也必巨。——毛泽东（1945年引用《庄子》谈建党初心）',
        handwriting: '星星之火'
    },
    {
        icon: '🏔️', label: '井冈山会师',
        date: '1928年4月',
        title: '革命摇篮',
        desc: '1928年4月28日，朱德、陈毅率领南昌起义余部和湘南暴动农军约1万余人，历经艰险到达江西宁冈砻市，与毛泽东率领的秋收起义部队胜利会师。两双巨手紧握在一起，中国革命翻开了崭新的一页。5月4日，两支部队合编为中国工农革命军第四军（后改称红四军），朱德任军长，毛泽东任党代表，全军约1万余人。"朱毛红军"的威名从此传遍湘赣边界。',
        detail: '井冈山会师绝非一帆风顺。朱德部队从湘南出发时有1万余人，沿途遭敌军围追堵截，到达井冈山时仅剩约8000人。毛泽东为接应朱德部队，亲率部队攻占汝城、资兴等地。会师后创建的井冈山革命根据地，是中国共产党领导下的第一个农村革命根据地，开创了"农村包围城市、武装夺取政权"的革命道路，被誉为"中国革命的摇篮"。',
        quote: '星星之火，可以燎原。——毛泽东（1930年1月《星星之火，可以燎原》）',
        handwriting: '农村包围城市'
    },
    {
        icon: '❄️', label: '过雪山',
        date: '1935年6月',
        title: '信念的力量',
        desc: '1935年6月12日，中央红军先头部队翻越长征中的第一座大雪山——夹金山。夹金山位于四川省宝兴县与小金县之间，主峰海拔4930米，红军翻越的垭口海拔约4114米。山上空气含氧量仅为平地的60%，气温骤降至零下30度。红军将士身着单衣，脚穿草鞋，靠辣椒水和生姜驱寒。许多战士走着走着突然坐下，就再也没有站起来——他们被活活冻死了。仅翻越夹金山一役，就有数百名红军战士长眠于冰雪之中。',
        detail: '夹金山在当地被称为"仙人山"，意为只有神仙才能翻越。红军选择在凌晨两点出发，因为此时冰雪冻结，路面相对坚硬。即便如此，陡峭的冰坡仍让无数人滑落深渊。红一军团和红三军团各牺牲了数百人，红四团政委杨成武后来回忆："山上空气稀薄得连话都说不出来，每走一步都要使出全身的力气。"这座雪山，成为长征精神最悲壮的注脚。',
        quote: '红军不怕远征难，万水千山只等闲。——毛泽东（1935年10月《七律·长征》）',
        handwriting: '不怕牺牲'
    },
    {
        icon: '🌉', label: '卢沟桥事变',
        date: '1937年7月',
        title: '全面抗战',
        desc: '1937年7月7日夜，日军在北平西南的卢沟桥（西方称"马可波罗桥"）附近举行军事演习，借口一名士兵"失踪"，要求进入宛平县城搜查，遭到中国守军第29军严词拒绝。7月8日凌晨5时，日军向宛平城和卢沟桥发动猛烈进攻，第29军37师110旅219团奋起抵抗。团长吉星文亲率突击队与日军展开白刃战，打响了全民族抗战的第一枪。这一枪，拉开了长达8年全面抗战的序幕，中华民族到了最危险的时刻。',
        detail: '卢沟桥事变并非偶发事件，而是日本蓄谋已久的侵华步骤。早在1931年"九一八事变"后，日本已侵占中国东北全境。1937年时，日军已在华北驻扎重兵，卢沟桥是北平通往南方的唯一通道。第29军军长宋哲元曾在战与和之间犹豫，但将士们的热血不容犹豫。事变后一个月内，日军增兵至20万，8月13日又进攻上海，中国全面抗战正式爆发。这场战争持续了整整8年，中国军民伤亡总数超过3500万人。',
        quote: '宁为战死鬼，不做亡国奴。——第29军将士誓言',
        handwriting: '起来'
    },
    {
        icon: '🎌', label: '日本投降',
        date: '1945年8月',
        title: '正义的胜利',
        desc: '1945年8月15日正午，日本天皇裕仁通过广播发表《终战诏书》，宣布接受《波茨坦公告》，无条件投降。9月2日上午9时，在东京湾美军"密苏里号"军舰上，日本外相重光葵代表天皇和政府、参谋总长梅津美治郎代表大本营，在投降书上签字。至此，历时14年的中国抗日战争取得最终胜利。中国军民在这场战争中共伤亡超过3500万人，直接经济损失1000亿美元以上，间接损失5000亿美元以上。胜利的消息传遍全国，重庆、延安、昆明、成都等地万民欢腾，鞭炮声彻夜不绝。',
        detail: '中国战场是世界反法西斯战争的东方主战场，牵制了日本陆军总兵力的60%以上。从1931年"九一八事变"到1945年日本投降，中国军民独自抗击日本法西斯长达14年。在这14年中，中国军队共进行大会战22次、重要战斗2000余次，歼灭日军150余万人。受降典礼上，中国战区代表何应钦将军在南京中央军校大礼堂接受了侵华日军总司令冈村宁次的投降书，这一页历史，是用3500万同胞的鲜血写成的。',
        quote: '地不分南北，年不分老幼，无论何人，皆有守土抗战之责任。——蒋介石（1937年7月17日庐山讲话）',
        handwriting: '我们胜利了'
    },
    {
        icon: '🏛️', label: '开国大典',
        date: '1949年10月1日',
        title: '人民站起来了',
        desc: '1949年10月1日下午3时，北京天安门广场聚集了30万军民。毛泽东主席登上天安门城楼，按下电钮，第一面五星红旗在《义勇军进行曲》的旋律中冉冉升起。随后，毛泽东用他那浓重的湖南口音向全世界庄严宣告："中华人民共和国中央人民政府今天成立了！"广场上欢声雷动。接着举行了盛大的阅兵式和群众游行，54门礼炮齐鸣28响——28响象征着中国共产党领导中国人民走过的28年光辉历程。阅兵式上，人民解放军的步兵、骑兵、炮兵、装甲兵、空军依次通过天安门广场，17架飞机飞过广场上空。',
        detail: '开国大典的每一个数字都有深意：54门礼炮代表当时全国54个民族，28响代表中国共产党从1921年成立到1949年走过的28年。为防止敌机空袭，受阅飞机中有4架P-51战斗机带弹飞行，在通过天安门后立即升空执行战斗值班。毛泽东在天安门城楼上按动电钮将国旗升起的那一刻，整个广场鸦雀无声，随后爆发出经久不息的欢呼。当日的《人民日报》号外在几个小时内被抢购一空。这一天，标志着中国人民从此站起来了，中华民族开启了新的纪元。',
        quote: '中国人民从此站起来了！——毛泽东（1949年10月1日天安门城楼）',
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
        document.getElementById('detail-detail').textContent = photo.detail || '';
        document.getElementById('detail-quote').textContent = photo.quote || '';

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
