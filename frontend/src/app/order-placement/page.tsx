import { Dialog } from "@/components/Dialog";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const invoices = [
	{
		invoice: "INV001",
		paymentStatus: "Paid",
		totalAmount: "$250.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV002",
		paymentStatus: "Pending",
		totalAmount: "$150.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV003",
		paymentStatus: "Unpaid",
		totalAmount: "$350.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV004",
		paymentStatus: "Paid",
		totalAmount: "$450.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV005",
		paymentStatus: "Paid",
		totalAmount: "$550.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV006",
		paymentStatus: "Pending",
		totalAmount: "$200.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV007",
		paymentStatus: "Unpaid",
		totalAmount: "$300.00",
		paymentMethod: "Credit Card",
	},
];

const OrderPlacement = () => {
	return (
		<div className="h-full w-full">
			<div className="w-[80%] mx-auto py-10 ">
				<h1 className="text-center text-2xl text-blue-500">
					Order Placement
				</h1>
				<div className="flex justify-between mt-8 sm:flex-row flex-col gap-6 items-center sm:items-start">
					<div className="p-4 bg-white/10 rounded-lg shadow-md w-full sm:w-1/3">
						<h2 className="text-center text-xl text-blue-500 mb-4">
							Wallet
						</h2>
						<div className="w-full flex justify-between items-center flex-col gap-4">
							<div className="flex justify-between w-full">
								<h3>USD</h3> <h3>$1000.00</h3>
							</div>
							<div className="flex justify-between w-full">
								<h3>Eth</h3> <h3>$2000.00</h3>
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
								<TableHead>Quantity</TableHead>
								<TableHead>Time</TableHead>
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
									<TableCell>
										{invoice.paymentStatus}
									</TableCell>
									<TableCell>
										{invoice.paymentMethod}
									</TableCell>
									<TableCell className="text-right">
										{invoice.totalAmount}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>Total</TableCell>
								<TableCell className="text-right">
									$2,500.00
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default OrderPlacement;
