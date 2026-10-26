# ImgEnPr0Xiii

A powerful, web‑based image generator built with Next.js, leveraging the best features of popular open‑source Stable Diffusion UIs.

## Features
- Prompt editor with syntax highlighting
- Text‑to‑image, img2img, and inpainting via a unified API
- Support for LoRA, ControlNet, and custom samplers
- Gallery with download & metadata storage (SQLite/JSON)
- Extensible plugin system (similar to AUTOMATIC1111)
- Deployed on Vercel (serverless API routes)

## Getting Started
```bash
# Clone the scaffold (or push to your own repo)
git clone <YOUR_REPO_URL>
cd ImgEnPr0Xiii
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Deploy to Vercel with `vercel`.

## Architecture
- **frontend** – Next.js React components (`components/`)
- **backend** – API routes (`pages/api/`) that call the HuggingFace Diffusers library via a Python serverless function (via Vercel’s Python runtime) or an external inference API.
- **storage** – Simple SQLite DB (`db/`) for saved images & metadata.

## License
MIT
