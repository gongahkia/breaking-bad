"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: "info" | "warning" | "success";
}

export function AnnouncementsWithToggle({ dashboardData }: { dashboardData: { announcements: Announcement[] } }) {
  const [isListView, setIsListView] = useState(false);

  const announcements = dashboardData.announcements || [];

  const HorizontalScrollAnnouncements = (
    <div className="overflow-hidden relative flex-nowrap" style={{ direction: 'ltr' }}>
      <div
        className="flex space-x-4 whitespace-nowrap animate-scrollAnnounce"
        style={{ willChange: 'transform' }}
      >
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );

  const ListViewAnnouncements = (
    <div className="flex flex-col overflow-y-auto space-y-4 max-h-[330px] px-4 py-2">
      {announcements.length === 0 ? (
        <div className="text-center text-slate-400">No announcements</div>
      ) : (
        announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} listView />
        ))
      )}
    </div>
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-[400px] flex flex-col overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-white">
          Announcements {announcements.length > 0 && `(${announcements.length})`}
        </CardTitle>
        <button
          className="text-sm text-purple-300 hover:text-purple-400 transition underline cursor-pointer"
          onClick={() => setIsListView(v => !v)}
          aria-label="Toggle announcements view"
        >
          {isListView ? "Horizontal Scroll" : "List View"}
        </button>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {isListView ? ListViewAnnouncements : HorizontalScrollAnnouncements}
      </CardContent>

      <style jsx global>{`
        @keyframes scrollAnnounce {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scrollAnnounce {
          animation: scrollAnnounce 12.5s linear infinite;
          display: flex;
        }
      `}</style>
    </Card>
  );
}

function AnnouncementCard({ announcement, listView }: { announcement: Announcement; listView?: boolean }) {
  return (
    <div
      className={`bg-slate-700 rounded-lg p-6 m-3 flex flex-col justify-between cursor-pointer select-none ${
        listView ? 'w-full h-auto' : 'flex-shrink-0 w-72 h-72'
      }`}
      title={announcement.title}
    >
      <div>
        <h4 className="font-medium text-white text-lg mb-2 truncate" title={announcement.title}>
          {announcement.title}
        </h4>
        <p className={`text-xs text-slate-300 ${listView ? 'line-clamp-3 mb-2' : 'line-clamp-4'}`}>
          {announcement.content}
        </p>
      </div>
      <div className="flex justify-between items-center text-xs text-slate-400 mt-3">
        <span className="capitalize">{announcement.type}</span>
        <span>{new Date(announcement.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  )
}