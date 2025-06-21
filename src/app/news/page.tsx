import { useState } from "react";

interface NewsItem {
  id: number;
  tag: string;
  headline: string;
  description: string;
  datetime: string; // ISO string
}

const items: NewsItem[] = [
  {
    id: 1,
    tag: "Update",
    headline: "Mobile app released",
    description: "Our brand new mobile application is now available for download.",
    datetime: "2024-06-01T09:00:00Z",
  },
  {
    id: 2,
    tag: "Event",
    headline: "Summer meetup announced",
    description: "Join us for our annual summer meetup with talks and workshops.",
    datetime: "2024-05-25T14:30:00Z",
  },
  {
    id: 3,
    tag: "Info",
    headline: "Website redesign",
    description: "We have refreshed our website with a new look and feel.",
    datetime: "2024-05-15T08:15:00Z",
  },
];

function NewsCard({ item }: { item: NewsItem }) {
  const [open, setOpen] = useState(false);
  const date = new Date(item.datetime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="border rounded-md p-4 bg-card text-card-foreground">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex flex-col gap-1"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            {item.tag}
          </span>
          <span className="text-xs text-muted-foreground">
            {formattedDate} {formattedTime}
          </span>
        </div>
        <h2 className="font-medium text-base">{item.headline}</h2>
      </button>
      {open && (
        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      )}
    </div>
  );
}

export default function NewsPage() {
  const sorted = [...items].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  return (
    <main className="p-4 max-w-xl mx-auto space-y-4 sm:p-6">
      {sorted.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </main>
  );
}
