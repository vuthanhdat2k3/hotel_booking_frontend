"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, differenceInDays } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RoomBookingFormProps {
  room: {
    id: number
    name: string
    price: number
    maxGuests: number
  }
}

export function RoomBookingForm({ room }: RoomBookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date())
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 1))
  const [guests, setGuests] = useState("2")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return room.price

    const nights = differenceInDays(checkOut, checkIn)
    return room.price * (nights || 1)
  }

  const calculateTaxes = () => {
    return calculateTotalPrice() * 0.1 // 10% tax
  }

  const calculateServiceFee = () => {
    return calculateTotalPrice() * 0.05 // 5% service fee
  }

  const calculateGrandTotal = () => {
    return calculateTotalPrice() + calculateTaxes() + calculateServiceFee()
  }

  // Update the handleBooking function to handle errors better
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    // Chuẩn bị dữ liệu đặt phòng
    const bookingData = {
      roomId: room.id,
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : null,
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : null,
      guests: Number.parseInt(guests),
      totalPrice: calculateGrandTotal(),
    }

    console.log("Booking data:", bookingData)

    try {
      // For development, just simulate a successful booking
      // In production, uncomment the API call below
      /*
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      */

      // Simulate successful booking for development
      const data = { id: Date.now() }

      // Chuyển hướng đến trang thanh toán với ID đặt phòng
      router.push(
        `/checkout?bookingId=${data.id}&roomId=${room.id}&checkIn=${format(checkIn!, "yyyy-MM-dd")}&checkOut=${format(checkOut!, "yyyy-MM-dd")}&guests=${guests}`,
      )
    } catch (error) {
      console.error("Error creating booking:", error)
      // Hiển thị thông báo lỗi cho người dùng
      alert("Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đặt phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="check-in">Nhận phòng</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="check-in" variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? (
                    format(checkIn, "dd/MM/yyyy", { locale: vi })
                  ) : (
                    <span className="text-muted-foreground">Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out">Trả phòng</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="check-out" variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? (
                    format(checkOut, "dd/MM/yyyy", { locale: vi })
                  ) : (
                    <span className="text-muted-foreground">Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  disabled={(date) => date < (checkIn || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Số khách</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id="guests">
                <SelectValue placeholder="Số khách" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} khách
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>
                {formatPrice(room.price)} x {checkIn && checkOut ? differenceInDays(checkOut, checkIn) || 1 : 1} đêm
              </span>
              <span>{formatPrice(calculateTotalPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (10%)</span>
              <span>{formatPrice(calculateTaxes())}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí dịch vụ (5%)</span>
              <span>{formatPrice(calculateServiceFee())}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Tổng cộng</span>
              <span>{formatPrice(calculateGrandTotal())}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Đặt ngay
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
        <p>Bạn chưa bị trừ tiền</p>
        <p>Miễn phí hủy phòng trước 3 ngày</p>
      </CardFooter>
    </Card>
  )
}
