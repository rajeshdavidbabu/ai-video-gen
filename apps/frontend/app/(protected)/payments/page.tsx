"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  amount: number;
  creditsAdded: number;
  createdAt: string;
  currency: string;
  status: string;
  provider: string;
}

export default function PaymentsPage() {
  // Fetch user payment history
  const { data: payments, isLoading } = useQuery({
    queryKey: ["user-payments"],
    queryFn: async () => {
      const res = await fetch("/api/user-payments");
      if (!res.ok) throw new Error("Failed to fetch payment history");
      return res.json() as Promise<Payment[]>;
    },
  });

  return (
    <div className="grid h-[calc(100vh-40px)]">
      {/* Center container */}
      <div className="flex justify-center px-2 sm:px-8 py-4">
        {/* Main card - Grid with 2 rows: auto for header, 1fr for content */}
        <div className="w-full max-w-4xl grid grid-rows-[auto_1fr] bg-white rounded-2xl shadow-md border border-gray-100">
          {/* Fixed Header - auto height */}
          <div className="px-4 sm:px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-serif">Payment History</h1>
          </div>

          {/* Scrollable container - 1fr to take remaining space */}
          <div className="relative">
            {/* Absolute positioned scrollable content */}
            <div className="absolute inset-0 overflow-y-auto">
              <div className="px-4 sm:px-8 py-6">
                {isLoading ? (
                  <PaymentHistorySkeleton />
                ) : payments && payments.length > 0 ? (
                  <PaymentHistoryTable payments={payments} />
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No payment history found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Credits</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {format(new Date(payment.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: payment.currency.toUpperCase(),
              }).format(payment.amount)}
            </TableCell>
            <TableCell>{payment.creditsAdded}</TableCell>
            <TableCell>
              <Badge
                variant={payment.status === "success" ? "default" : "secondary"}
              >
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PaymentHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
} 