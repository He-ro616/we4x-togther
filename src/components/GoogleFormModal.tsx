import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X, ExternalLink, Share2, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  formUrl: string;
}

export function GoogleFormModal({
  isOpen,
  onClose,
  title,
  description,
  formUrl,
}: GoogleFormModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 📱 Mobile → open form full screen
  useEffect(() => {
    if (isMobile && isOpen) {
      window.open(formUrl, "_blank", "noopener,noreferrer");
      onClose();
    }
  }, [isMobile, isOpen, formUrl, onClose]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: description || "Register here",
        url: formUrl,
      });
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-hidden p-4 sm:max-w-2xl sm:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle>{title}</DialogTitle>

          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}

          <DialogClose className="absolute right-4 top-4">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        {/* Google Form */}
        <iframe
          src={formUrl}
          className="w-full h-[65vh] rounded-md border"
          frameBorder="0"
          loading="lazy"
        />

        {/* 🔥 SHARE / ADS SECTION */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <span className="text-xs text-muted-foreground">
            Share this event
          </span>

          <div className="flex gap-2">
            {/* Native Share (mobile supported browsers) */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-muted"
            >
              <Share2 size={14} />
              Share
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${title}\n${formUrl}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-muted"
            >
              WhatsApp
            </a>

            {/* Copy link */}
            <button
              onClick={copyLink}
              className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-muted"
            >
              <Copy size={14} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Full screen fallback */}
        <a
          href={formUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 hidden sm:flex items-center justify-center gap-2 text-sm text-primary"
        >
          Open in full screen <ExternalLink size={16} />
        </a>
      </DialogContent>
    </Dialog>
  );
}
