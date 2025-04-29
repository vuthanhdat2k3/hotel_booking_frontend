"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Search } from "lucide-react"

export function HotelSearch() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")
  const [rooms, setRooms] = useState("1")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (checkIn) params.append("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.append("checkOut", format(checkOut, "yyyy-MM-dd"))
    if (guests) params.append("guests", guests)
    if (rooms) params.append("rooms", rooms)

    // Navigate to search results page with query parameters
    router.push(`/rooms?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-white">
          Địa điểm
        </Label>
        <Input
          id="location"
          placeholder="Nhập thành phố, khách sạn"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="check-in" className="text-white">
          Nhận phòng
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="check-in"
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? (
                format(checkIn, "dd/MM/yyyy", { locale: vi })
              ) : (
                <span className="text-white/70">Chọn ngày</span>
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
        <Label htmlFor="check-out" className="text-white">
          Trả phòng
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="check-out"
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? (
                format(checkOut, "dd/MM/yyyy", { locale: vi })
              ) : (
                <span className="text-white/70">Chọn ngày</span>
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
        <Label htmlFor="guests" className="text-white">
          Số khách
        </Label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger id="guests" className="bg-white/20 border-white/30 text-white">
            <SelectValue placeholder="Số khách" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 khách</SelectItem>
            <SelectItem value="2">2 khách</SelectItem>
            <SelectItem value="3">3 khách</SelectItem>
            <SelectItem value="4">4 khách</SelectItem>
            <SelectItem value="5">5 khách</SelectItem>
            <SelectItem value="6">6+ khách</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search" className="text-white opacity-0 md:block hidden">
          Tìm kiếm
        </Label>
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Tìm kiếm
        </Button>
      </div>
    </form>
  )
}
