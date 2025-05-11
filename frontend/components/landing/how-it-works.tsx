import { motion } from "framer-motion";

export function HowItWorks() {
  return (
    <section className="py-20 border-t border-border/60">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-4 font-serif font-bold text-4xl">How it works</h2>
        <h3 className="text-center mb-20 text-muted-foreground font-sans">Simple steps to your AI video</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-muted-foreground text-primary mb-6">1</div>
            <h4 className="text-2xl font-semibold mb-4 font-serif">Enter your prompt</h4>
            <p className="text-muted-foreground">
              Describe your video script or simply enter a prompt.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-muted-foreground text-primary mb-6">2</div>
            <h4 className="text-2xl font-semibold mb-4 font-serif">Configure and generate</h4>
            <p className="text-muted-foreground">
              Select your preferred style, font, voice and bg-music. Click generate to start the AI creation process.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl font-bold text-muted-foreground text-primary mb-6">3</div>
            <h4 className="text-2xl font-semibold mb-4 font-serif">Get your video</h4>
            <p className="text-muted-foreground">
              In just a few minutes, your AI-generated video will be ready for download and use it anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
