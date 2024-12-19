import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Replace with your backend server's WebSocket URL
const SOCKET_URL = "http://localhost:8000";

interface ServerToClientEvents {
	order_status_updated: (updatedOrder: any) => void;
	matching_pairs: (matchingPairs: any) => void;
}

interface ClientToServerEvents {
	update_order_status: (data: {
		orderId: number;
		quantitySettled: number;
	}) => void;
}

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = (): SocketInstance | null => {
	const [socket, setSocket] = useState<SocketInstance | null>(null);

	useEffect(() => {
		// Initialize the Socket.IO connection
		const socketInstance: SocketInstance = io(SOCKET_URL);

		setSocket(socketInstance);

		// Cleanup function to disconnect the socket on unmount
		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket;
};
