// src/app/faq/page.tsx

import type { Metadata } from 'next';
import faqStaticData from './faq-data.json';
import FaqPageContent, {FAQCategory} from "@/components/faq-page-content";
import MobileLayout from "@/components/MobileLayout";

// --- Metadata for SEO (App Router Pattern) ---
// This works because this file is now a Server Component.
export const metadata: Metadata = {
    title: "FAQ - Euromesh",
    description: "Frequently Asked Questions for the Euromesh application.",
};

/**
 * The main server component for the FAQ page.
 * It handles metadata and data loading, then passes the data to a
 * client component for interactive rendering.
 *
 * @returns {React.ReactElement} The rendered FAQ page structure.
 */
export default function FaqPage(): React.ReactElement {
    // Cast the imported JSON data to our defined type.
    const faqCategories: FAQCategory[] = faqStaticData as FAQCategory[];

    return <MobileLayout><FaqPageContent faqCategories={faqCategories} /></MobileLayout>;
}