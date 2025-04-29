"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

export function RoomFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL parameters
  const [priceRange, setPriceRange] = useState([500000, 3000000])
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkIn") ? new Date(searchParams.get("checkIn") as string) : undefined,
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkOut") ? new Date(searchParams.get("checkOut") as string) : undefined,
  )
  const [amenities, setAmenities] = useState({
    wifi: false,
    breakfast: false,
    parking: false,
    pool: false,
    gym: false,
    aircon: false,
  })

  const handleAmenityChange = (amenity: keyof typeof amenities) => {
    setAmenities({
      ...amenities,
      [amenity]: !amenities[amenity],
    })
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Update dates
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"))

    // Update amenities
    Object.entries(amenities).forEach(([key, value]) => {
      if (value) {
        params.append("amenities", key)
      } else {
        // Remove this amenity if it exists
        const currentAmenities = params.getAll("amenities").filter((a) => a !== key)
        params.delete("amenities")
        currentAmenities.forEach((a) => params.append("amenities", a))
      }
    })

    router.push(`/rooms?${params.toString()}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

      <Accordion type="single" collapsible defaultValue="price" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Giá phòng</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={100000}
                max={5000000}
                step={100000}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dates">
          <AccordionTrigger>Ngày</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
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
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger>Tiện nghi</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="wifi" checked={amenities.wifi} onCheckedChange={() => handleAmenityChange("wifi")} />
                <Label htmlFor="wifi">Wi-Fi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="breakfast"
                  checked={amenities.breakfast}
                  onCheckedChange={() => handleAmenityChange("breakfast")}
                />
                <Label htmlFor="breakfast">Bữa sáng</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={amenities.parking}
                  onCheckedChange={() => handleAmenityChange("parking")}
                />
                <Label htmlFor="parking">Bãi đỗ xe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="pool" checked={amenities.pool} onCheckedChange={() => handleAmenityChange("pool")} />
                <Label htmlFor="pool">Hồ bơi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gym" checked={amenities.gym} onCheckedChange={() => handleAmenityChange("gym")} />
                <Label htmlFor="gym">Phòng tập gym</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aircon"
                  checked={amenities.aircon}
                  onCheckedChange={() => handleAmenityChange("aircon")}
                />
                <Label htmlFor="aircon">Điều hòa</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={handleApplyFilters} className="w-full mt-6">
        Áp dụng bộ lọc
      </Button>
    </div>
  )
}
