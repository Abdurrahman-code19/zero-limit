"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Clock, Package } from "lucide-react";

interface ReturnRequest {
  id: string;
  order_number: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  admin_notes: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/returns");
      const data = await res.json();
      setReturns(data.returns);
    } catch (error) {
      console.error("Failed to fetch returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
    admin_notes: string = ""
  ) => {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_notes }),
      });
      setReturns((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Failed to update return:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: ReturnRequest["status"]) => {
    const styles: Record<string, string> = {
      pending:
        "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
      approved:
        "bg-green-500/10 text-green-500 border border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border border-red-500/20",
      completed:
        "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
      completed: <Package className="h-3 w-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Returns</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer return requests
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : returns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No return requests</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              When customers submit return requests, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {returns.map((returnRequest) => (
                    <tr key={returnRequest.id} className="hover:bg-muted/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        {returnRequest.order_number}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium">
                          {returnRequest.customer_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {returnRequest.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <span title={returnRequest.reason}>
                          {returnRequest.reason.length > 60
                            ? returnRequest.reason.substring(0, 60) + "..."
                            : returnRequest.reason}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(returnRequest.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {new Date(
                          returnRequest.created_at
                        ).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {returnRequest.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === returnRequest.id}
                              onClick={() =>
                                handleStatusUpdate(
                                  returnRequest.id,
                                  "approved"
                                )
                              }
                              className="text-green-500 hover:bg-green-500/10 hover:text-green-600"
                            >
                              {updatingId === returnRequest.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span className="ml-1">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === returnRequest.id}
                              onClick={() =>
                                handleStatusUpdate(
                                  returnRequest.id,
                                  "rejected"
                                )
                              }
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                            >
                              {updatingId === returnRequest.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <span className="ml-1">Reject</span>
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
