"use client";

import Link from "next/link";
import { ArrowLeft, Users, Building2, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminTeamsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
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
            Team Management
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Card */}
        <Card className="bg-amber-500/5 border-amber-500/20 mb-8">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Building2 className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Enterprise Multi-Tenancy
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Team management features require Supabase to be configured.
                  Once connected, you can create tenant organizations, invite
                  team members, assign roles, and set up custom branding.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-700 text-slate-300 border-0">
                    Requires Supabase
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 opacity-70">
            <CardContent className="pt-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Tenant Organizations
              </h3>
              <p className="text-sm text-slate-400">
                Create separate organizations with their own branding, challenge
                sets, and leaderboards.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>- Custom logo and brand colors</li>
                <li>- Challenge access control</li>
                <li>- Isolated leaderboards</li>
                <li>- Team-specific analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 opacity-70">
            <CardContent className="pt-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                User Management
              </h3>
              <p className="text-sm text-slate-400">
                Invite team members, assign roles, and manage permissions.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>- Email invitations</li>
                <li>- Role-based access (Learner, Admin, Super Admin)</li>
                <li>- Bulk user import</li>
                <li>- Activity tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
