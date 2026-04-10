"use client";

type Screen = "feed" | "post" | "analytics" | "profile";

interface BottomNavProps {
  active: Screen;
  onChange: (screen: Screen) => void;
}

const NAV_ITEMS: Array<{ id: Screen; icon: string; label: string }> = [
  { id: "feed", icon: "⚡", label: "Feed" },
  { id: "post", icon: "＋", label: "Post" },
  { id: "analytics", icon: "📊", label: "Stats" },
  { id: "profile", icon: "👤", label: "Profile" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 transition-all ${
                isActive ? "opacity-100" : "opacity-40"
              }`}
            >
              {item.id === "post" ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-light transition-transform active:scale-90"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {item.icon}
                </div>
              ) : (
                <>
                  <span className="text-xl">{item.icon}</span>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-white" : "text-white/60"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}