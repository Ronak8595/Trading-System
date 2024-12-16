import { Button } from "@/components/ui/button";
import {
	Dialog as DialogWrapper,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePickerDemo } from "./DatePicker";

export function Dialog() {
	return (
		<div>
			<DialogWrapper>
				<DialogTrigger asChild>
					<Button variant="outline">Create Order</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create Order</DialogTitle>
						<DialogDescription>
							Add your order details here.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4 justify-between">
							<Select>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Asset selector" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Fruits</SelectLabel>
										<SelectItem value="apple">
											Apple
										</SelectItem>
										<SelectItem value="banana">
											Banana
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="quantity" className="text-right">
								Quantity
							</Label>
							<Input id="quantity" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="price" className="text-right">
								Price
							</Label>
							<Input
								id="price"
								className="col-span-3"
								type="number"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Select>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Expiration" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<DatePickerDemo />
										<SelectItem value="apple">
											Apple
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</DialogContent>
			</DialogWrapper>
		</div>
	);
}
