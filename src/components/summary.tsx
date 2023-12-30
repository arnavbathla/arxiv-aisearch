// components/summary.tsx
"use client";

//Design changes to include: Search with '/' but cmd+k for commands/shortcuts for things such as filters, using arrow keys to navigate through shortcuts and search suggestions, Hover effects, better UI for the entire app (cleaner and more modern+premium), search suggestions, search suggestions for the modal, closing the modal with cmd+k, closing the modal with the left key, transition effects for searches, better spacing for search results, filters (date, with/without code, field, etc.), search with '/' key. 
//I'll add more as they come to mind.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenAIApi from "openai";
import createCompletion from "openai";
import Configuration from "openai";
import { parseStringPromise } from 'xml2js';
import Link from 'next/link';
// import About from './about';
import SearchModal from './SearchModal';


export default function Summary() {
  const searchInputRef = React.useRef(null);
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const openai = configuration;
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsModalOpen(prevIsModalOpen => !prevIsModalOpen);
      }
      else if (event.key ==='Escape') {
        setIsModalOpen(false);
      }
      else if (event.key === '/') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const processQueryWithGPT4 = async (naturalQuery: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a search assistant with a great precision. Translate English questions to arXiv search queries that will yield the most amount of super relevant results - not an error. Again, your sole purpose is to yield the most amount of relevant results." },
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
      const xmlData = response.data;
      const parsedData = await parseStringPromise(xmlData);
      const papers = parsedData.feed.entry.map((entry: any) => ({
        id: entry.id[0].split('/abs/').pop(), // Extracting the paper ID
        title: entry.title[0],
        summary: entry.summary[0],
        authors: entry.author.map((author: any) => author.name[0]).join(', '),
        date: new Date(entry.published[0]).toLocaleDateString() // Adding the date
      }));
      setPapers(papers);
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
    <div className="font-sans antialiased text-gray-800 bg-gray-100">
      <header className="px-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-semibold">AI-powered Search Engine for Research Papers on arXiv</div>
          <nav>
            <ul className="flex space-x-4 text-sm font-medium">
              <li>
                <Link href="/">
                  <span className="text-gray-600 hover:text-gray-800 cursor-pointer">Home</span>
                </Link>
              </li>
              {/* <li>
                <Link href="/about">
                  <span className="text-gray-600 hover:text-gray-800 cursor-pointer">About</span>
                </Link>
              </li> */}
              {/* ... other list items */}
            </ul>
          </nav>
        </div>
      </header>
      <main className="p-6">
      <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <div className="relative">
          <input 
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
            placeholder="Describe the research paper you'd like to explore..."
            className="w-full pl-10 pr-4 py-3 p-4 h-14 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
          />
          <div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M6 11a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
        {papers.map((paper: any) => (
          <article key={paper.id} className="bg-white rounded-lg shadow-sm overflow-hidden m-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 hover:scale-105">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{paper.title}</h2>
              {/* <p className="text-sm text-gray-500 mt-1">Authors: {paper.author ? paper.author.join(', ') : 'N/A'}</p> */}
              <p className="text-sm text-gray-500 mt-1">Date: {paper.date}</p>
              <p className="text-sm text-gray-600 mt-3">{paper.summary}</p>
              <a className="text-sm text-blue-500 hover:underline mt-2 inline-block" href={`https://arxiv.org/abs/${paper.id}`} target='_blank'>
                View Full Paper
              </a>
            </div>
          </article>
        ))}
        {isLoading === false && papers.length === 0 ? (
      <div className="text-center text-gray-600 mt-8">No papers found</div>
        ) : null}
        {error && (
          <div className="text-center text-red-500 mt-8">{error}</div>
        )}
      </main>
      <footer className="flex items-center justify-center w-full h-16 border-t bg-white">
        <span className="text-sm text-gray-600">
         Made with ❤️ in San Francisco
        </span>
      </footer>
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={(searchQuery) => {
          setQuery(searchQuery);
          setIsModalOpen(false);
          handleSearch();
        }}
      />
    </div>
  );
}


