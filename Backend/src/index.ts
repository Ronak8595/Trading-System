import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "./db.js";
import { generateMatchingPairs, addOrder } from "./MatchingAlgo.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

// interface ConversionRate {
//   symbol: string;
//   price: string;
// }

// Calling Binance API in 5 seconds interval
// setInterval(async () => {
//   const API = "https://api.binance.com/api/v3/ticker/price";

//   const res = await fetch(API);
//   const data: ConversionRate[] = await res.json();

//   data.forEach((rate: ConversionRate) => {
//     db.token.update({
//       where: {
//         symbol: rate.symbol,
//       },
//       data: {
//         conversionRate: parseFloat(rate.price),
//       },
//     });
//   });
// }, 50000);

// Middleware to parse JSON requests
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
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      // Create user
      user = await db.user.create({
        data: {
          email,
          name,
          socketId,
        },
      });
    } else {
      // Update user with the latest socketId
      await db.user.update({
        where: { id: user.id },
        data: { socketId },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create an order
app.post("/orders", async (req: Request, res: Response) => {
  try {
    const { userId, fromTokenId, toTokenId, quantity } = req.body;

    // Validate the input
    if (!userId || !fromTokenId || !toTokenId || !quantity) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userId,
        fromTokenId,
        toTokenId,
        quantity,
      },
    });

    const fromToken = await db.token.findFirst({
      where: {
        id: order.fromTokenId,
      },
    });

    const toToken = await db.token.findFirst({
      where: {
        id: order.toTokenId,
      },
    });

    if (!fromToken || !toToken) return;

    addOrder({
      id: order.id.toString(),
      type: "buy",
      orderPlacedTime: order.createdAt.getTime(),
      pair: `${fromToken.symbol}-${toToken.symbol}`,
      price: fromToken.conversionRate / toToken.conversionRate,
      quantity: order.quantity,
    });

    const matchingPairs = generateMatchingPairs();

    io.send("matching-pairs", matchingPairs);

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
      include: {
        fromToken: true,
        toToken: true,
      },
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
      include: {
        fromToken: true,
        toToken: true,
        user: true,
      },
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

      // Broadcast the updated order to all clients
      io.emit("order_status_updated", order);
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
