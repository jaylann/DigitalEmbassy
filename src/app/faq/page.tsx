'use client'; // This directive is crucial for using useState
//import Image from "next/image";

// src/app/faq/page.tsx
'use client';

//import { useState } from 'react'; // Behalten, falls noch andere interaktive Elemente kommen
import Head from 'next/head';
import MobileLayout from '@/components/layout/MobileLayout'; // Dein Mobile-Layout
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // shadcn/ui Accordion
import faqStaticData from './faq-data.json'; // Deine FAQ-Daten

// Behalte deine Interfaces
interface FAQItem {
  id: string;
  question: string;
  answer: string; // HTML content
  // answer_type und poi_type können erstmal ignoriert oder entfernt werden, wenn nicht genutzt
}

interface FAQCategory {
  categoryName: string;
  questions: FAQItem[];
}

const faqCategories: FAQCategory[] = faqStaticData as FAQCategory[];

export default function FaqPage() {
  // Der State für offene Fragen wird jetzt vom Accordion selbst verwaltet,
  // aber wir können ihn für andere Zwecke behalten oder entfernen.
  // const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  // const toggleQuestion = (id: string) => {
  //   setOpenQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  // };

  return (
      <MobileLayout>
        <Head>
          <title>FAQ - Euromesh</title>
          <meta name="description" content="Häufig gestellte Fragen - Euromesh Notfall-App." />
        </Head>

        <header className="bg-card p-4 shadow-sm sticky top-0 z-30 border-b border-border">
          <div className="container mx-auto max-w-lg">
            <h1 className="text-xl font-semibold text-foreground text-center">
              Häufig gestellte Fragen (FAQ)
            </h1>
          </div>
        </header>

        <div className="container mx-auto p-4 max-w-lg space-y-6">
          {faqCategories.map((category, categoryIndex) => (
              <div key={category.categoryName + categoryIndex} className="bg-card p-0 rounded-lg shadow-md border border-border">
                <h2 className="text-lg font-semibold text-card-foreground px-4 py-3 border-b border-border bg-muted/30 rounded-t-lg">
                  {category.categoryName}
                </h2>
                {category.questions.length > 0 ? (
                    <Accordion type="multiple" className="w-full px-4 py-2">
                      {/*
                  type="single" -> nur ein Item pro Accordion kann offen sein
                  type="multiple" -> mehrere Items können gleichzeitig offen sein
                  collapsible (bei type="single") -> erlaubt das Schließen des aktuell offenen Items
                */}
                      {category.questions.map((item) => (
                          <AccordionItem value={item.id} key={item.id} className="border-b last:border-b-0 border-border">
                            <AccordionTrigger className="text-left hover:no-underline py-3 text-sm font-medium text-foreground">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-3 text-sm text-muted-foreground">
                              <div
                                  className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a:hover]:underline"
                                  dangerouslySetInnerHTML={{ __html: item.answer }}
                              />
                              {/*
                        Hinweis zu prose:
                        - Tailwind Typography Plugin (@tailwindcss/typography) wird benötigt.
                        - [&_a]... sind Ad-hoc-Anpassungen, um Links im Prose-Kontext die Primärfarbe zu geben.
                          Du kannst dies globaler in deiner `globals.css` für `.prose a` definieren.
                      */}
                            </AccordionContent>
                          </AccordionItem>
                      ))}
                    </Accordion>
                ) : (
                    <p className="px-4 py-3 text-sm text-muted-foreground">
                      Keine Fragen in dieser Kategorie verfügbar.
                    </p>
                )}
              </div>
          ))}
        </div>
      </MobileLayout>
  );
}