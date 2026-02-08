import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold text-amber-400/20">404</div>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="text-slate-400 max-w-md">
          Looks like this prompt didn&apos;t find what it was looking for. Try
          being more specific next time!
        </p>
        <Link href="/">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
