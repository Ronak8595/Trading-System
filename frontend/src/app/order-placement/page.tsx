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

const invoices = [
	{
		invoice: "INV001",
		tradePair: "BTC-USD",
		quantity: "0.279",
		expiryTime: "17-12-2024 23:09",
		status: "Pending",
		totalAmount: "$250.00",
	},
	{
		invoice: "INV002",
		tradePair: "BTC-USD",
		quantity: "0.279",
		expiryTime: "17-12-2024 23:09",
		status: "Pending",
		totalAmount: "$150.00",
	},
	{
		invoice: "INV003",
		tradePair: "BTC-USD",
		quantity: "0.279",
		expiryTime: "17-12-2024 23:09",
		status: "Pending",
		totalAmount: "$350.00",
	},
];

const OrderPlacement = () => {
	return (
		<div className="h-full w-full">
			<div className="w-[80%] mx-auto py-10 ">
				<h1 className="text-center text-2xl text-blue-500">
					User DashBoard
				</h1>
				<div className="flex justify-between mt-8 sm:flex-row flex-col gap-6 items-center sm:items-start">
					<div className="p-4 bg-white/10 rounded-lg shadow-md w-full sm:w-1/3">
						<h2 className="text-center text-xl text-blue-500 mb-4">
							Total Balance
						</h2>
						<div className="w-full flex justify-between items-center flex-col gap-4">
							<div className="flex justify-between w-full">
								<h3>USD</h3> <h3>$1000.00</h3> <h3>BUY</h3>{" "}
								<h3>SWAP</h3>
							</div>
							<div className="flex justify-between w-full">
								<h3>BTC</h3> <h3>$9900.00</h3> <h3>BUY</h3>{" "}
								<h3>SWAP</h3>
							</div>
							<div className="flex justify-between w-full">
								<h3>ETH</h3> <h3>$2000.00</h3> <h3>BUY</h3>{" "}
								<h3>SWAP</h3>
							</div>
						</div>
					</div>
					<Dialog />
				</div>
				{/* order history */}
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
								<TableHead className="w-[100px]">Id</TableHead>
								<TableHead>Trade Pair</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Expiry Time</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">
									Amount
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.invoice}>
									<TableCell className="font-medium">
										{invoice.invoice}
									</TableCell>
									<TableCell>{invoice.tradePair}</TableCell>
									<TableCell>{invoice.quantity}</TableCell>
									<TableCell>{invoice.expiryTime}</TableCell>
									<TableCell>{invoice.status}</TableCell>
									<TableCell className="text-right">
										{invoice.totalAmount}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default OrderPlacement;
