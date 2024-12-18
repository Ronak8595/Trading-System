// A Example of a Real-Time Chat Application using Socket.IO 

"use client";
import { useSocket } from "@/hooks/useSocket";
import { useState, useEffect } from "react";

const Chat: React.FC = () => {
	const socket = useSocket();
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		if (!socket) return;

		socket.on("welcome", (message: string) => {
			console.log(message);
		});

		// Listen for broadcast messages
		socket.on("broadcastMessage", (message: string) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		// Cleanup listeners on unmount
		return () => {
			socket.off("welcome");
			socket.off("broadcastMessage");
		};
	}, [socket]);

	const sendMessage = () => {
		if (socket && input.trim()) {
			socket.emit("sendMessage", input);
			setInput(""); 
		}
	};

	return (
		<div>
			<h1>Chat Application</h1>
			<div>
				{messages.map((msg, index) => (
					<p key={index}>{msg}</p>
				))}
			</div>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
			/>
			<button onClick={sendMessage}>Send</button>
		</div>
	);
};

export default Chat;
