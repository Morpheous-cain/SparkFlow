'use server';
/**
 * @fileOverview An AI-powered insights tool for managers to analyze operational data.
 *
 * - getManagerOperationalInsights - A function that handles the generation of operational insights.
 * - ManagerOperationalInsightsInput - The input type for the getManagerOperationalInsights function.
 * - ManagerOperationalInsightsOutput - The return type for the getManagerOperationalInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ManagerOperationalInsightsInputSchema = z.object({
  staffPerformanceData: z
    .string()
    .describe(
      'JSON string representing staff performance metrics, e.g., [{\"name\": \"John Doe\", \"carsCleaned\": 50, \"commission\": 200, \"tips\": 50}]'
    ),
  serviceDurationData: z
    .string()
    .describe(
      'JSON string representing service duration data, e.g., [{\"serviceName\": \"Basic Wash\", \"avgDurationMinutes\": 15, \"totalServices\": 100}]'
    ),
  transactionPatternData: z
    .string()
    .describe(
      'JSON string representing transaction patterns, e.g., [{\"date\": \"2023-10-26\", \"totalRevenue\": 1500, \"carsCleaned\": 30}]'
    ),
});
export type ManagerOperationalInsightsInput = z.infer<
  typeof ManagerOperationalInsightsInputSchema
>;

const ManagerOperationalInsightsOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe('A concise summary of the overall operational performance.'),
  identifiedTrends: z
    .array(z.string())
    .describe('An array of key trends, anomalies, and insights identified.'),
  recommendations: z
    .array(z.string())
    .describe('An array of recommendations based on the identified insights.'),
});
export type ManagerOperationalInsightsOutput = z.infer<
  typeof ManagerOperationalInsightsOutputSchema
>;

export async function getManagerOperationalInsights(
  input: ManagerOperationalInsightsInput
): Promise<ManagerOperationalInsightsOutput> {
  return managerOperationalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'managerOperationalInsightsPrompt',
  input: { schema: ManagerOperationalInsightsInputSchema },
  output: { schema: ManagerOperationalInsightsOutputSchema },
  prompt: `You are an expert business analyst specializing in car wash operations. Your task is to analyze the provided operational data and generate a concise summary, identify key trends, and provide actionable recommendations.

Operational Data:
Staff Performance Data: {{{staffPerformanceData}}}
Service Duration Data: {{{serviceDurationData}}}
Transaction Pattern Data: {{{transactionPatternData}}}

Carefully analyze the data to:
1. Provide an overall summary of the operational performance.
2. Identify significant trends, anomalies, and insights related to staff efficiency, service turnaround times, and revenue patterns.
3. Offer concrete recommendations to optimize operations, improve profitability, and enhance service efficiency.

Format your response as a JSON object with the following structure:
{
  "overallSummary": "[your concise summary]",
  "identifiedTrends": ["[trend 1]", "[trend 2]"],
  "recommendations": ["[recommendation 1]", "[recommendation 2]"]
}`,
});

const managerOperationalInsightsFlow = ai.defineFlow(
  {
    name: 'managerOperationalInsightsFlow',
    inputSchema: ManagerOperationalInsightsInputSchema,
    outputSchema: ManagerOperationalInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
