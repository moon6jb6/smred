#!/usr/bin/env python3
"""从HTML文件中提取base64编码的图片，保存为独立文件并更新引用"""

import re
import os
import base64
import hashlib

# 项目根目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PAGE_DIR = os.path.join(BASE_DIR, "page")

# 需要处理的HTML文件
HTML_FILES = [
    os.path.join(PAGE_DIR, "longfight_rouit_mod1/mod1.html"),
    os.path.join(PAGE_DIR, "sacrifice_mod4/mod4.html"),
    os.path.join(PAGE_DIR, "greatman_mod5/mod5.html"),
    os.path.join(PAGE_DIR, "event_mod7/mod7.html"),
    os.path.join(PAGE_DIR, "timeriver_museum_mod3/bingqi_mod8/mod8.html"),
    os.path.join(PAGE_DIR, "global_event_mod9/mod9.html"),
]

# 匹配 data:image/xxx;base64,xxx 模式
# 支持在 src="..." 或 background-image: url("...") 中
BASE64_PATTERN = re.compile(
    r'(data:image/(png|jpeg|jpg|webp|gif|svg\+xml);base64,)([A-Za-z0-9+/=\s]+)',
    re.IGNORECASE
)

def get_extension(mime_type):
    """根据MIME类型获取文件扩展名"""
    mapping = {
        'png': 'png',
        'jpeg': 'jpg',
        'jpg': 'jpg',
        'webp': 'webp',
        'gif': 'gif',
        'svg+xml': 'svg',
    }
    return mapping.get(mime_type.lower(), 'jpg')

def extract_base64_from_html(html_path):
    """从单个HTML文件中提取所有base64图片"""
    html_dir = os.path.dirname(html_path)
    html_name = os.path.splitext(os.path.basename(html_path))[0]

    # 创建图片输出目录
    img_dir = os.path.join(html_dir, f"{html_name}_images")
    os.makedirs(img_dir, exist_ok=True)

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = []
    img_count = 0

    for match in BASE64_PATTERN.finditer(content):
        prefix = match.group(1)  # data:image/xxx;base64,
        mime_type = match.group(2)  # png, jpeg, etc.
        b64_data = match.group(3).replace('\n', '').replace('\r', '').replace(' ', '')
        full_match = match.group(0)

        # 解码base64
        try:
            img_bytes = base64.b64decode(b64_data)
        except Exception as e:
            print(f"  警告: 无法解码base64数据: {e}")
            continue

        # 跳过太小的图片（可能是装饰性的SVG等）
        if len(img_bytes) < 1000:
            print(f"  跳过小图片 ({len(img_bytes)} bytes)")
            continue

        # 用内容哈希作为文件名，避免重复
        content_hash = hashlib.md5(img_bytes).hexdigest()[:8]
        ext = get_extension(mime_type)
        filename = f"img_{img_count:02d}_{content_hash}.{ext}"
        filepath = os.path.join(img_dir, filename)

        # 保存图片
        with open(filepath, 'wb') as f:
            f.write(img_bytes)

        # 计算相对路径
        rel_path = os.path.relpath(filepath, html_dir).replace('\\', '/')

        replacements.append({
            'old': full_match,
            'new': rel_path,
            'size': len(img_bytes),
            'filename': filename,
        })

        img_count += 1
        print(f"  提取: {filename} ({len(img_bytes):,} bytes)")

    # 执行替换
    new_content = content
    for rep in replacements:
        # 替换 src="data:..." 中的data URI
        old_src = f'src="{rep["old"]}"'
        new_src = f'src="{rep["new"]}"'
        new_content = new_content.replace(old_src, new_src)

        # 也替换 src='data:...' (单引号)
        old_src_single = f"src='{rep['old']}'"
        new_src_single = f"src='{rep['new']}'"
        new_content = new_content.replace(old_src_single, new_src_single)

    # 写回HTML
    if replacements:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        total_saved = sum(r['size'] for r in replacements)
        original_size = len(content.encode('utf-8'))
        new_size = len(new_content.encode('utf-8'))

        print(f"  完成: 提取 {len(replacements)} 张图片")
        print(f"  HTML: {original_size:,} → {new_size:,} bytes (减少 {original_size - new_size:,})")
        print(f"  图片总计: {total_saved:,} bytes")
    else:
        print(f"  未找到base64图片")

    return len(replacements)

def main():
    print("=" * 60)
    print("Base64 图片提取工具")
    print("=" * 60)

    total_extracted = 0

    for html_path in HTML_FILES:
        if not os.path.exists(html_path):
            print(f"\n文件不存在: {html_path}")
            continue

        rel_path = os.path.relpath(html_path, BASE_DIR)
        print(f"\n处理: {rel_path}")
        print("-" * 40)

        count = extract_base64_from_html(html_path)
        total_extracted += count

    print(f"\n{'=' * 60}")
    print(f"总计提取: {total_extracted} 张图片")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
