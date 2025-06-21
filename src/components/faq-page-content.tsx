// src/app/faq/faq-page-content.tsx

"use client"; // This directive now lives here.

import * as React from "react";
import { motion, type Variants } from "framer-motion"; // ✅ Import the `Variants` type
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/**
 * @interface FaqPageContentProps
 * @property {FAQCategory[]} faqCategories - The categorized list of FAQ data.
 */
interface FaqPageContentProps {
    faqCategories: FAQCategory[];
}
interface FAQItem {
    id: string;
    question: string;
    answer: string; // HTML content
}

export interface FAQCategory {
    categoryName: string;
    questions: FAQItem[];
}

/**
 * The client-side component responsible for rendering the interactive FAQ list.
 * It handles all animations and user interactions for the FAQ page.
 *
 * @param {FaqPageContentProps} props - The component props.
 * @returns {React.ReactElement} The rendered interactive FAQ content.
 */
export default function FaqPageContent({ faqCategories }: FaqPageContentProps): React.ReactElement {

    // --- Animation Variants with Explicit Typing ---
    const containerVariants: Variants = { // ✅ Explicitly typed
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = { // ✅ Explicitly typed
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
            <header className="max-w-3xl mx-auto mb-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl"
                >
                    Frequently Asked Questions
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="text-gray-400 mt-2"
                >
                    Find answers to common questions about the Euromesh system.
                </motion.p>
            </header>

            <motion.div
                className="max-w-3xl mx-auto space-y-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {faqCategories.map((category) => (
                    <motion.section key={category.categoryName} variants={itemVariants}>
                        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                            {category.categoryName}
                        </h2>

                        {category.questions.length > 0 ? (
                            <Accordion type="multiple" className="w-full space-y-4">
                                {category.questions.map((item) => (
                                    <AccordionItem
                                        value={item.id}
                                        key={item.id}
                                        className={cn(
                                            "rounded-2xl border border-white/10 bg-black/30 shadow-lg backdrop-blur-sm",
                                            "overflow-hidden data-[state=open]:border-blue-400/50 transition-all"
                                        )}
                                    >
                                        <AccordionTrigger className="w-full text-left hover:no-underline p-4 sm:p-5 text-base font-semibold text-gray-100">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 sm:px-5 pb-5 text-sm text-gray-300">
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-blue-400 [&_a:hover]:underline"
                                                dangerouslySetInnerHTML={{ __html: item.answer }}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No questions available in this category.
                            </p>
                        )}
                    </motion.section>
                ))}
            </motion.div>
        </div>
    );
}