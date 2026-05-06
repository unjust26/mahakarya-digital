import { useQuery } from "convex/react";
import {
  Clock,
  Eye,
  Inbox,
  MessageSquare,
  TrendingUp,
  User,
  Mail,
  Briefcase,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

/* ─── Stat Card ─── */
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">{title}</span>
        <div className={`rounded-lg p-2 ${color}/10`}>
          <Icon className={`size-4 ${color}`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {subtitle && (
        <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Inquiry Row ─── */
function InquiryRow({
  inquiry,
}: {
  inquiry: {
    _id: string;
    name: string;
    email: string;
    business?: string;
    package?: string;
    message: string;
    status: string;
    createdAt: number;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(inquiry.createdAt);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <User className="size-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">
              {inquiry.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                inquiry.status === "new"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {inquiry.status}
            </span>
          </div>
          <p className="text-sm text-zinc-400 truncate">{inquiry.message}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-zinc-500">{timeAgo}</p>
          {expanded ? (
            <ChevronUp className="size-4 text-zinc-500 mt-1 ml-auto" />
          ) : (
            <ChevronDown className="size-4 text-zinc-500 mt-1 ml-auto" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-zinc-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-zinc-500" />
              <span className="text-zinc-300">{inquiry.email}</span>
            </div>
            {inquiry.business && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="size-4 text-zinc-500" />
                <span className="text-zinc-300">{inquiry.business}</span>
              </div>
            )}
            {inquiry.package && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="size-4 text-zinc-500" />
                <span className="text-zinc-300">{inquiry.package}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-zinc-500" />
              <span className="text-zinc-300">
                {date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Chat Session Row ─── */
function ChatRow({
  session,
}: {
  session: {
    _id: string;
    sessionId: string;
    visitorName?: string;
    visitorEmail?: string;
    isLead: boolean;
    lastActive: number;
    createdAt: number;
  };
}) {
  const timeAgo = getTimeAgo(new Date(session.lastActive));
  return (
    <div className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:bg-zinc-800/30 transition-colors">
      <div
        className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          session.isLead
            ? "bg-emerald-500/20"
            : "bg-zinc-700/50"
        }`}
      >
        <MessageSquare
          className={`size-5 ${
            session.isLead ? "text-emerald-400" : "text-zinc-400"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">
            {session.visitorName || "Anonymous Visitor"}
          </span>
          {session.isLead && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Lead
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 truncate">
          {session.visitorEmail || `Session: ${session.sessionId.slice(0, 8)}...`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-zinc-500">{timeAgo}</p>
      </div>
    </div>
  );
}

/* ─── Helper ─── */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

/* ─── Main Dashboard ─── */
export function DashboardPage() {
  const user = useQuery(api.auth.currentUser);
  const inquiries = useQuery(api.inquiries.list);
  const chatSessions = useQuery(api.chat.listSessions);

  const totalInquiries = inquiries?.length ?? 0;
  const newInquiries = inquiries?.filter((i) => i.status === "new").length ?? 0;
  const totalChats = chatSessions?.length ?? 0;
  const totalLeads = chatSessions?.filter((s) => s.isLead).length ?? 0;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-zinc-400 mt-1">
          MahaKarya Digital Admin Dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inquiries"
          value={totalInquiries}
          icon={Inbox}
          color="text-amber-400"
          subtitle="From contact form"
        />
        <StatCard
          title="New Inquiries"
          value={newInquiries}
          icon={TrendingUp}
          color="text-emerald-400"
          subtitle="Awaiting response"
        />
        <StatCard
          title="Chat Sessions"
          value={totalChats}
          icon={MessageSquare}
          color="text-blue-400"
          subtitle="AI chat conversations"
        />
        <StatCard
          title="Qualified Leads"
          value={totalLeads}
          icon={Eye}
          color="text-purple-400"
          subtitle="From chat widget"
        />
      </div>

      {/* Inquiries */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Inbox className="size-5 text-amber-400" />
          Client Inquiries
        </h2>
        {!inquiries ? (
          <div className="text-zinc-500 text-sm py-8 text-center">
            Loading…
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-zinc-500 text-sm py-8 text-center border border-zinc-800 rounded-xl">
            No inquiries yet. They'll appear here when clients use the contact form.
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <InquiryRow key={inq._id} inquiry={inq} />
            ))}
          </div>
        )}
      </div>

      {/* Chat Sessions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="size-5 text-blue-400" />
          AI Chat Sessions
        </h2>
        {!chatSessions ? (
          <div className="text-zinc-500 text-sm py-8 text-center">
            Loading…
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="text-zinc-500 text-sm py-8 text-center border border-zinc-800 rounded-xl">
            No chat sessions yet. They'll appear when visitors use the chat widget.
          </div>
        ) : (
          <div className="space-y-3">
            {chatSessions.map((s) => (
              <ChatRow key={s._id} session={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
