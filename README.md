# PRINCE.OS

A terminal-first, static personal portfolio built with Next.js, TypeScript, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Edit portfolio content in `/data`. The UI reads those files through `lib/portfolio.ts`; do not put portfolio facts directly into components.

## Resume

Place the resume at `public/resume.pdf`. The resume command deliberately points there and does not invent a resume.

## Deployment

The project uses `output: "export"` for GitHub Pages. The build explicitly uses webpack for reliable static builds in constrained CI environments. Push to `main` and enable **GitHub Actions** as the repository Pages source.

