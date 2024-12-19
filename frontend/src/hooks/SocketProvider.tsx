"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

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

interface SocketContextProps {
	socket: SocketInstance | null;
	matchingPair: any[];
	setMatchingPair: React.Dispatch<React.SetStateAction<any[]>>;
}

const SocketContext = createContext<SocketContextProps>({
	socket: null,
	matchingPair: [],
	setMatchingPair: () => {},
});

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<SocketInstance | null>(null);
	const [matchingPair, setMatchingPair] = useState<any[]>([]);

	useEffect(() => {
		const _socket = io("http://localhost:8000");

		_socket.on("matching-pairs", (matchingPairs) => {
			console.log("Received matching pairs:", matchingPairs);
			setMatchingPair(matchingPairs);
		});

		_socket.on("connect", () => {
			console.log("Socket connected");
			setSocket(_socket);
		});

		_socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});

		return () => {
			_socket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider
			value={{ socket, matchingPair, setMatchingPair }}
		>
			{children}
		</SocketContext.Provider>
	);
};
