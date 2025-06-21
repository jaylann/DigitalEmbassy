"use client";

import Head from 'next/head';
import MobileLayout from '../../components/MobileLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqStaticData from './faq-data.json';

interface FAQItem {
  id: string;
  question: string;
  answer: string; // HTML content
}

interface FAQCategory {
  categoryName: string;
  questions: FAQItem[];
}

const faqCategories: FAQCategory[] = faqStaticData as FAQCategory[];

export default function FaqPage() {
  // The Accordion component manages its own open state. To control it manually,
  // you can use a state object like the example below.
  // const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  // Example for manual accordion control:
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
                        Accordion options:
                        type="single"  - only one item open at a time
                        type="multiple" - allow multiple items open
                        collapsible (with type="single") permits closing the currently open item
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
                        Note on `.prose` styling:
                        - Requires the Tailwind Typography plugin
                        - The [&_a] utilities apply the primary color to links
                        - These styles can be configured globally in `globals.css`
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