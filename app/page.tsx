"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  prompt: string;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [result, setResult] = useState<string>("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: data.prompt }),
      });

      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      setResult(json.result);
      localStorage.setItem("savedPage", json.result);
      router.push("/preview");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate response");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-4 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-100">HTML Page Generator</h1>
          <p className="text-gray-400">
            Describe your page and we'll generate the HTML for you
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            placeholder="Type something here..."
            className="min-h-[200px] bg-gray-800 text-gray-100"
            {...register("prompt")}
          />
          <Button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate your landing page"}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-gray-100">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
