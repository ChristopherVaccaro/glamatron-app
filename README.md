# StyleMirror AI

AI-powered style transformation app that lets you visualize different looks on your photos. Upload a selfie and customize hair styles, makeup, accessories, and expressions using Google's Gemini AI.

![StyleMirror AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)

## Features

- **Hair Styling** - Change hair style, length, and color
- **Makeup** - Apply different makeup looks, eye makeup, and lip colors
- **Accessories** - Add glasses, piercings, headwear, jewelry, and more
- **Expressions** - Transform facial expressions
- **Surprise Me** - Random style generation for inspiration
- **Side-by-side Comparison** - Compare original and transformed images
- **Download** - Save your transformed images

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Image generation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/style-mirror-app.git
   cd style-mirror-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `GEMINI_API_KEY` environment variable in Vercel's project settings
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## License

MIT
