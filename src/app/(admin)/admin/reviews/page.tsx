"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Review {
  id: string; rating: number; title?: string; body: string; verified: boolean;
  approved: boolean; createdAt: string;
  user: { name: string | null; email: string };
  product: { name: string; slug: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const load = () => {
    setLoading(true);
    fetch("/api/reviews/admin").then(r => r.json()).then(d => { setReviews(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const action = async (id: string, action: "approve" | "reject" | "delete") => {
    if (action === "delete" && !confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/admin?id=${id}`, {
      method: action === "delete" ? "DELETE" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: action !== "delete" ? JSON.stringify({ approved: action === "approve" }) : undefined,
    });
    if (res.ok) { toast.success(action === "delete" ? "Deleted" : action === "approve" ? "Approved!" : "Rejected"); load(); }
    else toast.error("Action failed");
  };

  const filtered = reviews.filter(r => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-brown">Reviews</h1>
          <p className="text-brown-light text-sm">{reviews.length} total · {reviews.filter(r => !r.approved).length} pending</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(["all", "pending", "approved"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-full text-sm font-medium capitalize transition-all",
              filter === f ? "bg-blush-dark text-white" : "bg-white text-brown-light border border-border hover:bg-cream")}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton" />) :
          filtered.length === 0 ? <div className="text-center py-16 bg-white rounded-2xl text-brown-light">No reviews found</div> :
          filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <p className="font-medium text-brown text-sm">{r.user?.name || "Anonymous"}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} className={cn(j < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200")} />
                      ))}
                    </div>
                    {r.verified && <span className="badge bg-green-100 text-green-700 text-[10px]">✓ Verified</span>}
                    <span className={cn("badge text-[10px]", r.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                      {r.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-blush-dark mb-1">On: {r.product?.name}</p>
                  {r.title && <p className="text-sm font-medium text-brown mb-1">{r.title}</p>}
                  <p className="text-sm text-brown-light">{r.body}</p>
                  <p className="text-xs text-brown-light mt-2">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!r.approved && (
                    <button onClick={() => action(r.id, "approve")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                      <CheckCircle2 size={13} /> Approve
                    </button>
                  )}
                  {r.approved && (
                    <button onClick={() => action(r.id, "reject")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors">
                      <XCircle size={13} /> Unapprove
                    </button>
                  )}
                  <button onClick={() => action(r.id, "delete")}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
