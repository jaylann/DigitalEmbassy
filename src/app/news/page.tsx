// src/app/news/page.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import MobileLayout from '@/components/MobileLayout'; // ADJUST PATH
import { NewsItem } from "@/types/news-item";
import { NewsCard } from "@/components/news-card"; // ADJUST PATH

const NEWS_UPDATED_EVENT = 'newsUpdated';

// EXPORT this for HomePage to use as a default
export const newsItems: NewsItem[] = [ /* ... your original static newsItems array ... */
  {
    id: 1, tag: "Update", headline: "Network Status Green",
    description: "All systems are now online and fully operational following the brief outage. Monitoring will continue.",
    datetime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2, tag: "Event", headline: "Crisis Averted in Sector 7G",
    description: "The crisis situation in Sector 7G has been successfully neutralized. Routes are now clear. Proceed with standard caution.",
    datetime: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
    location: { lat: 35.7300, lng: 51.4200 }, placeName: "Sector 7G (Near North Bridge)"
  },
  // ... other initial items
];


export default function NewsPage(): React.ReactElement {
  const [currentNewsItems, setCurrentNewsItems] = React.useState<NewsItem[]>(newsItems); // Initialize with static
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const loadNewsFromStorage = React.useCallback(() => { // Wrap in useCallback
    try {
      const storedNews = localStorage.getItem('newsItems');
      if (storedNews) {
        setCurrentNewsItems(JSON.parse(storedNews));
      } else {
        setCurrentNewsItems(newsItems); // Fallback to initial hardcoded if nothing in storage
      }
    } catch (error) {
      console.error("Error loading news from localStorage:", error);
      setCurrentNewsItems(newsItems);
    }
  }, []); // Empty dependency, this function itself doesn't change

  React.useEffect(() => {
    loadNewsFromStorage();

    const handleNewsUpdate = () => {
      console.log("NewsPage: Received news update event. Reloading news.");
      loadNewsFromStorage();
    };
    window.addEventListener(NEWS_UPDATED_EVENT, handleNewsUpdate);
    return () => window.removeEventListener(NEWS_UPDATED_EVENT, handleNewsUpdate);
  }, [loadNewsFromStorage]); // Add loadNewsFromStorage to dependency array

  const sortedItems = React.useMemo(() => {
    return [...currentNewsItems].sort(
        (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  }, [currentNewsItems]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
      <MobileLayout>
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
          <header className="max-w-xl mx-auto mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Latest Briefings</h1>
            <p className="text-muted-foreground mt-1">Real-time updates and intelligence reports.</p>
          </header>
          <motion.main className="mx-auto max-w-xl space-y-4" variants={containerVariants} initial="hidden" animate="visible">
            {sortedItems.length > 0 ? sortedItems.map((item) => (
                <NewsCard key={item.id} item={item} isExpanded={expandedId === item.id}
                          onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
            )) : (
                <p className="text-center text-muted-foreground">No news items to display.</p>
            )}
          </motion.main>
        </div>
      </MobileLayout>
  );
}