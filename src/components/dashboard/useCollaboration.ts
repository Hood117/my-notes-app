import { useEffect, useState, useRef } from "react";
import { UserProfile } from "../../lib/supabase/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../../lib/supabase/client";

export interface Collaborator {
  user_id: string;
  email: string;
  name: string;
  color: string;
  online_at: string;
  cursor?: { x: number; y: number } | null;
}

// Generate a deterministic color based on the user ID
export function getUserColor(userId: string): string {
  const colors = [
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function useCollaboration(noteId: string | undefined, user: UserProfile | null): { collaborators: Collaborator[]; sendCursorPosition: (x: number, y: number) => void } {
  const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});
  const channelRef = useRef<any>(null);
  const supabase = getSupabaseClient();

  // Create a stable reference to avoid capture closure issues in realtime handlers
  const collaboratorsRef = useRef<Record<string, Collaborator>>({});
  useEffect(() => {
    collaboratorsRef.current = collaborators;
  }, [collaborators]);

  useEffect(() => {
    if (!noteId || !user) {
      setCollaborators({});
      return;
    }

    const userColor = getUserColor(user.id);

    // 1. If Supabase is configured, configure the authentic real-time channel
    if (isSupabaseConfigured && supabase) {
      const channelName = `note_${noteId}`;
      const channel = supabase.channel(channelName, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });
      channelRef.current = channel;

      // Listen to presence events
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          const active: Record<string, Collaborator> = {};

          Object.keys(state).forEach((key) => {
            const presenceArray = state[key] as any[];
            if (presenceArray && presenceArray.length > 0) {
              const uData = presenceArray[0];
              active[key] = {
                user_id: uData.user_id,
                email: uData.email || "",
                name: uData.name || "Collaborator",
                color: uData.color || getUserColor(uData.user_id),
                online_at: uData.online_at,
                // preserve previous cursor coordinates if available
                cursor: collaboratorsRef.current[key]?.cursor || null,
              };
            }
          });

          setCollaborators(active);
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log("Realtime collaborator joined:", key, newPresences);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log("Realtime collaborator left:", key, leftPresences);
        })
        .on("broadcast", { event: "cursor" }, ({ payload }) => {
          if (!payload || payload.user_id === user.id) return;
          
          setCollaborators((prev) => {
            if (!prev[payload.user_id]) return prev;
            return {
              ...prev,
              [payload.user_id]: {
                ...prev[payload.user_id],
                cursor: { x: payload.x, y: payload.y },
              },
            };
          });
        });

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: user.id,
            email: user.email,
            name: user.name,
            color: userColor,
            online_at: new Date().toISOString(),
          });
        }
      });

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
      };
    } else {
      // 2. Local fallback Sandbox presentation simulation
      const mockId = `mock-collab-${noteId}`;
      const mockCo: Collaborator = {
        user_id: mockId,
        email: "collaborator@example.com",
        name: "Mock Collaborator",
        color: "#F59E0B", // amber-500
        online_at: new Date().toISOString(),
        cursor: { x: 45, y: 55 },
      };

      const selfCo: Collaborator = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        color: userColor,
        online_at: new Date().toISOString(),
      };

      setCollaborators({
        [user.id]: selfCo,
        [mockId]: mockCo,
      });

      // Periodically update mock user's cursor positions as simulation
      const interval = setInterval(() => {
        setCollaborators((prev) => {
          if (!prev[mockId]) return prev;
          const currentCursor = prev[mockId].cursor || { x: 40, y: 50 };
          const dx = (Math.random() - 0.5) * 12;
          const dy = (Math.random() - 0.5) * 12;
          return {
            ...prev,
            [mockId]: {
              ...prev[mockId],
              cursor: {
                x: Math.max(10, Math.min(90, currentCursor.x + dx)),
                y: Math.max(10, Math.min(90, currentCursor.y + dy)),
              },
            },
          };
        });
      }, 2500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [noteId, user?.id]);

  const sendCursorPosition = (x: number, y: number) => {
    if (channelRef.current && user) {
      channelRef.current.send({
        type: "broadcast",
        event: "cursor",
        payload: {
          user_id: user.id,
          name: user.name,
          email: user.email,
          color: getUserColor(user.id),
          x,
          y,
        },
      });
    }

    // Also update our own cursor coordinates in the local collaborators state dictionary for debugging
    if (!isSupabaseConfigured && user) {
      setCollaborators((prev) => {
        if (!prev[user.id]) return prev;
        return {
          ...prev,
          [user.id]: {
            ...prev[user.id],
            cursor: { x, y },
          },
        };
      });
    }
  };

  return {
    collaborators: Object.values(collaborators),
    sendCursorPosition,
  };
}
