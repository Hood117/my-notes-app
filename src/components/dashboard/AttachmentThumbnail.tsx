import React, { useEffect, useState } from "react";
import { FileText, Image as ImageIcon } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase/client";

export interface Attachment {
  id: string;
  note_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  url?: string; // used for sandbox fallback
}

interface AttachmentThumbnailProps {
  attachment: Attachment;
  mini?: boolean;
}

export default function AttachmentThumbnail({ attachment, mini = false }: AttachmentThumbnailProps) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (attachment.url) {
      setUrl(attachment.url);
      return;
    }

    if (isSupabaseConfigured && supabase && attachment.file_path) {
      const isImg = attachment.file_type?.startsWith("image/") || 
                    ["jpg", "png", "webp", "jpeg", "gif"].some(ext => attachment.file_name.toLowerCase().endsWith(ext));
      if (isImg) {
        setLoading(true);
        supabase.storage
          .from("note-attachments")
          .createSignedUrl(attachment.file_path, 3600)
          .then(({ data }) => {
            if (data?.signedUrl) {
              setUrl(data.signedUrl);
            }
          })
          .catch(e => console.warn("Could not load private signed thumbnailUrl:", e))
          .finally(() => setLoading(false));
      }
    }
  }, [attachment]);

  const isImg = attachment.file_type?.startsWith("image/") || 
                ["jpg", "png", "webp", "jpeg", "gif"].some(ext => attachment.file_name.toLowerCase().endsWith(ext));

  const dimClass = mini ? "w-6 h-6 rounded" : "w-10 h-10 rounded-xl";
  const iconSize = mini ? 12 : 18;

  if (isImg) {
    if (loading) {
      return (
        <div className={`${dimClass} bg-neutral-200/20 animate-pulse shrink-0`} />
      );
    }
    if (url) {
      return (
        <img
          src={url}
          alt={attachment.file_name}
          className={`${dimClass} object-cover shrink-0 select-none border border-white/15`}
          referrerPolicy="no-referrer"
        />
      );
    }
  }

  const isPdf = attachment.file_type?.includes("pdf") || attachment.file_name.toLowerCase().endsWith(".pdf");

  return (
    <div className={`${dimClass} flex items-center justify-center shrink-0 border ${
      mini 
        ? "bg-white/10 border-white/10 text-white/90" 
        : isPdf 
          ? "bg-rose-50 border-rose-150 text-rose-600" 
          : "bg-blue-50 border-blue-150 text-blue-600"
    }`}>
      <FileText size={iconSize} />
    </div>
  );
}
