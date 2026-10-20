<div align="center">

# hugo-theme-sasaOrange

**为个人博客而做的 Hugo 主题，纸页、宋体、安静的留白**

[![Hugo Extended](https://img.shields.io/badge/Hugo_Extended-%E2%89%A5_0.162.1-ff4088?logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
![Status](https://img.shields.io/badge/Status-Release_Candidate-orange)

[线上演示](https://sasaorange-blog-hugo-demo.pages.dev/) · [通用示例](exampleSite) · [变更记录](CHANGELOG.md) · [反馈问题](https://github.com/TruE-aL/sasaOrange-blog-hugo/issues)

简体中文 | [English](README.en.md)

</div>

sasaOrange 源自 [hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) 与 [hugo-theme-ruri](https://github.com/GuZhengSVT/hugo-theme-ruri)，保留博客常用能力，沿用 ruri 的页面结构，重新设计了配色与阅读版式。个人站点使用独立配置；文章、图片、歌单和服务不包含在主题仓库中。

> 当前为公开候选版。构建与部分交互已验证，完整视觉、跨浏览器和真实音源验收情况见 [QA_REPORT.md](QA_REPORT.md)。

## 特性

| 分类 | 功能 |
| --- | --- |
| 页面 | 响应式布局（窄屏菜单收进底部抽屉）、纸感阅读配色（暖沙杏金／冷青）、深浅色模式、封面、分类与标签、归档时间树、写作热力图 |
| 阅读 | 可折叠目录、代码语言栏／复制／折叠、PhotoSwipe 图片灯箱、KaTeX、Mermaid |
| 搜索与订阅 | 多语言 Pagefind 搜索、RSS |
| 评论与统计 | Waline 评论、阅读数／评论数、真实阅读数据热门文章、页脚总字数／阅读时长 |
| 社交 | 分类友链、微信分享二维码、个人二维码弹窗、打赏 |
| 音乐 | 原生浮动播放器、直接歌单／Meting、歌词与译文、进度／音量／播放顺序 |
| 导航与语言 | 站内局部导航保留播放器，切页时两翼纸页滑合、中央大齿轮转动的加载反馈；简繁中文、英文、日文界面与四语言示例 |

## 外观与配色

默认外观是"纸感书页"：近白纸底、暖褐文字、宋体正文，首页居中排成一张扉页，正文首行缩进两格、两端对齐。默认这套配色的色值取自首页插画——杏金的分隔线、赭石褐的强调色，整页和那张画是同一副调子。

顶栏右侧的两枚小圆点是**阅读配色**，可随时切换；再点一次当前选中的那枚即恢复默认。选择存在浏览器本地，刷新与站内跳转都会保持。

| 配色 | 底色 | 强调色 | 适合 |
| --- | --- | --- | --- |
| 暖沙杏金（默认） | 近白纸感 | 赭石褐 | 长时间阅读，与插画同调 |
| 冷青（原版） | 冷白 | 青蓝 | 喜欢主题改造前那套平面风格 |

第一套是"纸感书页"的语言：圆角卡片、暖调投影、宋体扉页。第二套**冷青**是主题原本的配色，切过去时会一并还原它当初的视觉语言——直角边框、无投影、系统无衬线、标题去掉渐变，只保留本书页式结构（扉页居中、分组竖条、首行缩进）。也就是说原配色不是被染成暖色的旧值，而是完整的一套。

两套配色都各有深色版本，与右上角的明暗切换互相独立。所有色值集中在 `assets/css/00-foundation.css` 开头的 CSS 变量里，改 `--bg`／`--ink`／`--accent` 等即可整体换色；每套配色只需追加一段 `html.theme-<名字>` 变量，把名字加进 `ruri.js` 的 `SCHEMES`，再到 `baseof.html` 顶栏补一枚按钮。

### 阅读字体

正文用读者系统的字体，和 ruri 原本的做法一致：CJK 走系统衬线栈（macOS / iOS 的宋体、Windows 的 SimSun、Linux 的 Noto Serif CJK），西文走 Georgia。**主题不再自带任何字体文件**，页面也就不必为字重付下载成本。

早先版本曾打包一份 1.8 MB 的思源宋体子集（GB 2312，OFL 1.1）。实测下来，子集化后笔画密集的字容易发虚，行距里看着比系统字更"糊"，密度高的文章页显得杂乱，因此连同 `scripts/build-font.py` 一起移除了。需要自托管字体时，在 `assets/css/00-foundation.css` 开头的 `--serif` 变量里把自己的字体名放到最前，并自行补 `@font-face`。

冷青（原版）配色另有自己的字体规则：它沿用主题改造前的系统无衬线字体，切到这套配色时正文会变成无衬线。

主题使用 Hugo 模板、原生 JavaScript、CSS 与少量 SCSS。基础阅读不依赖 JavaScript；搜索、灯箱和播放器等交互需要 JavaScript。刷新或新开标签页不共享正在播放的音频实例。

## 环境要求

- **Hugo Extended ≥ 0.162.1**：编译热力图 SCSS；通过 `hugo version` 检查。
- **Git**：安装与更新主题。
- **Go ≥ 1.22**：仅 Hugo Module 安装需要，同时遵循所用 Hugo 版本的 Go 要求。
- **Node.js / npm**：使用本文的 Pagefind 索引命令需要；Hugo 本身构建主题不需要 npm。
- 开发测试另需 Python 3.11+。当前验证的 Hugo 版本为 0.162.1。

## 安装

两种方式任选其一。以下命令从新站点开始；已有站点跳过创建步骤，并合并配置，避免重复 TOML 表。

### 方式一：Hugo Module

~~~sh
hugo new site my-blog
cd my-blog
git init
hugo mod init example.org/my-blog
~~~

将 `example.org/my-blog` 替换为你自己的站点模块名。在站点 `hugo.toml` 中添加：

~~~toml
[module]
  [[module.imports]]
    path = "github.com/GuZhengSVT/hugo-theme-ruri"
~~~

~~~sh
hugo mod get github.com/GuZhengSVT/hugo-theme-ruri@main
hugo server --disableFastRender
~~~

此方式无需 `themes/ruri` 目录，也无需 `theme = "ruri"`。将站点的 `go.mod` 和生成的 `go.sum` 提交到自己的仓库；CI 中同样需要安装 Go。主题版本由站点模块文件锁定。

### 方式二：Git submodule

~~~sh
hugo new site my-blog
cd my-blog
git init
git submodule add https://github.com/GuZhengSVT/hugo-theme-ruri.git themes/ruri
~~~

在站点 `hugo.toml` 顶层添加（放在任何 `[表]` 之前）：

~~~toml
theme = "ruri"
~~~

~~~sh
hugo server --disableFastRender
~~~

提交站点时一并提交 `.gitmodules` 和主题子模块指针。其他机器或 CI 克隆已有站点时使用：

~~~sh
git clone --recurse-submodules <你的站点仓库地址>
# 如果已经克隆：
git submodule update --init --recursive
~~~

## 快速开始

### 最小配置与第一篇文章

保留所选安装方式的配置，将下面设置合并到站点 `hugo.toml`。顶层键放在所有 TOML 表之前：

~~~toml
baseURL = "https://example.org/"
title = "My Journal"
defaultContentLanguage = "zh-cn"
hasCJKLanguage = true

[outputs]
home = ["HTML", "RSS"]
[markup.highlight]
noClasses = false
[params]
author = "Your Name"
mainSections = ["posts"]
description = "Notes, ideas, and everyday life."
~~~

~~~sh
hugo new content posts/hello.md
hugo server -D --disableFastRender
~~~

编辑生成的文章；正式发布前设置 `draft: false`，并把 `baseURL` 改为正式网址，包含部署子路径和结尾 `/`。

### 完整配置与四语言示例

[exampleSite/config/_default/hugo.toml](exampleSite/config/_default/hugo.toml) 提供 Hugo 配置，[params.yaml](exampleSite/config/_default/params.yaml) 提供带中英文注释的主题参数全集。主题参数可放入站点 `config/_default/params.yaml`，**不加 `params:` 外层**；请将已有 `[params]` 设置迁移或合并，避免重复维护。

Submodule 用户可在新建空站点中执行以下命令运行完整示例；先移除或合并 `hugo new site` 生成的根配置，避免同一设置存在两处：

~~~sh
cp -R themes/ruri/exampleSite/. .
hugo server --disableFastRender
~~~

Module 用户可单独克隆本仓库获取 `exampleSite`，复制其中的 `content`、`data` 和 `config` 到空站点；删除示例配置中的 `theme = "ruri"`，保留自己的 `[module]` 导入与站点模块文件。四语言内容需要配套的 `[languages]` 配置。已有博客请按需合并，不要整目录覆盖自己的内容。

## 使用

<details>
<summary>首页、导航与图片</summary>

以下 YAML 示例均写入 `config/_default/params.yaml`：

~~~yaml
banner: images/banner.webp
avatar: avatar.webp
ruri:
  brandMark: "r."
  tagline: Per aspera ad astra.
  bannerFit: true
  homeEyebrow: NOTE, TECH & POEM
  homeHeading: [A quiet place, for your words.]
  footerText: Made with care.
  favicon: favicon_io/favicon.svg
menu:
  - name: home
    url: /
  - name: archives
    url: /archives/
  - name: friend
    url: /friend/
  - name: moments
    url: /moments/
~~~

`banner` 对应 `static/images/banner.webp`；`avatar` 对应 `static/avatar/avatar.webp`。不配置时不显示对应图片。文章 `cover` 可指定图片路径／URL，`false` 关闭。添加导航后需要创建对应页面。

首页与归档页的封面有两种排法，按屏幕宽度切换：

| 屏宽 | 排法 | 封面尺寸 |
| --- | --- | --- |
| >760px | ruri 那套：图在右、文在左，`object-fit:cover` 裁切 | 190×132（≤1180px 时 172×122） |
| ≤760px | 图在上、文在下 | 满栏宽 × 16:9 |

桌面端用侧边图是因为阅读栏有 860px 宽，16:9 的满栏大图在那里有 478px 高——一屏只剩两条，列表就不再像列表了；侧边小图能留出四五条。手机端只有一栏，图放上面才撑得起版面。两种排法都沿用原来的字号、发丝线与留白，没有卡片边框、阴影或圆角。

封面的来源决定了它能不能被优化：

| `cover` 写法 | 构建期处理 | 卡片拿到什么 |
| --- | --- | --- |
| 站内路径，例如 `images/a.webp` | 生成 420/640/860 三档 WebP 与 `srcset` | 清晰度自适应、尺寸已知，列表不抖动 |
| 远程**固定**文件地址（无查询串） | 同上，下载后转 WebP；跨域抓不到时退回原图 | 同上；抓取失败只留一条 `warnf`，不中断构建 |
| 随机图接口（每次 302 到不同文件） | 跳过，构建期无从下载 | 原图直出，按 `coverRatio` 预留 16:9 的框 |
| `cover: false` 或无 `cover` | 不渲染封面 | 退回纯文字卡片 |

随机图接口没法在构建期取到尺寸，所以卡片会按 16:9 预设宽高，页面加载时不会因为图片陆续到达而抖动（实测三种视口下卡片高度漂移均为 0px）。宽高比偏得远时，在 front matter 里用 `coverRatio` 声明接口实际出图的比例，取值是宽除以高：

~~~yaml
cover: "https://t.alcy.cc/pc"
coverRatio: 1.78   # 接口出 16:9；出 21:9 就写 2.35
~~~

首页前四条卡片以 `loading="eager"` 加 `fetchpriority="high"` 提前取图——这段是首屏，等到滚动才取会看到一片空白——其余保持懒加载。封面链接带 `tabindex="-1"` 与 `aria-hidden="true"`：标题本身就是同一页的链接，一个目标不该占两个 Tab 位。

`ruri.bannerFit` 为 `true` 时大图按原图比例整张铺满（不裁切），适合宽幅插画；为 `false` 时退回旧的 16:7 横带裁切，适合照片。示例站用的是 `true`。

首页首屏有一段入场动画，`ruri.heroMotion: true` 开启（默认开）：

| 动作 | 时长 / 缓动 |
| --- | --- |
| 大图淡入 + 从下方 18px 上浮 | 900ms |
| 上方小字、主标题、出处与「最新文章」逐行跟上，各上浮 16px | 各 600ms，错开 90ms，延迟 180ms 起 |
| 大图持续缓慢漂移（缩放 1 → 1.04 往返） | 18s，停在首屏外时自动暂停 |
| 「最新文章」后的箭头轻微下点 | 2.6s 循环，同样在首屏外暂停 |

淡入等的是图片自己的 `load` 事件，不是页面 `load`——否则会先看到一块空白淡进来，再变成照片；图片已在缓存里（第二次访问）时立即开始。读者系统里开了「减少动态效果」时，整套动画直接失效，内容立即就位。`heroMotion: false` 关掉后连 `hero-rise` 包装都不渲染，标记与旧版一致。

窄屏（≤760px）下顶栏只留三样东西：左侧的菜单按钮、站点名、右侧工具（配色、RSS、搜索、明暗、语言）。菜单项——即上面 `menu` 里的每一项——收进底部抽屉：点左上角的菜单按钮从底部滑出，半透明遮罩压住页面，当前页以强调色加粗并带一条小竖条。抽屉可以点遮罩、点右上角「×」、按 Esc 或点任一菜单项关闭；关闭后焦点回到菜单按钮。抽屉里的菜单与顶栏桌面菜单来自同一份 `menu` 配置，两边永远不会不一致；桌面端（>760px）按钮与抽屉均不渲染，菜单照旧平铺在顶栏。

远程图片会在构建时下载并生成 WebP 多档尺寸。若文章使用的是 CDN 地址而构建时无法抓取，可用 `ruri.images.remoteSources` 把前缀改写到原始地址，文章中的链接不必修改：

~~~yaml
ruri:
  images:
    remoteSources:
      - prefix: https://cdn.jsdelivr.net/gh/your-name/your-media/
        origin: https://raw.githubusercontent.com/your-name/your-media/main/
~~~

主题默认使用太阳系与旅行者 SVG 图标，并附带最高 256×256、包含七档尺寸的 ICO，以及 Apple／Android PNG 图标。可通过 `ruri.favicon` 指定自己的图标路径，设为 `""` 则不输出 favicon 链接。原稿保存在 `design/`。

</details>

<details>
<summary>归档、文艺、关于、友链与说说</summary>

- 归档：创建 `content/archives/_index.md`，front matter 设置 `title: 归档`。自动显示时间树、热力图及分类标签。
- 文艺：创建 `content/culture/index.md`，使用下面的 `culture` 布局，包含书籍、动画、电影、音乐、游戏五个板块。
- 关于：创建 `content/about/index.md`，写入个人介绍。
- 友链：创建 `content/friend/index.md`，使用下面的短代码。
- 说说：创建 `content/moments/index.md`，设置 `comments: true` 并启用 Waline。说说内容由 Waline 评论区承载。**通用演示不配置 Waline 服务，应显示说明文字；接入自己的服务后才能使用。**

独立页面可使用这些布局字段：

~~~yaml
---
title: 关于
compact: true
sidebar: false
contentWidth: narrow
cover: false
comments: false
toc: false
sponsor: false
copyright: false
---
这里写页面正文。
~~~

文艺是可选功能，默认 `culture.enable: false`，关闭时隐藏导航入口并且不加载收藏模块、数据或封面。启用前，将 `exampleSite/content/culture/` 复制到站点 `content/`；目录页与书籍、动画、电影、音乐、游戏各自是独立页面。在站点 `config/_default/params.yaml` 中配置：

~~~yaml
culture:
  enable: true
  categories: [book, anime, movie, music, game] # 可删减、调整顺序
  sources:
    book: neodb
    anime: bangumi
    movie: neodb
    music: neodb
    game: neodb
  bangumi:
    username: your-bangumi-username
    mode: live # live：动画页实时读取；snapshot：构建时同步
  neodb:
    profile: https://neodb.social/users/your-username/
  douban:
    user: your-douban-user-id
    exportFile: "" # 可选，站点内的导出 JSON 路径
~~~

菜单使用 `name: culture_title`、`url: /culture/`；示例放在归档后。分类页面只需 `layout: culture`、`cultureCategory: book`（或 `anime`、`movie`、`music`、`game`）、`sidebar: false`，账号只放在站点参数。未列入 `categories` 的页面也不加载数据。旧 `/watch/` 链接通过示例中的别名跳转。

| 来源 | 支持分类 | 同步方式 |
| --- | --- | --- |
| Bangumi | 动画、书籍、音乐、游戏 | 官方公开 API；动画支持 `live` 和 `snapshot`，其他分类使用 `snapshot` |
| NeoDB | 书籍、电影、音乐、游戏 | 匿名公开书架，完整分页；无需 Token |
| 豆瓣 | 书籍、电影、音乐、游戏 | 公开收藏页，或本地 JSON 导出；个人五星评分统一转换到十分制 |

例如，设置 `culture.sources.movie: douban` 后，电影页及构建脚本自动使用豆瓣账号，其他分类保持各自来源。豆瓣影视收藏可能包含剧集；Bangumi 的三次元条目不直接当作电影，NeoDB 的全部剧集也不直接当作动画。

在博客根目录运行（需要 Hugo Extended、Python 3 和 curl）：

~~~sh
python3 themes/ruri/scripts/sync-culture.py
hugo --gc --minify
npx -y pagefind@1.4.0 --site public --glob '**/*.html'
~~~

同步脚本读取 Hugo 的有效配置，只处理启用的来源／分类。上游暂不可用或要求登录时保留上一份有效快照；首次同步失败显示“暂不可用”，不会伪装成空收藏，也不会阻止其余分类构建。GitHub Actions 可缓存 `static/collections/` 以保留最近快照；首次成功生成的快照也可提交到博客仓库。同步不自动提交源码，不归档每日副本；收藏内容未变时保持 JSON 与同步时间不变。

客户端保持“入口 → 分类 → 状态／页码”分层加载：入口不请求收藏资源，每次只读取当前分类和状态的 24 条数据；翻页才创建新一页封面元素，并保留浏览器懒加载。封面仍来自原平台。Bangumi 实时模式在当前标签页缓存 10 分钟，“刷新”跳过当前页缓存；构建快照模式通过本站 JSON 展示评分、短评和动画进度。

豆瓣可能限制公开访问。可将 `culture.douban.exportFile` 指向本地 JSON，避免构建时抓取；支持 [douban-books-movies-music-exporter](https://github.com/BrainEno/douban-books-movies-music-exporter) 的原始 JSON 数组，也支持下面的统一格式（`rating` 为十分制；`community_rating`、`cover`、`subtitle`、`comment` 可省略；必须包含配置给豆瓣的全部分类）：

~~~json
{"categories":{"movie":[{"id":"123","title":"示例电影","url":"https://movie.douban.com/subject/123/","status":"complete","rating":8,"cover":"https://example.org/poster.jpg","comment":"我的短评"}]}}
~~~

`status` 使用 `wishlist`、`progress`、`complete`、`dropped`。公开页解析遇到登录／验证码会报告同步失败，不处理登录凭据。NeoDB、豆瓣页面结构变化时可能需要更新解析器。公开主题示例不包含个人账号、收藏或服务配置。

友链分类仍分别读取 `data/friends1.yml` 至 `data/friends4.yml`；共享渲染模板不会合并数据或改变分类。每份数据使用数组：

~~~yaml
- name: Example
  url: https://example.org/
  desc: A friend's blog
  image: images/friend.webp
~~~

在页面中按需要排列分类标题和短代码：

~~~text
## 博客
{{< friendsLink1 >}}
## 工具
{{< friendsLink2 >}}
~~~

另外两组使用 `friendsLink3`、`friendsLink4`；本地图片放在 `static/images/`。

友链默认按数据文件顺序显示。在站点的 `config/_default/params.yaml` 中启用以下选项，即可在每次刷新或通过站内导航进入页面时，将四组友链各自独立随机排序，分类顺序保持不变。设为 `false` 或省略则使用固定顺序；随机结果偶尔可能与上次相同。

~~~yaml
ruri:
  friendsShuffle: true
~~~

</details>

<details>
<summary>代码、图片、公式与图表</summary>

带语言标记的 Markdown 代码块自动显示语言栏和复制／折叠按钮；保持 `markup.highlight.noClasses = false` 以适配深浅色。正文图片支持本地 PhotoSwipe 灯箱。

横幅、分类封面、文章封面、正文图片与头像会在构建时生成 WebP 多档尺寸，通过 `srcset` 按显示宽度和像素密度选择；点开放大时才加载原图。文章未填写 `description` 时，卡片、页面描述和分享链接会自动截取正文开头约 80 个字。

远程图片的原图副本及生成的各尺寸版本统一发布到 `ruri-media/remote/`，不会散落在站点根目录。

远程图片需要可抓取且带图片扩展名（`.jpg`／`.jpeg`／`.png`／`.webp`／`.tif`／`.tiff`／`.bmp`）才会处理；带查询参数的动态图片接口、GIF 与 SVG 保持原地址。

构建会下载并转换图片，建议在 CI 中缓存 `resources/_gen` 与 `resources/_remote`，并在站点配置中放宽超时：

~~~toml
timeout = '120s'

[caches.getresource]
dir = ':resourceDir/_remote'
maxAge = '24h'
~~~

KaTeX 需要在主题参数中设置 `math.katex.enable: true`、文章 front matter 设置 `math: true`，并启用 Hugo Goldmark 的公式透传。完整透传配置见示例 `hugo.toml`。Mermaid 代码块会自动加载图表脚本，也可设置文章 `mermaid: true`。KaTeX 和 Mermaid 使用 CDN 资源。

</details>

<details>
<summary>Waline、文章统计与页脚统计</summary>

~~~yaml
waline:
  enable: true
  serverURL: https://your-waline.example.org
  pageview: true
footer:
  powered: true
  count: true
~~~

替换占位地址为自己的 Waline 服务。文章 `comments: false` 可关闭评论区。阅读数、评论数和热门文章需要真实服务数据；页脚字数与阅读时长由 Hugo 根据当前语言文章计算，不依赖 Waline。其他 Waline 选项见参数全集。

</details>

<details>
<summary>文章版权优先级</summary>

站点参数提供默认值：

~~~yaml
article_copyright:
  enable: true
  content:
    author: true
    title: true
    link: true
    date: true
    updated: true
    license: true
    license_type: by-nc-sa
~~~

文章 front matter 的 `author`、`license`／`license_type` 以及 `article_copyright` 配置优先；缺失字段回退到站点参数。例如：

~~~yaml
author: Another Author
license: by-sa
article_copyright:
  content:
    updated: false
~~~

`copyright: false` 或 `article_copyright.enable: false` 关闭整块版权信息；`article_copyright.content` 中的字段可用 `false` 单独关闭。

</details>

<details>
<summary>微信分享、个人二维码与打赏</summary>

~~~yaml
share: [weixin, twitter]
social:
  - name: weixin
    url: images/wechat-qr.webp
  - name: qq
    url: images/qq-qr.webp
sponsor:
  enable: true
  qr:
    - name: Donate
      src: images/donate.webp
~~~

微信分享生成当前文章地址的二维码；个人二维码读取你放在 `static/images/` 中的图片，通过侧栏链接弹窗显示。文章 `sponsor: false` 可隐藏打赏。

</details>

<details>
<summary>音乐播放器</summary>

~~~yaml
player:
  enable: true
  audio:
    - name: Example track
      artist: Example artist
      url: https://example.org/audio/song.mp3
      cover: https://example.org/images/cover.webp
      lrc: https://example.org/audio/song.lrc
      tlyric: https://example.org/audio/song-translated.lrc
~~~

所有 URL 均为占位符。直接歌单优先于 Meting；不配置有效歌单时不请求音源，不自动播放。歌词支持 LRC 与译文。Meting 的 `player.meting.meting_api` 和 `player.meting.options` 用法见参数全集；接口需支持对应的服务与资源类型。

站内局部导航保留播放实例；音源可用性及跨域权限由音频服务决定。播放顺序、音量和歌词显示通过播放器按钮及本地存储管理。

</details>

## 构建、搜索与部署

~~~sh
hugo --minify
npx -y pagefind@1.4.0 --site public --glob '**/*.html'
~~~

按此顺序执行，然后部署整个 `public/`，包括 `public/pagefind/`。Pagefind 基于构建后的 HTML 索引，不使用旧的 `index.json`。`hugo server` 不自动生成索引；检验搜索时可预览完整产物：

~~~sh
python3 -m http.server 8080 --directory public
~~~

打开 `http://localhost:8080/`。如正式站点部署在子路径，应使用匹配的本地路径或为本地预览单独指定 `baseURL` 后重新构建及索引。

### 本仓库的两个部署

主题仓库只负责「主题 + 演示站」，个人博客部署在另一个仓库，两者互不影响：

| 仓库 | 部署到 | 内容 | 工作流 |
| --- | --- | --- | --- |
| `sasaOrange-blog-hugo`（本仓库） | [Cloudflare Pages](https://sasaorange-blog-hugo-demo.pages.dev/)（项目 `sasaorange-blog-hugo-demo`） | `exampleSite/` 的通用示例 | `deploy-demo.yml` |
| `sasaOrange-blog-hugo-personalsite` | Cloudflare Pages（项目 `sasaorange-blog-hugo-personalsite`） | 真实文章与个人配置 | 站点仓库的 `deploy.yml` |

演示站用 `--themesDir themes` 把仓库根目录挂成 `themes/ruri` 再构建 `exampleSite`，所以 `exampleSite` 始终是一份可以整目录复制走的独立站点。它的 `baseURL` 是 Cloudflare 项目的根域名（`https://sasaorange-blog-hugo-demo.pages.dev/`，不带子路径），换域名或部署到子路径时要改掉。

演示站的分支规则与站点仓库一致：`main` 发生产环境，PR 发 `<分支名>.sasaorange-blog-hugo-demo.pages.dev` 预览环境并把地址回帖到 PR。预览和生产是 Cloudflare 上两条独立的分支部署，互不覆盖。`*.pages.dev` 是公开域名，预览靠 Cloudflare Access 保护——那部分在 Zero Trust 面板里配，工作流只负责部署，需要 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID` 两个密钥。

本仓库不再使用 GitHub Pages：一个仓库只有一条 Pages 发布通道，预览和正式站无法并存，而 PR 分支也受 `github-pages` 环境的部署分支策略限制。

个人站点通过 git submodule 引用本仓库。本仓库有提交后，`bump-site.yml` 会把站点的 submodule 指针推到该提交，站点随即重新构建；这需要一个能写站点仓库的 `SITE_PUSH_TOKEN` 密钥。

## 更新与迁移

Hugo Module：

~~~sh
hugo mod get github.com/GuZhengSVT/hugo-theme-ruri@main
hugo mod tidy
~~~

将变更后的站点模块文件提交到自己的仓库。

Git submodule：

~~~sh
git submodule update --remote themes/ruri
git add themes/ruri
git commit -m "chore: update theme"
~~~

更新前阅读 [CHANGELOG.md](CHANGELOG.md)。个人配置、内容与覆盖模板应保存在站点仓库。Reimu 用户请逐项迁移：Ruri 不支持 Reimu 的所有配置和插件，已删除的旧字段见 [参数文件末尾](exampleSite/config/_default/params.yaml)。主题资源变动后完整刷新浏览器。

## 开发与测试

样式按 `assets/css/` 中文件名的顺序由 `baseof.html` 拼接，最终仍是一个带指纹的请求。后面的文件会覆盖前面的同名规则，这是现有视觉设计的一部分；调整顺序、合并规则或删除“重复”声明前，必须检查所有页面。新增样式应放进语义对应的文件，避免在文件末尾继续追加整页覆盖层。

在主题仓库根目录运行：

~~~sh
python3 tests/smoke.py
python3 tests/module-build.py
python3 tests/features-build.py
python3 tests/media-build.py
node --check assets/ruri.js
node --check assets/features.js
node tests/lyrics.cjs
~~~

覆盖最小站点、四语言示例、子路径、Module 导入、站内链接、版权优先级、自动摘要、图片处理与歌词；不替代第三方服务或完整视觉验收。参见 [QA_REPORT.md](QA_REPORT.md) 与 [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)。

## 致谢与许可

sasaOrange 的设计源自两代主题：

- [hugo-theme-ruri](https://github.com/GuZhengSVT/hugo-theme-ruri)（作者 GuZhengSVT）：页面结构、播放器、站内导航与中文排版方案来自这里。
- [hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu)（作者 D-Sketon）：写作热力图、部分翻译、渲染 hooks、短代码、RSS 与分享等实现，经由 ruri 继承或参考 Reimu。

sasaOrange 是独立主题，不代表上述任何一方的官方版本。

代码采用 [MIT License](LICENSE)，继承代码保留 [Reimu 原作者许可](LICENSE.reimu)，第三方资源保留各自许可。个人文章、图片、音乐、友链数据和第三方服务不包含在主题授权范围内。
