"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ChallengeCategory } from "@/lib/challenges/types";

interface ChallengeListItem {
  id: string;
  version: string;
  metadata: {
    title: string;
    shortDescription: string;
    category: ChallengeCategory;
    difficulty: number;
    estimatedMinutes: number;
    tags: string[];
  };
  flags?: {
    isActive: boolean;
    isFeatured: boolean;
    isExperimental: boolean;
  };
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yamlContent, setYamlContent] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/challenges");
        const data = await res.json();
        setChallenges(data.challenges || []);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleValidateYaml = async () => {
    try {
      // Basic validation via API
      const res = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yamlContent, validateOnly: true }),
      });
      const data = await res.json();
      setValidationResult(
        data.valid ? "Valid challenge configuration!" : `Error: ${data.error}`
      );
    } catch {
      setValidationResult("Validation failed. Check your YAML syntax.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-white">
              Challenge Manager
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                <Plus className="w-4 h-4 mr-2" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Paste your challenge YAML configuration below. See the
                  challenge template in the docs for the required format.
                </p>
                <Textarea
                  value={yamlContent}
                  onChange={(e) => setYamlContent(e.target.value)}
                  placeholder="Paste your challenge YAML here..."
                  className="h-96 font-mono text-sm bg-slate-900 border-slate-600"
                />
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleValidateYaml}
                    variant="outline"
                    className="border-slate-600"
                  >
                    Validate
                  </Button>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                    Save Challenge
                  </Button>
                </div>
                {validationResult && (
                  <p
                    className={`text-sm ${validationResult.startsWith("Valid") ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {validationResult}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Challenge</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400">Difficulty</TableHead>
                  <TableHead className="text-slate-400">Version</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map((challenge) => (
                  <TableRow
                    key={challenge.id}
                    className="border-slate-700 hover:bg-slate-700/50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {challenge.metadata.title}
                        </p>
                        <p className="text-xs text-slate-500">{challenge.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryPill category={challenge.metadata.category} />
                    </TableCell>
                    <TableCell>
                      <DifficultyBadge
                        level={challenge.metadata.difficulty}
                        showLabel={false}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-400 font-mono">
                        v{challenge.version}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {challenge.flags?.isActive !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-0">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-0">
                            Inactive
                          </Badge>
                        )}
                        {challenge.flags?.isFeatured && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/challenges/${challenge.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
