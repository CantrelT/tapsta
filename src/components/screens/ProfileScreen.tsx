"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_STATUSES } from "@/lib/mock-data";
import Image from "next/image";
import type { User, Status } from "@/lib/types";

interface ProfileScreenProps {
  user: User;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl);
  const [activeTab, setActiveTab] = useState<"my-statuses" | "stats">("my-statuses");

  const myStatuses = MOCK_STATUSES.filter((s) => s.userId === user.id);
  const totalViews = myStatuses.reduce((sum, s) => sum + s.viewsCount, 0);
  const totalTaps = 1234 + Math.floor(Math.random() * 500);
  const streak = 7;

  useEffect(() => {
    setEditUsername(user.username);
    setEditAvatar(user.avatarUrl);
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const avatarOptions = [
    "notionists",
    "avataaars",
    "thumbs",
    "miniavs",
  ];

  return (
    <div className="fixed inset-0 bg-black text-white overflow-y-auto pb-20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-violet-400"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar src={editAvatar} alt={user.username} size={96} className="border-violet-500 border-4" />
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 flex gap-1 bg-black rounded-full p-1">
                {avatarOptions.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setEditAvatar(`https://api.dicebear.com/9.x/${seed}/svg?seed=${editUsername}`)}
                    className="w-8 h-8 rounded-full overflow-hidden border border-gray-600"
                  >
                    <Image
                      src={`https://api.dicebear.com/9.x/${seed}/svg?seed=${editUsername}`}
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-center w-full max-w-xs mb-2"
              placeholder="Username"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-1">@{user.username}</h2>
          )}

          <p className="text-zinc-500 text-sm mb-4">{user.phone}</p>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 rounded-full px-6 py-2 font-medium"
            >
              Save Changes
            </button>
          ) : (
            <button className="bg-zinc-800 hover:bg-zinc-700 rounded-full px-6 py-2 font-medium">
              Share Profile
            </button>
          )}
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{myStatuses.length}</div>
            <div className="text-zinc-500 text-sm">Statuses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <div className="text-zinc-500 text-sm">Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{streak}</div>
            <div className="text-zinc-500 text-sm">Day Streak</div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("my-statuses")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "my-statuses"
                ? "bg-zinc-800"
                : "bg-zinc-900 text-zinc-500"
            }`}
          >
            My Statuses
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "stats" ? "bg-zinc-800" : "bg-zinc-900 text-zinc-500"
            }`}
          >
            Stats
          </button>
        </div>

        {activeTab === "my-statuses" && (
          <div className="grid grid-cols-3 gap-1">
            {myStatuses.length > 0 ? (
              myStatuses.map((status) => (
                <div
                  key={status.id}
                  className="aspect-[3/4] relative rounded-lg overflow-hidden bg-zinc-900"
                >
                  <Image
                    src={status.mediaUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-1 right-1 text-xs bg-black/60 px-1 rounded">
                    {status.viewsCount}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-zinc-500">
                No statuses yet. Post your first!
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-xl p-4">
              <h3 className="font-medium mb-3">Top Performing</h3>
              {myStatuses[0] && (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-zinc-800 relative">
                    <Image
                      src={myStatuses[0].mediaUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">
                      {myStatuses[0].caption}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      {myStatuses[0].viewsCount} views • {123 + Math.floor(Math.random() * 50)} taps
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-xl p-4">
              <h3 className="font-medium mb-3">Engagement</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-zinc-800 rounded-lg">
                  <div className="text-xl font-bold text-orange-500">{totalTaps}</div>
                  <div className="text-xs text-zinc-500">Total Taps</div>
                </div>
                <div className="text-center p-3 bg-zinc-800 rounded-lg">
                  <div className="text-xl font-bold text-violet-400">
                    {Math.floor(totalViews * 0.7)}
                  </div>
                  <div className="text-xs text-zinc-500">Reactions</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4">
              <h3 className="font-medium mb-3">This Week</h3>
              <div className="flex justify-between text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={day} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        i <= 4
                          ? "bg-orange-500 text-black"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}