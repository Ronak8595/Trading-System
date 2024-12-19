import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "./db.js";
import { addOrder, updateOrderQuantity } from "./MatchingAlgo.js";
import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000", // Allow frontend origin
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Calling Binance API in 5 seconds interval
// setInterval(async () => {
// 	const API = "https://api.binance.com/api/v3/ticker/price";

// 	const res = await fetch(API);
// 	const data: ConversionRate[] = await res.json();

// 	data.forEach((rate: ConversionRate) => {
// 		db.token.update({
// 			where: {
// 				symbol: rate.symbol,
// 			},
// 			data: {
// 				conversionRate: parseFloat(rate.price),
// 			},
// 		});
// 	});
// }, 50000);

// Middleware to parse JSON requests
app.use(
	cors({
		origin: "http://localhost:3000", // Replace with your frontend URL
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.use(express.json());

// Sign in a user and store the socket ID
app.post("/signin", async (req, res) => {
	try {
		interface RequestBody {
			email: string;
			name: string;
			socketId: string;
		}

		const { email, name, socketId }: RequestBody = req.body;

		if (!email || !socketId) {
			res.status(400).json({ error: "Email and socketId are required" });
			return;
		}

		// Find user
		let user = await db.user.findUnique({
			where: { email },
		});

		if (!user) {
			// Create user
			user = await db.user.create({
				data: {
					email,
					name,
					socketId,
				},
				include: {
					wallet: {
						include: {
							tokens: true,
						},
					},
				},
			});
		} else {
			// Update user with the latest socketId
			user = await db.user.update({
				where: { id: user.id },
				data: { socketId },
				include: {
					wallet: {
						include: {
							tokens: true,
						},
					},
				},
			});
		}

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create an order
// app.post("/orders", async (req: Request, res: Response) => {
// 	try {
// 		const { userId, orderType, tokenPair, price, quantity, expiryDate } =
// 			req.body;

// 		// Validate the input
// 		if (
// 			!userId ||
// 			!quantity ||
// 			!orderType ||
// 			!price ||
// 			!expiryDate ||
// 			!tokenPair
// 		) {
// 			res.status(400).json({ error: "Missing required fields" });
// 			return;
// 		}

// 		// Create the order
// 		const order = await db.order.create({
// 			data: {
// 				userId,
// 				orderType,
// 				expiryDate,
// 				price,
// 				tokenPair,
// 				quantity,
// 			},
// 		});

// 		function sendEvent(data: any) {
// 			console.log(data);
// 			io.emit("matching-pairs", data);
// 		}

// 		addOrder(
// 			{
// 				id: order.id.toString(),
// 				type: orderType,
// 				orderPlacedTime: order.createdAt.getTime(),
// 				pair: tokenPair,
// 				price,
// 				quantity,
// 			},
// 			sendEvent
// 		);

// 		res.status(201).json(order);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });

app.post("/user/:userId/createOrders", async (req: Request, res: Response) => {
	try {
		// Get userId from URL params and convert it to an integer
		const { userId } = req.params;
		const userIdInt = parseInt(userId, 10); // Convert userId to an integer

		// Validate if userId is a valid integer
		if (isNaN(userIdInt)) {
			res.status(400).json({ error: "Invalid userId format" });
			return;
		}

		// Get other fields from the request body
		const {
			assetsSelector,
			quantity,
			assetsOption,
			expirationOption,
			expiryDate,
			durationUnit,
			durationValue,
		} = req.body;

		// Validate the input
		if (
			!assetsSelector ||
			!quantity ||
			!assetsOption ||
			!expirationOption
		) {
			res.status(400).json({ error: "Missing required fields" });
			return;
		}

		// Determine the expiry date based on the provided options
		let calculatedExpiryDate: Date | null = null;

		if (expirationOption === "SPECIFIC_DATE") {
			if (!expiryDate) {
				res.status(400).json({
					error: "Expiration date is required for SPECIFIC_DATE option",
				});
				return;
			}
			calculatedExpiryDate = new Date(expiryDate);
		} else if (expirationOption === "DURATION") {
			if (!durationUnit || !durationValue) {
				res.status(400).json({
					error: "Duration unit and value are required for DURATION option",
				});
				return;
			}
			const now = new Date();
			const multiplier = durationUnit === "minutes" ? 60000 : 3600000; // minutes or hours
			calculatedExpiryDate = new Date(
				now.getTime() + durationValue * multiplier
			);
		} else {
			res.status(400).json({ error: "Invalid expiration option" });
			return;
		}

		// Create the order in the database
		const order = await db.order.create({
			data: {
				userId: userIdInt, // Use the converted userId (integer)
				assetsSelector,
				quantity,
				assetsOption,
				expirationOption,
				expiryDate: calculatedExpiryDate,
				durationUnit: durationUnit ?? null,
				durationValue: durationValue ?? null,
			},
		});

		// Emit the order to the event stream
		function sendEvent(data: any) {
			console.log(data);
			// Example event emitter logic
			io.emit("matching-pairs", data);
		}

		addOrder(
			{
				id: order.id.toString(),
				type: assetsSelector,
				orderPlacedTime: order.createdAt.getTime(),
				assetsOption,
				expirationOption,
				quantity,
			},
			sendEvent
		);

		res.status(201).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get previous orders for a user
app.get("/users/:userId/orders", async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		// Fetch orders for the user
		const orders = await db.order.findMany({
			where: { userId: parseInt(userId) },
		});

		res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get details of a specific order
app.get("/orders/:orderId", async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;

		// Fetch the order details
		const order = await db.order.findUnique({
			where: { id: parseInt(orderId) },
		});

		if (!order) {
			res.status(404).json({ error: "Order not found" });
			return;
		}

		res.status(200).json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Real-time updates using Socket.IO
io.on("connection", (socket) => {
	console.log("A user connected");

	// Listen for order status updates from the manager
	socket.on("update_order_status", async ({ orderId, quantitySettled }) => {
		try {
			const order = await db.order.update({
				where: { id: parseInt(orderId) },
				data: {
					settledQuantity: {
						increment: quantitySettled,
					},
				},
			});

			function sendEvent(data: any) {
				console.log(order);
				console.log(data);
				// Broadcast the updated order to all clients
				io.emit("order_status_updated", order);
				// Broadcast the matching pair to managers
				io.emit("matching-pairs", data);
			}

			updateOrderQuantity(
				order.id.toString(),
				quantitySettled,
				sendEvent
			);
		} catch (error) {
			console.error("Error updating order status:", error);
		}
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

server.listen(8000, () => {
	console.log("server running at http://localhost:8000");
});
