---
title: "anosu 的两个池子：pc 与 pixiv"
date: 2026-10-19T18:30:00+08:00
tags: [图片, 实测]
categories: [thoughts]
cover: false
description: "anosu 的 pc 池很快，pixiv 池慢到要 20 秒——同一个域名下速度差了一个数量级。"
---

## pc 池

`api.anosu.top/img/?sort=pc&num=1` 出 JPEG，本次抽到 1920×1079、约 900 KB：

![anosu pc 池](https://api.anosu.top/img/?sort=pc&num=1)

响应时间 2 秒上下，不算快，但能用。

## pixiv 池

只有 `sort` 不同：

![anosu pixiv 池](https://api.anosu.top/img/?sort=pixiv&num=1)

**同样的域名，同样的参数结构，响应时间却要 20 秒以上**，两次实测分别在 20.4s 和 25s 卡住。这不是网络抖动——同一台机器上 `pc` 池 2 秒就回来了。

## 差异在哪

| 池 | 格式 | 本次尺寸 | 体积 | 响应 |
|---|---|---|---|---|
| `sort=pc` | JPEG | 1920×1079 | ~900 KB | ~2.2 s |
| `sort=pixiv` | JPEG | 1920×1079 | 490 KB+（未下完） | > 20 s |

`pixiv` 池大概是实时去源站取图，没有缓存。这种接口**不适合放在页面里直接引用**：浏览器没有耐心等 20 秒，用户看到的是一个破图框。

## 结论

- `pc` 池可以当正文配图，但建议给 `<img>` 配个占位底色；
- `pixiv` 池只能离线用：写文章时手动取一张存本地，别让读者现场等。

另外 `image.anosu.top` 这个域名解析不了，跟 `api.anosu.top` 不是一台机器。
