"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    id1: "ac98ab7s",
    id2: "m5g9sci9",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "pending",
  },
  {
    id: "3u1reuv4",
    id1: "ACas84i9",
    id2: "koa9J8hn",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "success",
  },
  {
    id: "derv1ws0",
    id1: "k98ays22",
    id2: "sn7oin90",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "pending",
  },
  {
    id: "5kma53ae",
    id1: "Ja8hebsq",
    id2: "ash711bv",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "success",
  },
  {
    id: "bhqecj4p",
    id1: "au1b6da",
    id2: "v76q87o",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "failed",
  },
  {
    id: "bhaqcj4p",
    id1: "az8hb1q",
    id2: "19hcb7gb",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "failed",
  },
  {
    id: "bha0lj4p",
    id1: "ao9o7vb",
    id2: "a1j8qvbc",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "failed",
  },
  {
    id: "bhaecj4p",
    id1: "ij89cb7",
    id2: "cbn71l2v",
    tradePair: "BTC-USTD",
    spreadDifference: 100,
    quantity: "0.099",
    status: "failed",
  },
];

export type Payment = {
  id: string;
  id1: string;
  id2: string;
  tradePair: string;
  spreadDifference: number;
  quantity: string;
  status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id1",
    header: "Client 1",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id1")}</div>,
  },
  {
    accessorKey: "id2",
    header: "Client 2",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id2")}</div>,
  },
  {
    accessorKey: "tradePair",
    header: "Commodity",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tradePair")}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "spreadDifference",
    header: () => <div>Gain</div>,
    cell: ({ row }) => {
      const spreadDifference = row.getValue<number>("spreadDifference");

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(spreadDifference);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Approve Match
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ManagerPage = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleApiCall = async () => {
    const response = await fetch("http://localhost:8000/users/1/orders");
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    handleApiCall();
  }, []);

  return (
    <div className="w-full">
      <div className="w-[80%] mx-auto py-10">
        <h1 className="text-center text-2xl text-blue-500">
          Manager DashBaord
        </h1>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter client..."
            value={(table.getColumn("id1")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id1")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
