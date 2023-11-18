
"use client";
import React, { useState } from 'react';


export default function About() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
        <header className="px-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-2xl font-semibold">AI-powered Search Engine for Research Papers on arXiv</div>
          <nav>
            <ul className="flex space-x-4 text-sm font-medium">
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/">
                  Home
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/about">
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
      <div className="container px-4 md:px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Our Tech</h2>
          <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            We are a forward-thinking tech company, pushing the boundaries of innovation. Our cutting-edge technology is
            shaping the future.
          </p>
        </div>
      </div>
      <div className="container px-4 md:px-6 mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-center">Our Innovators</h3>
      </div>
    </section>
  )
}
