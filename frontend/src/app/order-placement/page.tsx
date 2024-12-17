"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/Dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: number;
  userId: number;
  tokenPair: string;
  price: number;
  expiryDate: string;
  orderType: string;
  quantity: number;
  settledQuantity: number;
  createdAt: string;
  updatedAt: string;
}

const OrderPlacement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const userId = 1;

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/users/${userId}/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatus = (quantity: number, settledQuantity: number): string => {
    if (settledQuantity === quantity) return "COMPLETED";
    if (settledQuantity !== 0) return "PARTIAL";
    return "IN PROCESS";
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="h-full w-full">
      <div className="w-[80%] mx-auto py-10">
        <h1 className="text-center text-2xl text-blue-500">User Dashboard</h1>
        <div className="flex justify-between mt-8 sm:flex-row flex-col gap-6 items-center sm:items-start">
          <div className="p-4 bg-white/10 rounded-lg shadow-md w-full sm:w-1/3">
            <h2 className="text-center text-xl text-blue-500 mb-4">
              Total Balance
            </h2>
            <div className="w-full flex justify-between items-center flex-col gap-4">
              <div className="flex justify-between w-full">
                <h3>USD</h3> <h3>$1000.00</h3> <h3>BUY</h3> <h3>SWAP</h3>
              </div>
              <div className="flex justify-between w-full">
                <h3>BTC</h3> <h3>$9900.00</h3> <h3>BUY</h3> <h3>SWAP</h3>
              </div>
              <div className="flex justify-between w-full">
                <h3>ETH</h3> <h3>$2000.00</h3> <h3>BUY</h3> <h3>SWAP</h3>
              </div>
            </div>
          </div>
          <Dialog />
        </div>

        {/* Order History */}
        <div className="bg-white/10 rounded-lg shadow-md p-6 mt-6 sm:mt-10">
          <h3 className="text-center text-xl text-blue-500 mb-4">
            Order History
          </h3>
          <Table>
            <TableCaption>A brief history of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Token Pair</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.tokenPair}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      {new Date(order.expiryDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatus(order.quantity, order.settledQuantity)}
                    </TableCell>
                    <TableCell className="text-right">${order.price}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;
