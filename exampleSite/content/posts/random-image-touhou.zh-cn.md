---
title: "东方和 96 那两路：风格化随机图"
date: 2026-10-19T19:45:00+08:00
tags: [图片, 实测, 东方]
categories: [story]
cover: false
description: "paulzzh 的东方池和 98qy 的随机图，出图稳定、体积适中，适合当收藏向文章的封面。"
---

## paulzzh 的东方池

`img.paulzzh.com/touhou/random` 只出东方角色图，抽到的这张是 1697×1200 的 WebP，才 96 KB——这批接口里体积控制最好的一个。

![东方池抽到的图](https://img.paulzzh.com/touhou/random)

## 98qy

`www.98qy.com/sjbz/api.php` 走的是 HTTP，出图是 JPEG 3840×2160，约 700 KB。走 HTTP 这点要注意：**HTTPS 站点里嵌 HTTP 图会被浏览器拦掉**，实测确实被拦了，所以这篇里只能放链接、不能内嵌。

## 为什么推荐 paulzzh

- WebP，体积小；
- 尺寸适中（1697×1200），不会被裁得太狠；
- 风格统一，做系列文章的封面不会跳。

再看一张，确认不是偶然：

![再来一张](https://img.paulzzh.com/touhou/random)

## 一点建议

如果站点的主题是某类同人作品，用同人池当封面比用通用壁纸池更贴题。缺点是图片重复率会高，建议自己在本地缓存一份。
