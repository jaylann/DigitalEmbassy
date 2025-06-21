// src/app/news/page.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import MobileLayout from '../../components/MobileLayout';
import { NewsItem } from "@/types/news-item";
import { NewsCard } from "@/components/news-card";

const newsItems: NewsItem[] = [
  {
    id: 1,
    tag: "Update",
    headline: "Network Status Green",
    description: "All systems are now online and fully operational following the brief outage. Monitoring will continue.",
    datetime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 2,
    tag: "Event",
    headline: "Crisis Averted in Sector 7G",
    description: "The crisis situation in Sector 7G has been successfully neutralized. Routes are now clear. Proceed with standard caution.",
    datetime: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    tag: "Info",
    headline: "New Sympathetic Contact Added",
    description: "A new trusted contact 'Viper' has been added to the directory for the downtown district. Review their profile in the contacts section.",
    datetime: "2024-05-28T11:00:00Z",
  },
];

/**
 * The main page for displaying a list of news updates.
 * Features a staggered animation for list items and a controlled accordion state.
 *
 * @returns {React.ReactElement} The rendered NewsPage.
 */
export default function NewsPage(): React.ReactElement {
  // State to track which card is currently expanded. `null` means all are closed.
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  /**
   * Memoize the sorted list of news items to prevent re-sorting on every render.
   * This is a performance optimization that becomes more important as the data
   * or component complexity grows.
   */
  const sortedItems = React.useMemo(() => {
    console.log("Sorting news items..."); // This will now only log once
    return [...newsItems].sort(
        (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  }, []); // The dependency array is empty because `newsItems` is static.

  // Animation variants for the container to orchestrate staggered children animations.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
          <header className="max-w-xl mx-auto mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Latest Briefings</h1>
            <p className="text-gray-400 mt-1">Real-time updates and intelligence reports.</p>
          </header>

          <motion.main
              className="mx-auto max-w-xl space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
          >
            {sortedItems.map((item) => (
                <NewsCard
                    key={item.id}
                    item={item}
                    isExpanded={expandedId === item.id}
                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                />
            ))}
          </motion.main>
        </div>
      </MobileLayout>
  );
}