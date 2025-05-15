import { VidSolvForm } from '@/components/VidSolvForm';
import { Lightbulb } from 'lucide-react'; // Example icon

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 selection:bg-primary/20 selection:text-primary">
      <header className="my-8 md:my-12 text-center">
        <div className="flex items-center justify-center mb-3">
          <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-extrabold ml-3 text-shadow dark:text-shadow-dark bg-clip-text text-transparent bg-gradient-to-r from-primary to-[hsl(var(--primary-gradient-end))]">
            VidSolv
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground">
          Type your problem. Get your solution.
        </p>
      </header>

      <main className="w-full max-w-xl md:max-w-2xl px-2">
        <VidSolvForm />
      </main>

      <footer className="mt-12 mb-6 text-center text-sm text-muted-foreground">
        <p>Know the problem. We know what to search.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} VidSolv. All rights reserved.</p>
      </footer>
    </div>
  );
}
