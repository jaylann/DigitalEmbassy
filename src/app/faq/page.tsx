'use client'; // This directive is crucial for using useState
//import Image from "next/image";

/*
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
 */

import { useState } from 'react';
import Head from 'next/head';

// Import the JSON data
// Next.js will handle bundling this JSON file with your client-side code.
import faqData from './faq-data.json'; // Adjust path if you placed it elsewhere

// Define interfaces for type safety (optional but highly recommended)
interface FAQItem {
  id: string;
  question: string;
  answer: string; // HTML content for the answer
}

interface FAQCategory {
  categoryName: string;
  questions: FAQItem[];
}

// Type assertion for the imported data
const faqCategories: FAQCategory[] = faqData as FAQCategory[];

export default function FaqPage() {
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
      <>
        <Head>
          <title>FAQ - Euromesh Emergency App</title>
          <meta name="description" content="Frequently Asked Questions for German citizens abroad, provided by the Euromesh Emergency App." />
        </Head>
        <div className="min-h-screen bg-neutral-100 font-[family-name:var(--font-geist-sans)] text-black">
          {/* Header - Black with Gold/Red Accents */}
          <header className="bg-black text-white p-6 shadow-md">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold text-yellow-400">Euromesh</h1>
              <p className="text-xl text-red-500">Frequently Asked Questions</p>
              <p className="text-sm text-gray-300">Offline Information from Your Embassy</p>
            </div>
          </header>

          <main className="container mx-auto p-4 sm:p-8">
            {faqCategories.map((category, categoryIndex) => (
                <section key={categoryIndex} className="mb-10 bg-white p-6 rounded-lg shadow-xl border-l-8 border-red-600">
                  <h2 className="text-3xl font-semibold mb-6 text-black border-b-2 border-yellow-400 pb-3">
                    {category.categoryName}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item) => (
                        <div key={item.id} className="border border-neutral-300 rounded-md overflow-hidden">
                          <button
                              onClick={() => toggleQuestion(item.id)}
                              className="w-full flex justify-between items-center text-left p-4 bg-neutral-50 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                              aria-expanded={!!openQuestions[item.id]}
                              aria-controls={`answer-${item.id}`}
                          >
                            <span className="text-lg font-medium text-black">{item.question}</span>
                            <span className={`transform transition-transform duration-300 ease-in-out ${openQuestions[item.id] ? 'rotate-180' : 'rotate-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-yellow-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                          </button>
                          {openQuestions[item.id] && (
                              <div
                                  id={`answer-${item.id}`}
                                  className="p-4 bg-white border-t border-neutral-300 prose prose-sm max-w-none text-neutral-700"
                                  dangerouslySetInnerHTML={{ __html: item.answer }}
                              />
                          )}
                        </div>
                    ))}
                  </div>
                </section>
            ))}
          </main>

          {/* Footer - Black with Gold/Red Accents */}
          <footer className="bg-black text-white p-6 text-center mt-12">
            <div className="container mx-auto">
              <p className="font-semibold">
                <span className="text-yellow-400">Euromesh</span> - <span className="text-red-500">Stay Safe</span>
              </p>
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Digital Embassy Hackathon. All rights reserved (concept).</p>
              <p className="text-xs text-gray-500 mt-2">
                This app is a conceptual prototype. Always refer to official government channels for definitive advice.
              </p>
            </div>
          </footer>
        </div>
      </>
  );
}
