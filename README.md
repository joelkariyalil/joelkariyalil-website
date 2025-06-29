# Joel Kariyalil's Personal Website

A modern, minimal personal website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 🎨 Styled with Tailwind CSS
- 📝 Markdown-based blog system
- 📱 Fully responsive design
- 🔍 SEO optimized

## Blog System

The blog system is powered by MDX and includes:

### Enhanced Markdown Support
- GitHub-flavored markdown (tables, strikethrough, etc.)
- Automatic heading links
- Code block titles and syntax highlighting
- Table of contents generation

### Content Features
- Reading time estimation
- Responsive table of contents
- Active heading tracking while scrolling
- Better typography and spacing

### How to Add Blog Posts

1. Create a new `.md` file in `content/blogs`
2. Add frontmatter metadata:
   ```md
   ---
   title: "Your Blog Post Title"
   date: "2024-03-01"
   coverImage: "/path/to/image.jpg"
   excerpt: "Optional excerpt. If not provided, one will be generated."
   ---
   ```
3. Write your content using markdown

### Markdown Features

```md
# Headings
## Support up to 6 levels

**Bold text** and *italic text*

[Links](https://example.com)

Lists:
- Item 1
- Item 2
  - Nested item

Code blocks with titles:
```tsx title="components/Example.tsx"
function Example() {
  return <div>Hello World</div>;
}
```

Tables:
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

Task Lists:
- [x] Completed task
- [ ] Pending task
```

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/joelkariyalil/joelkariyalil-website.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## Project Structure

```
├── content/
│   └── blogs/          # Blog post markdown files
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── pages/         # Next.js pages
│   └── styles/        # Global styles
└── package.json
```

## License

MIT License
