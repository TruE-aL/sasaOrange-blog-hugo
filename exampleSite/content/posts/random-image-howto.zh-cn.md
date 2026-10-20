---
title: "把随机图接到主题里：三种接法"
date: 2026-10-19T17:00:00+08:00
tags: [Hugo, 图片, 教程]
categories: [thoughts]
cover: false
description: "页内 Markdown、front matter 封面、以及站点参数兜底——三种接法各自的取舍。"
---

## 一、正文里直接写

最简单，Markdown 原生：

```markdown
![说明](https://t.alcy.cc/moe)
```

主题会对能识别的静态图片做本地化处理；带查询串的动态接口（比如 `?sort=pc&num=1`）会**保持原 URL 不动**，因为它每次请求都是新图，缓存反而坏事。

![正文里的直接引用](https://t.alcy.cc/moe)

## 二、front matter 指定封面

```yaml
cover: "https://t.alcy.cc/pc"
```

这张会走封面管线：卡片列表里按 280/560/840 三档出 `srcset`，文章页顶部出一张大图并挂灯箱。

## 三、站点参数兜底

没写 `cover` 的文章会自动落到 `Site.Params.banner`。想要「每篇文章都不一样」的效果，可以把 banner 指到一个随机接口：

```toml
[params]
  banner = "https://t.alcy.cc/pc"
```

代价是这个地址**每次构建都可能不同**，构建产物不稳定。我的建议还是逐篇写 `cover`。

## 顺手记一下灯箱

主题的封面图带 `data-original-src`，点开是原图而不是压缩后的版本。上面那张 `/moe` 点一下能看到 1920×1080 的原尺寸。

## 三种接法怎么选

| 接法 | 产物稳定 | 能做 srcset | 适用 |
|---|---|---|---|
| 正文 Markdown | 否（接口随机） | 否 | 演示、临时配图 |
| front matter `cover` | 否 | 是（静态图） | 文章封面 |
| 站点 `banner` | 否 | 是 | 全站默认图 |

真要在正式站点上用，还是把选好的图存进 `static/` 或者页面 bundle，接口只用来挑图。
