// src/ai/flows/generate-youtube-query.ts
'use server';
/**
 * @fileOverview A natural language to YouTube query generator.
 *
 * - generateYoutubeQuery - A function that takes a natural language problem description and returns a YouTube search query.
 * - GenerateYoutubeQueryInput - The input type for the generateYoutubeQuery function.
 * - GenerateYoutubeQueryOutput - The return type for the generateYoutubeQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeQueryInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A natural language description of the user\u2019s problem.'),
});
export type GenerateYoutubeQueryInput = z.infer<typeof GenerateYoutubeQueryInputSchema>;

const GenerateYoutubeQueryOutputSchema = z.object({
  youtubeQuery: z
    .string()
    .describe('A YouTube-searchable query keyword or phrase generated from the problem description.'),
});
export type GenerateYoutubeQueryOutput = z.infer<typeof GenerateYoutubeQueryOutputSchema>;

export async function generateYoutubeQuery(
  input: GenerateYoutubeQueryInput
): Promise<GenerateYoutubeQueryOutput> {
  return generateYoutubeQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYoutubeQueryPrompt',
  input: {schema: GenerateYoutubeQueryInputSchema},
  output: {schema: GenerateYoutubeQueryOutputSchema},
  prompt: `You are an AI assistant that helps users find solutions to their problems on YouTube.

You will receive a description of the user's problem in natural language.
Your task is to generate a search-friendly keyword or phrase that can be used to find relevant videos on YouTube.

Problem Description: {{{problemDescription}}}

YouTube Query:`,
});

const generateYoutubeQueryFlow = ai.defineFlow(
  {
    name: 'generateYoutubeQueryFlow',
    inputSchema: GenerateYoutubeQueryInputSchema,
    outputSchema: GenerateYoutubeQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
