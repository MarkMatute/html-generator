"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Preview() {
  const [savedHtml, setSavedHtml] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("savedPage");
    if (!saved) {
      toast.error("No saved page found");
      router.push("/");
      return;
    }
    setSavedHtml(saved);
  }, [router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(savedHtml);
      setIsCopied(true);
      toast.success("HTML copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (!savedHtml) {
    return null; // Prevent flash of "No saved page yet" during redirect
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative">
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          <Button
            onClick={handleBack}
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            Back to Editor
          </Button>
          <Button
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-white"
            disabled={isCopied}
          >
            {isCopied ? "Copied!" : "Copy HTML"}
          </Button>
        </div>
        <iframe
          srcDoc={savedHtml}
          className="w-full min-h-screen border-0"
          title="Preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
