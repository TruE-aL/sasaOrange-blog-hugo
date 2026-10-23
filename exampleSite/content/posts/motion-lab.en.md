---
title: "Motion lab: a page that wakes up slowly"
date: 2026-10-23T10:30:00+08:00
lastmod: 2026-10-23T10:30:00+08:00
tags: [Motion, Design, sasaOrange]
categories: [thoughts]
description: "A local demo for checking the paper veil, article entrance, image resolve, shortcodes and reading rhythm."
cover: false
---

## Why this page exists

This is not an article that needs to be read carefully. It is a small laboratory. It gathers this round of Reimu-inspired motion on one page: the title arrives in layers, paragraphs follow the reader down the page, images resolve out of a slight blur, and the closing components keep their own rhythm.

> Good motion does not keep the page moving. It gives a change a clear beginning, middle, and end.

## Three reading speeds

{{< tabs >}}
<!-- tab: Slow -->
The "slow" part of motion is not delay. The title takes about **0.7 seconds** to emerge from behind the paper, and the first paragraph follows a little later. That is enough time for the eye to confirm it has arrived, without making the reader wait.

<!-- tab: Normal -->
Elements in ordinary scrolling enter from about **30px** below. That is lighter than the original Reimu distance, so every paragraph in a long article does not feel like a lift ride.

<!-- tab: Fast -->
Hover, button, and tag feedback stays between **0.2 and 0.4 seconds**. The smaller the element, the faster it should answer.
{{< /tabs >}}

## Images wake up on their own

Below is the local illustration for the story category. When it enters the viewport it begins slightly blurred, then comes into focus. The image has not changed; only the moment at which it is seen has.

![Local illustration for the story category](/images/categories/story.webp)

## A sentence kept out of sight

Some sentences are better kept until the reader comes closer:

{{< spoiler >}}This is the spoiler demo. Hover over it, or focus it with the keyboard, and it resolves out of the blur.{{< /spoiler >}}

There is more content after this paragraph. As you scroll down, headings, quotations, and code blocks arrive in their own places instead of the whole article appearing like a poster that was already pasted up.

### Code has its own pause

```javascript
const reading = {
  pace: "slow enough to notice",
  motion: "only when it means something",
  home: "sasaOrange",
};

export default reading;
```

## Let the tags turn

{{< tagRoulette tags="Story,Ideas,Reading,Design,sasaOrange,Today is not tomorrow" >}}

## A small table

| Motion | Where it appears | What it does |
|---|---|---|
| Paper veil | In-page navigation | Hides the page swap |
| Layered entrance | First article screen | Establishes reading order |
| Blur resolve | Images | Removes the sudden cut |
| Reading relay | Article body | Gives a long text room to breathe |

## One last sentence

Today is not tomorrow, and it is not yesterday either. A page should be a little different each time it is reached.
