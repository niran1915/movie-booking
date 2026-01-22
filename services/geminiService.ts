
import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getMovieInsight(movie: Movie): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a unique, one-sentence "AI Critic" insight about a movie titled "${movie.title}" with the following description: ${movie.description}. Make it sound sophisticated and intriguing.`,
        config: {
          temperature: 0.7,
        },
      });
      return response.text || "A cinematic journey worth experiencing.";
    } catch (error) {
      console.error("Gemini insight error:", error);
      return "An unmissable cinematic event of the season.";
    }
  }

  async getChatResponse(history: {role: string, content: string}[], message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: "You are CineBot, a helpful movie booking assistant. Help users find movies, explain genres, and be enthusiastic about cinema. Keep responses concise and friendly." }] },
          ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      });
      return response.text || "I'm here to help you find the perfect movie!";
    } catch (error) {
      console.error("Gemini chat error:", error);
      return "I'm having a little trouble connecting to my film archives. How else can I help you today?";
    }
  }

  async getRecommendations(preferences: string): Promise<string[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on these preferences: "${preferences}", recommend 3 movie genres from this list: Action, Sci-Fi, Drama, Comedy, Horror, Adventure, Fantasy. Return ONLY the genre names separated by commas.`,
        config: {
          temperature: 0.5,
        },
      });
      return response.text?.split(',').map(s => s.trim()) || ['Drama'];
    } catch (error) {
      return ['Action', 'Sci-Fi'];
    }
  }
}

export const gemini = new GeminiService();
