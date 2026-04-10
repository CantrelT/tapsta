"use client";

import { useState, useCallback } from "react";
import type { User, Status } from "@/lib/types";
import { getStatuses } from "@/store/app-store";
import { SplashScreen } from "@/components/screens/SplashScreen";
import { AuthScreen } from "@/components/screens/AuthScreen";
import { PostScreen } from "@/components/screens/PostScreen";
import { AnalyticsScreen } from "@/components/screens/AnalyticsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { HomeFeed } from "@/components/feed/HomeFeed";
import { BottomNav } from "@/components/ui/BottomNav";

type Screen = "feed" | "post" | "analytics" | "profile";
type AppState = "splash" | "auth" | "app";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>("feed");
  const [statuses, setStatuses] = useState<Status[]>(() => getStatuses());

  const handleSplashDone = useCallback(() => {
    setAppState("auth");
  }, []);

  const handleAuth = useCallback((user: User) => {
    setCurrentUser(user);
    setAppState("app");
  }, []);

  const handlePostCreated = useCallback((newStatus: Status) => {
    setStatuses((prev) => [newStatus, ...prev]);
    setActiveScreen("feed");
  }, []);

  if (appState === "splash") {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  if (appState === "auth" || !currentUser) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {activeScreen === "feed" && (
        <HomeFeed statuses={statuses} currentUser={currentUser} />
      )}
      {activeScreen === "post" && (
        <div className="flex-1 overflow-y-auto">
          <PostScreen currentUser={currentUser} onPostCreated={handlePostCreated} />
        </div>
      )}
      {activeScreen === "analytics" && (
        <div className="flex-1 overflow-y-auto">
          <AnalyticsScreen currentUser={currentUser} statuses={statuses} />
        </div>
      )}
      {activeScreen === "profile" && (
        <ProfileScreen user={currentUser} />
      )}
      <BottomNav active={activeScreen} onChange={setActiveScreen} />
    </div>
  );
}