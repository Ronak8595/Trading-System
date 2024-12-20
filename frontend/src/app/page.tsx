import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <header className="h-screen w-full flex flex-col items-center justify-center">
      <h6 className="text-center text-2xl font-bold">Trading System</h6>
      <div className="flex items-center justify-between w-[40%] mx-auto">
        <Link href="/order-placement">
          <div className="flex flex-col items-center cursor-pointer">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
              alt="Order Placement"
              width={256}
              height={256}
              className="rounded-md hover:scale-110 transition-transform duration-200"
            />
            <p className="mt-2 text-center text-lg font-semibold">Client</p>
          </div>
        </Link>
        <Link href="/manager">
          <div className="flex flex-col items-center cursor-pointer">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Manager"
              width={256}
              height={256}
              className="rounded-md hover:scale-110 transition-transform duration-200"
            />
            <p className="mt-2 text-center text-lg font-semibold">Manager</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
