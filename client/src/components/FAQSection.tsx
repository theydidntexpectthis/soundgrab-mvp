import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does SoundGrab work?",
    answer:
      "SoundGrab uses advanced AI to find and download music from various platforms. Just type what you're looking for, even lyrics or a description of the song, and our system will find and convert it to MP3 format for you.",
  },
  {
    question: "Is SoundGrab free to use?",
    answer:
      "SoundGrab offers both free and premium options. Free users can download a limited number of songs per day with standard quality. Premium users enjoy unlimited downloads, higher audio quality, and an ad-free experience.",
  },
  {
    question: "What audio formats are supported?",
    answer:
      "SoundGrab supports multiple formats including MP3, MP4, WAV, and FLAC. Premium users can choose their preferred format and bitrate for the best audio quality.",
  },
  {
    question: "Is it legal to download music with SoundGrab?",
    answer:
      "SoundGrab is designed for downloading content for personal use only. Users should respect copyright laws and use downloaded content in accordance with fair use policies in their region.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="mb-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-heading font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-surface rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "text-text-secondary transition-transform duration-200",
                    openIndex === index && "transform rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "p-4 pt-0 overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-40" : "max-h-0",
                )}
              >
                <p className="text-text-secondary text-sm">{faq.answer}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
