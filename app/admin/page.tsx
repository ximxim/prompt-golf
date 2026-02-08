"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalChallenges: number;
  totalAttempts: number;
  averageScore: number;
  activeUsers: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChallenges: 0,
    totalAttempts: 0,
    averageScore: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Load stats from localStorage (pre-Supabase)
    try {
      const attemptsRaw = localStorage.getItem("prompt-golf-attempts");
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];
      const totalScore = attempts.reduce(
        (sum: number, a: { finalScore: number }) => sum + a.finalScore,
        0
      );

      setStats({
        totalChallenges: 10,
        totalAttempts: attempts.length,
        averageScore:
          attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0,
        activeUsers: attempts.length > 0 ? 1 : 0,
      });
    } catch {
      // Ignore
    }
  }, []);

  const navItems = [
    {
      href: "/admin/challenges",
      icon: FileText,
      title: "Challenge Manager",
      description: "Create, edit, and manage challenge configurations",
    },
    {
      href: "/admin/analytics",
      icon: BarChart3,
      title: "Analytics",
      description: "View usage metrics, scores, and engagement data",
    },
    {
      href: "/admin/teams",
      icon: Users,
      title: "Team Management",
      description: "Manage tenants, users, and roles",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Admin Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⛳</span>
              <span className="text-xl font-bold text-white">Prompt Golf</span>
            </Link>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/challenges"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-amber-400" />
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">
                  Challenges
                </span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.totalChallenges}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">
                  Attempts
                </span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.totalAttempts}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">
                  Avg Score
                </span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.averageScore}%
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Users</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.activeUsers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer group h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 group-hover:text-amber-400 transition-colors">
                    Open
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
