type OrderType = "buy" | "sell";

interface Order {
	id: string;
	pair: string; // Example: "BTC-USDT"
	type: OrderType;
	price: number;
	quantity: number;
	orderPlacedTime: number; // Timestamp when the order was placed
}

const buyOrders: Record<string, Heap<Order>> = {};
const sellOrders: Record<string, Heap<Order>> = {};

// WebSocket placeholder function for sending data
function mockWebSocketSend(data: any) {
	console.log("Sending to WebSocket:", JSON.stringify(data, null, 2));
}

function addOrder(order: Order) {
	if (order.type === "buy") {
		if (!buyOrders[order.pair])
			buyOrders[order.pair] = new Heap((a, b) => {
				if (a.price === b.price) return a.orderPlacedTime - b.orderPlacedTime;
				return a.price - b.price;
			});
		buyOrders[order.pair].push(order);
	} else {
		if (!sellOrders[order.pair])
			sellOrders[order.pair] = new Heap((a, b) => {
				if (a.price === b.price) return a.orderPlacedTime - b.orderPlacedTime;
				return b.price - a.price;
			});
		sellOrders[order.pair].push(order);
	}
	console.log(`Order ${order.id} added successfully.`);
	generateMatchingPairs();
}

function updateOrderQuantity(orderId: string, quantityToDeduct: number) {
	let updated = false;

	[buyOrders, sellOrders].forEach((orderMap) => {
		for (const pair in orderMap) {
			const orders = orderMap[pair].toArray();
			const order = orders.find((o) => o.id === orderId);
			if (order) {
				if (order.quantity < quantityToDeduct) {
					console.warn(`Order ID ${orderId} does not have sufficient quantity.`);
					return;
				}
				order.quantity -= quantityToDeduct;
				if (order.quantity === 0) {
					orderMap[pair].remove((o) => o.id === orderId);
					console.log(`Order ID ${orderId} fully settled and removed.`);
				}
				updated = true;
				break;
			}
		}
	});

	if (!updated) console.warn(`Order ID ${orderId} not found. Update failed.`);
	generateMatchingPairs();
}

function deleteOrExpiry(orderId: string) {
	let deleted = false;

	[buyOrders, sellOrders].forEach((orderMap) => {
		for (const pair in orderMap) {
			const orders = orderMap[pair].toArray();
			if (orders.some((o) => o.id === orderId)) {
				orderMap[pair].remove((o) => o.id === orderId);
				console.log(`Order ID ${orderId} deleted/expired.`);
				deleted = true;
				break;
			}
		}
	});

	if (!deleted) console.warn(`Order ID ${orderId} not found.`);
	generateMatchingPairs();
}

function deepCopyOrder(order: Order): Order {
	return {
		...order,
	};
}

function generateMatchingPairs() {
	const matchingPairs: any[] = [];

	for (const pair in buyOrders) {
		if (!sellOrders[pair]) continue;

		const buyHeap = buyOrders[pair];
		const sellHeap = sellOrders[pair];

		const buyCopy = new Heap((a: Order, b: Order) => {
			if (a.price === b.price) return a.orderPlacedTime - b.orderPlacedTime;
			return a.price - b.price;
		});
		buyHeap.toArray().forEach((order) => buyCopy.push(deepCopyOrder(order)));

		const sellCopy = new Heap((a: Order, b: Order) => {
			if (a.price === b.price) return a.orderPlacedTime - b.orderPlacedTime;
			return b.price - a.price;
		});
		sellHeap.toArray().forEach((order) => sellCopy.push(deepCopyOrder(order)));

		let i = 0,
			j = 0;

		while (i < buyCopy.toArray().length && j < sellCopy.toArray().length) {
			const buyOrder = buyCopy.toArray()[i];
			const sellOrder = sellCopy.toArray()[j];

			if (buyOrder.price >= sellOrder.price) {
				const matchQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);

				if (matchQuantity > 0) {
					matchingPairs.push({
						pair,
						buyOrderId: buyOrder.id,
						sellOrderId: sellOrder.id,
						buyOrderPrice: buyOrder.price,
						sellOrderPrice: sellOrder.price,
						spreadDifference: buyOrder.price - sellOrder.price,
						quantity: matchQuantity,
					});

					buyOrder.quantity -= matchQuantity;
					sellOrder.quantity -= matchQuantity;

					if (buyOrder.quantity === 0) i++;
					if (sellOrder.quantity === 0) j++;
				}
			} else {
				break;
			}
		}
	}

	if (matchingPairs.length === 0) {
		console.log("No matching pairs found at this time.");
	} else {
		console.log("Matching pairs generated successfully.");
	}

	return matchingPairs;
}

class Heap<T> {
	private data: T[] = [];
	private comparator: (a: T, b: T) => number;

	constructor(comparator: (a: T, b: T) => number) {
		this.comparator = comparator;
	}

	push(item: T) {
		this.data.push(item);
		this.heapifyUp();
	}

	remove(predicate: (item: T) => boolean) {
		const index = this.data.findIndex(predicate);
		if (index === -1) return;
		this.swap(index, this.data.length - 1);
		this.data.pop();
		this.heapifyDown(index);
	}

	toArray() {
		return [...this.data];
	}

	private heapifyUp() {
		let index = this.data.length - 1;
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.comparator(this.data[index], this.data[parentIndex]) > 0) {
				this.swap(index, parentIndex);
				index = parentIndex;
			} else {
				break;
			}
		}
	}

	private heapifyDown(index: number) {
		const length = this.data.length;
		while (true) {
			const left = 2 * index + 1;
			const right = 2 * index + 2;
			let largest = index;

			if (left < length && this.comparator(this.data[left], this.data[largest]) > 0) {
				largest = left;
			}
			if (right < length && this.comparator(this.data[right], this.data[largest]) > 0) {
				largest = right;
			}
			if (largest !== index) {
				this.swap(index, largest);
				index = largest;
			} else {
				break;
			}
		}
	}

	private swap(i: number, j: number) {
		[this.data[i], this.data[j]] = [this.data[j], this.data[i]];
	}
}

// Sample use cases:

// Add orders
addOrder({
	id: "1",
	pair: "BTC-USDT",
	type: "buy",
	price: 26900,
	quantity: 1.5,
	orderPlacedTime: Date.now(),
});
addOrder({
	id: "2",
	pair: "BTC-USDT",
	type: "sell",
	price: 26900,
	quantity: 1,
	orderPlacedTime: Date.now() - 5000,
});
addOrder({
	id: "3",
	pair: "BTC-USDT",
	type: "buy",
	price: 26800,
	quantity: 0.5,
	orderPlacedTime: Date.now() - 10000,
});
addOrder({
	id: "4",
	pair: "BTC-USDT",
	type: "sell",
	price: 26800,
	quantity: 1,
	orderPlacedTime: Date.now() - 15000,
});

// Update an order's quantity
updateOrderQuantity("1", 1);

// Delete/expire an order
deleteOrExpiry("2");

// Add new orders after deletion
addOrder({
	id: "5",
	pair: "BTC-USDT",
	type: "buy",
	price: 27000,
	quantity: 0.8,
	orderPlacedTime: Date.now(),
});

export { addOrder, generateMatchingPairs, deleteOrExpiry, updateOrderQuantity };