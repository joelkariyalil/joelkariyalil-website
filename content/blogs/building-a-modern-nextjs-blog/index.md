---
title: "Building a Modern Next.js Blog with MDX and Tailwind"
date: "2024-03-15"
coverImage: "./assets/cover.jpg"
excerpt: "A comprehensive guide on building a modern blog using Next.js, MDX, and Tailwind CSS, with features like dark mode and syntax highlighting."
isFeatured: false
showTags: true
techStack: ["Next.js", "MDX", "Tailwind CSS", "TypeScript"]
---

# Building a Modern Next.js Blog

In this post, I'll walk you through the process of building a modern blog using Next.js, MDX, and Tailwind CSS. We'll cover everything from setting up the project to implementing advanced features like dark mode and syntax highlighting.

## Demo

Here's a quick demo of the blog features we'll be building:

<video 
  className="w-full rounded-lg shadow-lg my-8" 
  controls 
  preload="none"
  poster="./assets/demo-poster.jpg"
>
  <source src="./assets/blog-demo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Project Setup

First, let's create a new Next.js project with TypeScript and Tailwind CSS:

```bash
npx create-next-app@latest my-blog --typescript --tailwind
cd my-blog
```

## Adding MDX Support

MDX allows us to use React components in our markdown files. Here's how to set it up:

```typescript
// next.config.mjs
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/
})

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
})
```

## Implementing Dark Mode

Adding dark mode support is straightforward with Tailwind:

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...rest of config
}
```

## Adding Syntax Highlighting

For code blocks, we'll use Prism.js with a custom theme:

```typescript
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const CodeBlock = ({ language, children }) => {
  return (
    <SyntaxHighlighter language={language} style={nightOwl}>
      {children}
    </SyntaxHighlighter>
  )
}
```

## Feature Walkthrough

Here's a more detailed look at some of the key features:

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
  <video 
    className="rounded-lg shadow-lg" 
    autoPlay 
    loop 
    muted 
    playsinline
  >
    <source src="./assets/dark-mode-demo.mp4" type="video/mp4" />
  </video>
  <video 
    className="rounded-lg shadow-lg" 
    autoPlay 
    loop 
    muted 
    playsinline
  >
    <source src="./assets/syntax-highlight-demo.mp4" type="video/mp4" />
  </video>
</div>

## Conclusion

Building a modern blog with Next.js is a great way to learn about full-stack development while creating something useful. The combination of Next.js, MDX, and Tailwind CSS provides a powerful foundation for creating beautiful, performant content. 