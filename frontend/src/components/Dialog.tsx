"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  assetsSelector: string | undefined;
  quantity: number | undefined;
  assetsOption: string | undefined;
  expirationOption: string | undefined;
  durationValue: number | undefined;
  durationUnit: string | undefined;
  expiryDate: Date | undefined;
}

interface ConversionRate {
  symbol: string;
  price: string;
}

export function Dialog({ userId }: { userId: string }) {
  const [conversionRate, setConversionRate] = useState<ConversionRate[]>([]);
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      assetsSelector: undefined,
      quantity: undefined,
      assetsOption: undefined,
      expirationOption: undefined,
      durationValue: undefined,
      durationUnit: undefined,
      expiryDate: undefined,
    },
  });

  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setValue("expiryDate", selectedDate);
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const dataToSend = {
      assetsSelector: formData.assetsSelector,
      quantity: formData.quantity
        ? parseInt(formData.quantity.toString(), 10)
        : undefined,
      assetsOption: formData.assetsOption,
      expirationOption: formData.expirationOption,
      durationUnit: formData.durationUnit,
      durationValue: formData.durationValue
        ? parseInt(formData.durationValue.toString(), 10)
        : undefined,
      expiryDate: formData.expiryDate,
    };
    const response = await fetch(
      `http://localhost:8000/user/${userId}/createOrders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Server Error:", { status: response.status, data });
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    } else {
      toast("Order Created Successfully");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchConversionRate = async () => {
      const API = "https://api.binance.com/api/v3/ticker/price";

      try {
        const res = await fetch(API);
        const data: ConversionRate[] = await res.json();

        setConversionRate((prevState) => {
          // Stop adding if we already have 15 items
          if (prevState.length >= 15) return prevState;

          // Add new rates to the state and ensure we don't exceed 15 items
          const newRates = [...prevState, ...data].slice(0, 15);
          return newRates;
        });
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    // Set interval for 5 seconds
    const intervalId = setInterval(fetchConversionRate, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [conversionRate]);

  return (
    <div>
      <DialogWrapper open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Create Order
          </Button>
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
                  onValueChange={(value) => {
                    setValue("assetsSelector", value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Asset selector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {conversionRate.map((rate) => (
                        <SelectItem
                          key={rate.symbol}
                          value={rate.symbol + " : " + rate.price}
                          className="flex justify-between items-center gap-6 "
                        >
                          <h5>{rate.symbol}</h5>
                          <h5 className="text-blue-600">{rate.price}</h5>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  className="col-span-3"
                  {...register("quantity")}
                />
              </div>

              {/* Assets Option (BUY/SELL) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  onValueChange={(value) => {
                    setValue("assetsOption", value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="BUY/SELL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expiration Option */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expirationOption" className="text-right">
                  Expiration
                </Label>
                <Select
                  value={watch("expirationOption") ?? undefined}
                  onValueChange={(value) => {
                    setValue("expirationOption", value);
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Choose expiration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="DURATION">Time Duration</SelectItem>
                      <SelectItem value="SPECIFIC_DATE">
                        Specific Date
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Duration Inputs */}
              {watch("expirationOption") === "DURATION" && (
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
                    onValueChange={(value) => {
                      setValue("durationUnit", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Specific Date Picker */}
              {watch("expirationOption") === "SPECIFIC_DATE" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 z-10" />
                        {date ? format(date, "PPP") : "Pick a date"}
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
