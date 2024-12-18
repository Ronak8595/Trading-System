import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

interface ServerToClientEvents {
	welcome: (message: string) => void;
	broadcastMessage: (message: string) => void;
}

interface ClientToServerEvents {
	sendMessage: (message: string) => void;
}

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = (): SocketInstance | null => {
	const [socket, setSocket] = useState<SocketInstance | null>(null);

	useEffect(() => {
		const socketInstance: SocketInstance = io(SOCKET_URL);

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket;
};
