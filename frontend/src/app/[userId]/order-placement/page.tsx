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
	assetsSelector: string;
}

interface Token {
	id: number;
	walletId: number;
	tokenId: number;
	quantity: number;
}

interface Wallet {
	id: number;
	userId: number;
	tokens: Token[];
}

interface User {
	id: number;
	email: string;
	name: string;
	role: string;
	walletId: number;
	socketId: string;
	createdAt: string;
	wallet: Wallet;
}

import { use } from "react";

const OrderPlacement = ({
	params,
}: {
	params: Promise<{ userId: string }>;
}) => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [user, setUser] = useState<User | null>(null); // Updated type
	const { userId } = use(params);

	const tokenMapping: { [key: number]: string } = {
		2000: "BTC",
		2001: "ETH",
		2002: "USDT",
	};

	const getOrderHistory = async () => {
		const response = await fetch(
			`http://localhost:8000/users/${userId}/orders`
		);
		const data = await response.json();
		setOrders(data);
	};

	// const getUser = async () => {
	//   const requestBody = {
	//     email: "p4@xxx.com",
	//     name: "p4priyanshi",
	//     socketId: "dscsn",
	//   };

	//   try {
	//     const response = await fetch("http://localhost:8000/signin", {
	//       method: "POST",
	//       headers: {
	//         "Content-Type": "application/json",
	//       },
	//       body: JSON.stringify(requestBody),
	//     });

	//     if (!response.ok) {
	//       throw new Error(`Error: ${response.status} ${response.statusText}`);
	//     }

	//     const data = await response.json();
	//     setUser(data);
	//   } catch (error) {
	//     console.error("Error fetching user:", error);
	//   }
	// };

	useEffect(() => {
		getOrderHistory();

		const intervalId = setInterval(() => {
			getOrderHistory();
		}, 5000); // Fetch every 5 seconds

		return () => clearInterval(intervalId);
	}, [userId]);

	const getStatus = (quantity: number, settledQuantity: number): string => {
		if (settledQuantity === quantity) return "COMPLETED";
		if (settledQuantity !== 0) return "PARTIAL";
		return "IN PROCESS";
	};

	return (
		<div className="h-full w-full">
			<div className="w-[80%] mx-auto py-10">
				<h1 className="text-center text-2xl text-blue-500">
					User Dashboard
				</h1>
				<div className="flex justify-between mt-8 sm:flex-row flex-col gap-6 items-center sm:items-start">
					<div className="p-4 bg-white/10 rounded-lg shadow-md w-full sm:w-1/3">
						<h2 className="text-center text-xl text-blue-500 mb-4">
							Total Balance
						</h2>
						<div className="w-full flex justify-between items-center flex-col gap-4">
							{user &&
							user.wallet &&
							user.wallet.tokens &&
							user.wallet.tokens.length > 0 ? (
								user.wallet.tokens.map((token) => {
									const tokenName =
										tokenMapping[
											token.tokenId as keyof typeof tokenMapping
										] || "Unknown Token";

									return (
										<div
											key={token.id}
											className="flex justify-between w-full"
										>
											<h3>{tokenName}</h3>
											<h3>{token.quantity}</h3>
											<h3>BUY</h3>
											<h3>SWAP</h3>
										</div>
									);
								})
							) : (
								<div className="flex justify-between w-full">
									<h3>Your wallet is empty...</h3>
								</div>
							)}
						</div>
					</div>
					<Dialog userId={userId} />
				</div>

				{/* Order History */}
				<div className="bg-white/10 rounded-lg shadow-md p-6 mt-6 sm:mt-10">
					<h3 className="text-center text-xl text-blue-500 mb-4">
						Order History
					</h3>
					<Table>
						<TableCaption>
							A brief history of your recent orders.
						</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">
									Order Id
								</TableHead>
								<TableHead>Token Name</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Expiry Time</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">
									Token Price
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.length > 0 ? (
								orders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">
											{order.id}
										</TableCell>
										<TableCell>
											{order.assetsSelector.split(":")[0]}
										</TableCell>
										<TableCell>{order.quantity}</TableCell>
										<TableCell>
											{new Date(
												order.expiryDate
											).toLocaleString()}
										</TableCell>
										<TableCell>
											{getStatus(
												order.quantity,
												order.settledQuantity
											)}
										</TableCell>
										<TableCell className="text-right">
											{order.assetsSelector.split(":")[1]}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center"
									>
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
