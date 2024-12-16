import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<header className="h-screen w-full flex flex-col items-center justify-center">
			<div className="flex items-center justify-between w-[20%] mx-auto">
				<Link href="/order-placement">
					<Button>Order Placement</Button>
				</Link>
				<Link href="/manager">
					<Button>Manager</Button>
				</Link>
			</div>
		</header>
	);
}
