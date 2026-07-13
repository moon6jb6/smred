/**
 * Mod6 中国力量 — 从零互动升级为多维互动
 * 交互：时间轴滑块、数字动画、事件触发颜色、个人关联、数字对比、70年一屏
 */

const TIMELINE_DATA = [
    {
        year: 1949,
        event: '建国',
        color: '#c0392b',  // 红
        data: [
            { icon: 'fa-heart-pulse', label: '人均寿命', value: 35, unit: '岁', compare: { year: 2026, value: 78, unit: '岁' } },
            { icon: 'fa-graduation-cap', label: '文盲率', value: 80, unit: '%', compare: { year: 2026, value: 2.7, unit: '%' } },
            { icon: 'fa-road', label: '公路里程', value: 8, unit: '万公里', compare: { year: 2026, value: 535, unit: '万公里' } },
            { icon: 'fa-wheat-awn', label: '粮食产量', value: 11318, unit: '万吨', compare: { year: 2026, value: 69000, unit: '万吨' } }
        ]
    },
    {
        year: 1964,
        event: '原子弹',
        color: '#d4af37',  // 金
        data: [
            { icon: 'fa-atom', label: '核弹数量', value: 1, unit: '颗', note: '第一颗原子弹爆炸成功' },
            { icon: 'fa-flask', label: '科研人员', value: 50, unit: '万人', compare: { year: 2026, value: 600, unit: '万人' } },
            { icon: 'fa-industry', label: '工业产值', value: 1624, unit: '亿元', compare: { year: 2026, value: 400000, unit: '亿元' } }
        ]
    },
    {
        year: 1978,
        event: '改革开放',
        color: '#2980b9',  // 蓝
        data: [
            { icon: 'fa-money-bill', label: '农民年收入', value: 134, unit: '元', compare: { year: 2026, value: 21000, unit: '元' } },
            { icon: 'fa-city', label: '城镇化率', value: 17.9, unit: '%', compare: { year: 2026, value: 66, unit: '%' } },
            { icon: 'fa-plane-departure', label: '出境人数', value: 0.002, unit: '亿人次', compare: { year: 2026, value: 1.5, unit: '亿人次' } }
        ]
    },
    {
        year: 2001,
        event: '加入WTO',
        color: '#27ae60',  // 绿
        data: [
            { icon: 'fa-chart-line', label: 'GDP', value: 11, unit: '万亿元', compare: { year: 2026, value: 126, unit: '万亿元' } },
            { icon: 'fa-building', label: '外汇储备', value: 2122, unit: '亿美元', compare: { year: 2026, value: 32000, unit: '亿美元' } },
            { icon: 'fa-train', label: '高铁里程', value: 0, unit: '公里', compare: { year: 2026, value: 45000, unit: '公里' } }
        ]
    },
    {
        year: 2008,
        event: '汶川地震',
        color: '#8b0000',  // 深红
        data: [
            { icon: 'fa-heart', label: '遇难人数', value: 69297, unit: '人', note: '国务院公告 2008-09-25' },
            { icon: 'fa-hand-holding-heart', label: '志愿者', value: 300, unit: '万人+', note: '全国动员' },
            { icon: 'fa-house-chimney', label: '重建投入', value: 10000, unit: '亿元', note: '三年重建任务' }
        ]
    },
    {
        year: 2020,
        event: '脱贫攻坚',
        color: '#ecf0f1',  // 白
        data: [
            { icon: 'fa-users', label: '脱贫人口', value: 9899, unit: '万人', note: '现行标准下全部脱贫' },
            { icon: 'fa-house', label: '易地搬迁', value: 960, unit: '万人', note: '搬出大山' },
            { icon: 'fa-seedling', label: '贫困村', value: 128000, unit: '个', note: '全部出列' }
        ]
    },
    {
        year: 2026,
        event: '今天',
        color: null,  // 全彩
        data: [
            { icon: 'fa-earth-asia', label: 'GDP总量', value: 126, unit: '万亿元', note: '世界第二' },
            { icon: 'fa-satellite', label: '在轨卫星', value: 800, unit: '颗+', note: '北斗全球组网' },
            { icon: 'fa-train-subway', label: '高铁里程', value: 45000, unit: '公里', note: '世界第一' },
            { icon: 'fa-truck-fast', label: '快递日均', value: 127, unit: '件/人', note: '国家邮政局数据' }
        ]
    }
];

// 个人关联数据库（部分年份）
const PERSONAL_EVENTS = {
    1949: '中华人民共和国成立。一个新时代开始了。',
    1950: '抗美援朝战争爆发。',
    1955: '授衔十大元帅。',
    1960: '大庆油田发现。',
    1964: '第一颗原子弹爆炸成功。',
    1970: '第一颗人造卫星"东方红一号"发射。',
    1978: '改革开放开始。',
    1980: '深圳经济特区成立。',
    1984: '许海峰获得中国第一枚奥运金牌。',
    1990: '北京亚运会。',
    1997: '香港回归。',
    1999: '澳门回归。',
    2001: '加入WTO。北京申奥成功。',
    2003: '杨利伟乘神舟五号进入太空。',
    2008: '北京奥运会。汶川地震。',
    2010: '上海世博会。',
    2012: '辽宁舰入列。',
    2015: '屠呦呦获诺贝尔奖。',
    2019: '嫦娥四号月背着陆。',
    2020: '脱贫攻坚完成。新冠疫情防控。',
    2021: '建党100周年。天问一号着陆火星。',
    2022: '北京冬奥会。',
    2023: '国产大飞机C919商业首飞。',
    2024: '嫦娥六号月背采样返回。',
    2025: '中国空间站全面建成运营。',
    2026: '今天。'
};

function getPersonalEvent(year) {
    if (PERSONAL_EVENTS[year]) return PERSONAL_EVENTS[year];
    // 找最近的年份
    const years = Object.keys(PERSONAL_EVENTS).map(Number).sort((a, b) => a - b);
    for (let i = years.length - 1; i >= 0; i--) {
        if (years[i] <= year) return PERSONAL_EVENTS[years[i]];
    }
    return PERSONAL_EVENTS[1949];
}

class Mod6ChinaPower {
    constructor() {
        this.currentYear = 1949;
        this.expandedCard = null;
        this.panoramaVisible = false;

        this.yearDisplay = document.getElementById('year-display');
        this.slider = document.getElementById('year-slider');
        this.cardsContainer = document.getElementById('data-cards');
        this.colorFlash = document.getElementById('color-flash');
        this.personalInput = document.getElementById('birth-year');
        this.personalResult = document.getElementById('personal-result');
        this.panoramaGrid = document.getElementById('panorama-grid');

        this.init();
    }

    init() {
        // 时间轴滑块
        this.slider.addEventListener('input', (e) => {
            this.setYear(parseInt(e.target.value));
        });

        // 个人关联
        document.getElementById('birth-btn').addEventListener('click', () => this.showPersonal());
        this.personalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.showPersonal();
        });

        // 70年一屏（IntersectionObserver触发）
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.panoramaVisible) {
                    this.panoramaVisible = true;
                    this.panoramaGrid.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });
        observer.observe(this.panoramaGrid);

        // 初始渲染
        this.setYear(1949);
        this.renderPanorama();
    }

    /** 设置年份 */
    setYear(year) {
        this.currentYear = year;
        this.slider.value = year;
        this.yearDisplay.textContent = year;

        // 找到对应事件
        let event = null;
        for (let i = TIMELINE_DATA.length - 1; i >= 0; i--) {
            if (year >= TIMELINE_DATA[i].year) {
                event = TIMELINE_DATA[i];
                break;
            }
        }

        // 触发颜色
        if (event && event.color) {
            this.colorFlash.style.background = event.color;
            this.colorFlash.classList.add('active');
            setTimeout(() => this.colorFlash.classList.remove('active'), 800);
        } else if (event && !event.color) {
            // 今天：全彩渐变
            this.colorFlash.style.background = 'linear-gradient(135deg, #c0392b, #d4af37, #2980b9, #27ae60)';
            this.colorFlash.classList.add('active');
            setTimeout(() => this.colorFlash.classList.remove('active'), 800);
        }

        // 渲染数据卡片
        if (event) this.renderCards(event);
    }

    /** 渲染数据卡片 */
    renderCards(event) {
        this.cardsContainer.innerHTML = '';

        event.data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'data-card';
            card.dataset.index = index;

            // 计算当前年份的数值（线性插值）
            let displayValue = item.value;
            if (item.compare && this.currentYear > event.year) {
                const progress = (this.currentYear - event.year) / (item.compare.year - event.year);
                displayValue = item.value + (item.compare.value - item.value) * progress;
            }

            // 格式化数值
            const formattedValue = this.formatNumber(displayValue, item.unit);

            card.innerHTML = `
                <div class="card-year">${event.year}</div>
                <div class="card-icon"><i class="fa-solid ${item.icon}"></i></div>
                <div class="card-label">${item.label}</div>
                <div class="card-value">${formattedValue}</div>
                <div class="card-unit">${item.unit}</div>
                ${item.note ? `<div class="caption" style="margin-top:0.5rem">${item.note}</div>` : ''}
                ${item.compare ? `
                <div class="compare-panel">
                    <div class="compare-row">
                        <span class="year-label">${event.year}</span>
                        <span class="value-label">${this.formatNumber(item.value, item.unit)}</span>
                    </div>
                    <div class="compare-row">
                        <span class="arrow">→</span>
                    </div>
                    <div class="compare-row">
                        <span class="year-label">${item.compare.year}</span>
                        <span class="value-label">${this.formatNumber(item.compare.value, item.unit)}</span>
                    </div>
                </div>
                ` : ''}
            `;

            // 点击展开对比
            if (item.compare) {
                card.addEventListener('click', () => {
                    if (this.expandedCard === card) {
                        card.classList.remove('expanded');
                        this.expandedCard = null;
                    } else {
                        if (this.expandedCard) this.expandedCard.classList.remove('expanded');
                        card.classList.add('expanded');
                        this.expandedCard = card;
                    }
                });
            }

            // 数字动画
            this.cardsContainer.appendChild(card);
            this.animateValue(card.querySelector('.card-value'), displayValue, item.unit);
        });
    }

    /** 数字动画 */
    animateValue(el, target, unit) {
        const duration = 1500;
        const start = performance.now();
        const startVal = 0;

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = startVal + (target - startVal) * eased;
            el.textContent = this.formatNumber(current, unit);
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    /** 格式化数字 */
    formatNumber(num, unit) {
        if (num >= 10000) {
            return (num / 10000).toFixed(num >= 100000 ? 0 : 1) + '万';
        }
        if (num >= 1000) {
            return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
        }
        if (num < 1 && num > 0) {
            return num.toFixed(3);
        }
        if (Number.isInteger(num)) return num.toString();
        return num.toFixed(1);
    }

    /** 显示个人关联 */
    showPersonal() {
        const input = this.personalInput.value.trim();
        const year = parseInt(input);

        if (isNaN(year) || year < 1949 || year > 2026) {
            this.personalResult.textContent = '请输入1949-2026之间的年份';
            this.personalResult.style.color = 'var(--text-secondary)';
            return;
        }

        const event = getPersonalEvent(year);
        this.personalResult.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'highlight';
        span.textContent = year + '年';
        this.personalResult.appendChild(span);
        this.personalResult.appendChild(document.createTextNode('，' + event));
        this.personalResult.style.color = '';
    }

    /** 渲染70年一屏 */
    renderPanorama() {
        this.panoramaGrid.innerHTML = '';
        const allData = [];

        TIMELINE_DATA.forEach(event => {
            event.data.forEach(item => {
                allData.push({
                    year: event.year,
                    label: item.label,
                    value: this.formatNumber(item.value, item.unit),
                    unit: item.unit
                });
            });
        });

        allData.forEach(item => {
            const el = document.createElement('div');
            el.className = 'panorama-item';
            el.innerHTML = `
                <div class="p-year">${item.year}</div>
                <div class="p-value">${item.value}</div>
                <div class="p-label">${item.label}</div>
            `;
            this.panoramaGrid.appendChild(el);
        });
    }
}

// 启动
document.addEventListener('DOMContentLoaded', function() {
    checkNarrativeTransition(function() {
        new Mod6ChinaPower();
    });
});
