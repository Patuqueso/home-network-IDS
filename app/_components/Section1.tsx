"use client";

import { UniversalSection } from "@/components/main/Section";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Import the pagination component
import { useEffect, useState } from "react";

type PacketLog = {
  src: string;
  dst: string;
  method: string;
  timestamp: string; // Using 'timestamp' instead of 'time'
};

export const Section1 = () => {
  const [logs, setLogs] = useState<PacketLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/logs?page=${page}&limit=10`
      );
      if (!response.ok) throw new Error("Failed to fetch logs");

      const data = await response.json();
      setLogs(data.logs);
      setTotalLogs(data.totalLogs); // Adjusted to use `totalLogs` from backend
      console.log("Fetched logs:", data.logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  // Total pages calculation
  const totalPages = Math.ceil(totalLogs / 10);

  return (
    <UniversalSection>
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="w-full text-xl justify-start">Network Logs</h1>
        <Table className="w-full border">
          <TableCaption>Latest 10 network logs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Source IP</TableHead>
              <TableHead>Destination IP</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.src}</TableCell>
                <TableCell>{log.dst}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell className="text-right">{log.timestamp}</TableCell> {/* Ensure this field is displayed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls from ShadCN */}
        <Pagination>
          <PaginationContent>
            <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
            <PaginationItem>
              <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>

            {/* Add pagination links dynamically if needed */}
            {totalPages > 1 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationLink
                isActive={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>

            <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
          </PaginationContent>
        </Pagination>
      </div>
    </UniversalSection>
  );
};
