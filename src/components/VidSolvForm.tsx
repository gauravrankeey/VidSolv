'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, Youtube, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateYoutubeQuery, type GenerateYoutubeQueryInput, type GenerateYoutubeQueryOutput } from '@/ai/flows/generate-youtube-query';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  problemDescription: z.string().min(10, { message: 'Please describe your problem in at least 10 characters.' }).max(300, {message: 'Problem description is too long (max 300 characters).'}),
});

type FormValues = z.infer<typeof formSchema>;

const sampleProblems: string[] = [
  "My Instagram is not growing",
  "I can’t focus on my studies",
  "I want to lose belly fat quickly",
  "How to learn coding for free",
  "Fixing a leaky faucet at home"
];

export function VidSolvForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<GenerateYoutubeQueryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      const inputData: GenerateYoutubeQueryInput = { problemDescription: data.problemDescription };
      const result = await generateYoutubeQuery(inputData);
      if (result && result.youtubeQuery) {
        setSearchResult(result);
      } else {
        setError('Could not generate a YouTube query. Please try rephrasing your problem.');
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleProblemClick = (problem: string) => {
    setValue('problemDescription', problem, { shouldValidate: true });
    setSearchResult(null); // Clear previous results when a sample is clicked
    setError(null);
  };
  
  const handleReset = () => {
    reset();
    setSearchResult(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl text-center">What's bothering you today?</CardTitle>
          <CardDescription className="text-center">
            Describe your problem, and we'll find a YouTube video to help you out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register('problemDescription')}
                placeholder="e.g., I want to learn how to bake a cake"
                className={cn(
                  "h-12 text-lg input-pulsating-border",
                  errors.problemDescription ? '!border-destructive' : '!border-primary'
                )}
                disabled={isLoading}
                aria-label="Problem description input"
              />
              {errors.problemDescription && (
                <p className="text-sm text-destructive mt-1">{errors.problemDescription.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Solve it!
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center pt-4">
            <p className="text-sm text-muted-foreground mb-2">Or try one of these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleProblems.map((problem) => (
                <Button
                  key={problem}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleSampleProblemClick(problem)}
                  disabled={isLoading}
                >
                  {problem}
                </Button>
              ))}
            </div>
          </CardFooter>
      </Card>

      {error && !isLoading && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
           <Button variant="outline" size="sm" onClick={handleReset} className="mt-2">
            Try Again
          </Button>
        </Alert>
      )}

      {searchResult && !isLoading && (
        <Card className="text-center shadow-xl animate-in fade-in-50 duration-500">
          <CardHeader>
            <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-2 w-fit mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">We found something helpful for you!</CardTitle>
            <CardDescription>
              Based on your problem, we think this search query might help: <br/>
              <strong className="text-primary">&quot;{searchResult.youtubeQuery}&quot;</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchResult.youtubeQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-button inline-flex items-center justify-center w-full md:w-auto text-lg"
              aria-label={`Watch videos on YouTube for: ${searchResult.youtubeQuery}`}
            >
              <Youtube className="mr-2 h-6 w-6" />
              Watch on YouTube
            </a>
          </CardContent>
           <CardFooter className="justify-center">
            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-primary">
              Search for another problem
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
