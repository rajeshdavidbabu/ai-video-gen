# AI Shorts Pro

<div align="center">
  <img src="frontend/public/logo/logo.svg" alt="AI Shorts Pro Logo" width="150">
  <h3>Turn your scripts into engaging videos with AI</h3>
</div>

AI Shorts Pro is an open-source platform that transforms ideas or scripts into complete videos through AI-powered generation. The system creates scripts, adds professional voiceovers, and generates captivating visuals - all from a simple prompt.

<div align="center">
  <img src="frontend/public/logo/demo.gif" alt="AI Shorts Pro Demo" width="600">
</div>

## Architecture
<img width="1113" alt="Screenshot 2025-05-12 at 11 57 50" src="https://github.com/user-attachments/assets/b99b4ce2-d42a-4033-b9d2-c964f10ae25c" />



## 🚀 Features

- **Script Generation**: Create engaging scripts from simple prompts or refine your own
- **AI Voiceover**: Generate natural-sounding voiceovers for your scripts
- **Image Generation**: Create stunning visuals to accompany your narration
- **Video Assembly**: Combine voiceovers, images, and effects into a cohesive video
- **User Management**: Secure authentication and user dashboard
- **Video Library**: Store and manage your generated content

## 🏗️ Architecture

The project consists of three main components:

### 1. Frontend (`/frontend`)

A Next.js application that provides the user interface, authentication, and user dashboard. Built with:
- Next.js 14 (App Router)
- Tailwind CSS for styling
- Prisma for database interactions
- NextAuth for authentication
- Shadcn UI components
- Framer Motion for animations

### 2. Backend Queue (`/backend-queue`) 

A Node.js service that handles:
- Processing queue for video generation tasks
- Script generation with AI models
- Integration with image generation services
- Content management and orchestration
- Communication with the renderer service

### 3. Renderer (`/renderer`)

A Remotion-based video rendering service that:
- Assembles images, audio, and effects into final videos
- Handles video composition and timing
- Manages different output formats and quality settings
- Provides API endpoints for the backend-queue to request renders

## 📝 How It Works

1. **User Initiates Creation**: Through the frontend, users provide a prompt or script
2. **Script Generation**: The backend generates or refines a script using AI
3. **Asset Generation**: The system creates required assets (images, voiceovers)
4. **Rendering**: The renderer assembles these assets into a final video
5. **Delivery**: The completed video is made available to the user

## 🔧 Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Rendering**: Remotion (React-based video rendering)
- **AI Services**: OpenAI API, Midjourney (via API), Elevenlabs
- **Infrastructure**: Docker, serverless deployment options

## 🌐 API Integrations

- **OpenAI**: For script generation and refinement
- **Midjourney**: For image generation
- **ElevenLabs**: For high-quality voice synthesis
- **AWS S3**: For asset storage

## 🛠️ Self-Hosting

Self-hosting instructions will be coming soon. The application is designed to be deployed as a set of services that can run on your own infrastructure.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Rajesh David Babu](https://rajeshdavidbabu.com)
