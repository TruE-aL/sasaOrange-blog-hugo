---
title: "另一个方向的池子：dmoe 与 mtyqx"
date: 2026-10-19T20:30:00+08:00
tags: [图片, 实测]
categories: [thoughts]
cover: false
description: "换了两个老牌接口，比一比出图风格和体积——顺便看看它们在窄屏上的表现。"
---

## dmoe

`dmoe.cc/random.php` 是老接口了，出图偏氛围向，冷色调居多。这次抽到一张 2048×1152、约 1.2 MB 的：

![dmoe 抽到的冷调插画](https://www.dmoe.cc/random.php)

体积偏大是个问题。它是 JPEG，没走现代编码，同样的观感下比 WebP 大一倍不止。

## mtyqx

`api.mtyqx.cn/tapi/random.php` 也是 JPEG，2048×1152，同样 1.2 MB 左右。风格上更靠近插画一点：

![mtyqx 的插画](https://api.mtyqx.cn/tapi/random.php)

## 并排看

| 接口 | 格式 | 尺寸 | 体积 | 观感 |
|---|---|---|---|---|
| `dmoe.cc/random.php` | JPEG | 2048×1152 | ~1.2 MB | 氛围、冷调 |
| `api.mtyqx.cn/tapi/random.php` | JPEG | 2048×1152 | ~1.3 MB | 插画、暖调 |

## 用在文章里要注意什么

这两家都是 **JPEG + 1 MB 起**，做首屏封面会明显拖慢 LCP。我的做法是：

1. 封面还是用轻的那家；
2. 这两家只在正文里用，`loading="lazy"` 交给浏览器；
3. 一张文章里最多放两张，再多就换成本地图。

> 顺带记一笔：`image.anosu.top` 和 `api.likepoems.com` 这两个域名在我这儿解析不了，直接没进候选。
