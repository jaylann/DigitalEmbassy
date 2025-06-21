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
    tag: "Alert",
    headline: "Airstrike Launched on Tehran Outskirts",
    description: "IDF jets conducted precision strikes targeting military installations near Tehran following confirmed intelligence on missile depots.",
    datetime: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
  },
  {
    id: 2,
    tag: "Alert",
    headline: "Tehran Air Defenses Engaged",
    description: "Iranian air defense batteries activated in response to incoming munition trajectories. Anti-aircraft fire detected over northern districts.",
    datetime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: 3,
    tag: "Report",
    headline: "Civilian Casualties Reported in Shemiran",
    description: "Local authorities report multiple civilian casualties and infrastructure damage in Shemiran district. Medical teams are en route.",
    datetime: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 4,
    tag: "Response",
    headline: "UN Security Council Convenes Emergency Session",
    description: "United Nations Security Council holds an emergency meeting to address escalating tensions following the airstrike.",
    datetime: new Date(Date.now() - 1000 * 3600 * 6).toISOString(), // 6 hours ago
  },
  {
    id: 5,
    tag: "Info",
    headline: "Humanitarian Corridors Established",
    description: "Iranian authorities announce temporary humanitarian corridors for civilian evacuation and aid shipments.",
    datetime: "2025-06-20T14:00:00Z",
  },
  {
    id: 6,
    tag: "Briefing",
    headline: "Ceasefire Declared; All-Clear Issued",
    description: "Military command reports cessation of operations. All-clear issued for resumed civilian and commercial activity.",
    datetime: "2025-06-20T18:30:00Z",
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