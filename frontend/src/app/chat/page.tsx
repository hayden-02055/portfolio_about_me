import ChatSection from "@/components/ChatSection";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 hover:text-gray-600 transition-colors"
          >
            HW.
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            ← Back to Portfolio
          </Link>
        </nav>
      </header>
      <main className="flex flex-col pt-16" style={{ height: "100dvh" }}>
        <ChatSection fullPage />
      </main>
    </div>
  );
}
