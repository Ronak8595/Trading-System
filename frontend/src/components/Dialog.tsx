"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
	asset: string | undefined;
	quantity: string;
	price: number | undefined;
	expirationOption: string | undefined;
	durationValue: string | undefined;
	durationUnit: string | undefined;
	expirationDate: Date | undefined;
}

export function Dialog() {
	const { register, handleSubmit, setValue, watch } = useForm<FormData>({
		defaultValues: {
			asset: undefined,
			quantity: "",
			price: undefined,
			expirationOption: "duration",
			durationValue: undefined,
			durationUnit: "minutes",
			expirationDate: undefined,
		},
	});

	const [date, setDate] = React.useState<Date | undefined>(undefined);

	const watchedExpirationOption = watch("expirationOption");
	const watchedExpirationDate = watch("expirationDate");

	const handleDateChange = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		setValue("expirationDate", selectedDate);
	};

	const onSubmit: SubmitHandler<FormData> = (data) => {
		console.log("Form Data on Submit:", data);
	};

	return (
		<div>
			<DialogWrapper>
				<DialogTrigger asChild>
					<Button variant="outline">Create Order</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Create Order</DialogTitle>
							<DialogDescription>
								Add your order details here.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							{/* Asset Selector */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Select
									onValueChange={(value) =>
										setValue("asset", value)
									}
								>
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

							{/* Quantity Input */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="quantity"
									className="text-right"
								>
									Quantity
								</Label>
								<Input
									id="quantity"
									className="col-span-3"
									{...register("quantity")}
								/>
							</div>

							{/* Price Input */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="price" className="text-right">
									Price
								</Label>
								<Input
									id="price"
									className="col-span-3"
									type="number"
									{...register("price", {
										valueAsNumber: true,
									})}
								/>
							</div>

							{/* Expiration Option */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label
									htmlFor="expirationOption"
									className="text-right"
								>
									Expiration
								</Label>
								<Select
									value={watchedExpirationOption ?? undefined}
									onValueChange={(value) =>
										setValue("expirationOption", value)
									}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Choose expiration type" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="duration">
												Time Duration
											</SelectItem>
											<SelectItem value="specific">
												Specific Date
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							{/* Time Duration Inputs */}
							{watchedExpirationOption === "duration" && (
								<div className="grid grid-cols-4 items-center gap-4">
									<Input
										id="durationValue"
										className="col-span-2"
										placeholder="Value"
										type="number"
										{...register("durationValue")}
									/>
									<Select
										value={watch("durationUnit")}
										onValueChange={(value) =>
											setValue("durationUnit", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Unit" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="seconds">
													Seconds
												</SelectItem>
												<SelectItem value="minutes">
													Minutes
												</SelectItem>
												<SelectItem value="hours">
													Hours
												</SelectItem>
												<SelectItem value="days">
													Days
												</SelectItem>
												<SelectItem value="weeks">
													Weeks
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							)}

							{/* Specific Date Picker */}
							{watchedExpirationOption === "specific" && (
								<div className="grid grid-cols-4 items-center gap-4">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-[280px] justify-start text-left font-normal",
													!date &&
														"text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4 z-10" />
												{date
													? format(date, "PPP")
													: "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0 bg-blue-700 z-50 pointer-events-auto">
											<Calendar
												mode="single"
												selected={date}
												onSelect={handleDateChange}
											/>
										</PopoverContent>
									</Popover>
								</div>
							)}
						</div>
						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</DialogWrapper>
		</div>
	);
}
