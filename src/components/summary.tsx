// components/summary.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import OpenAIApi from "openai";
import createCompletion from "openai";
import Configuration from "openai";


export default function Summary() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const openai = configuration;
  
  const processQueryWithGPT4 = async (naturalQuery: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant. Translate English questions to arXiv search queries." },
          { "role": "user", "content": naturalQuery }
        ]
      });
  
      const assistantResponse = completion.choices[0].message.content;
      return assistantResponse ? assistantResponse.trim(): '';
    } catch (error) {
      console.error('Error processing query with GPT-4:', error);
      return '';
    }
  };

  const searchPapers = async (processedQuery: string) => {
    try {
      const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${processedQuery}&start=0&max_results=10`);
      // Assuming the response is in the correct format; adjust based on actual API response
      setPapers(response.data.feed.entry);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const processedQuery = await processQueryWithGPT4(query);
    if (processedQuery) {
      await searchPapers(processedQuery);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50">
      <header className="px-6 bg-white border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-semibold">AI Summaries</div>
          <nav>
            <ul className="flex space-x-4 text-sm font-medium">
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="#">
                  About
                </a>
              </li>
              {/* <li>
                <a className="text-gray-600 hover:text-gray-800" href="#">
                  Contact
                </a>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>
      <main className="p-6">
        <div className="max-w-lg mx-auto">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Enter your query in natural language"
            className="border rounded p-2 w-full mb-4"
          />
          <button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {papers.map((paper: any) => (
          <article key={paper.id} className="bg-white rounded-lg shadow-sm overflow-hidden m-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 hover:scale-105">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{paper.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Authors: {paper.author ? paper.author.join(', ') : 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-3">{paper.summary}</p>
              <a className="text-sm text-blue-500 hover:underline mt-2 inline-block" href={`https://arxiv.org/abs/${paper.id}`}>
                View Full Paper
              </a>
            </div>
          </article>
        ))}
      </main>
      <footer className="flex items-center justify-center w-full h-16 border-t bg-white">
        <span className="text-sm text-gray-600">
          © 2023 AI Summaries. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
