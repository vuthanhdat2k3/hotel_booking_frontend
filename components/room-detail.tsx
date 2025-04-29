"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wifi, Coffee, Tv, Bath, Car, Dumbbell, Wind, Utensils, Lock, Maximize, Users, BedDouble } from "lucide-react"

interface RoomDetailProps {
  room: {
    id: number
    name: string
    description: string
    longDescription: string
    price: number
    images: string[]
    rating: number
    amenities: string[]
    location: string
    maxGuests: number
    bedType: string
    roomSize: string
  }
}

export function RoomDetail({ room }: RoomDetailProps) {
  const [activeImage, setActiveImage] = useState(0)

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-5 w-5" />
      case "breakfast":
        return <Coffee className="h-5 w-5" />
      case "tv":
        return <Tv className="h-5 w-5" />
      case "bathtub":
        return <Bath className="h-5 w-5" />
      case "parking":
        return <Car className="h-5 w-5" />
      case "gym":
        return <Dumbbell className="h-5 w-5" />
      case "aircon":
        return <Wind className="h-5 w-5" />
      case "minibar":
        return <Utensils className="h-5 w-5" />
      case "safe":
        return <Lock className="h-5 w-5" />
      case "balcony":
        return <Maximize className="h-5 w-5" />
      default:
        return null
    }
  }

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return "Wi-Fi miễn phí"
      case "breakfast":
        return "Bữa sáng miễn phí"
      case "tv":
        return "TV màn hình phẳng"
      case "bathtub":
        return "Bồn tắm"
      case "parking":
        return "Bãi đỗ xe"
      case "gym":
        return "Phòng tập gym"
      case "aircon":
        return "Điều hòa"
      case "minibar":
        return "Minibar"
      case "safe":
        return "Két an toàn"
      case "balcony":
        return "Ban công"
      default:
        return amenity
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{room.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{room.location}</Badge>
          <Badge variant="outline">{room.bedType}</Badge>
          <Badge variant="outline">{room.roomSize}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
          <Image
            src={room.images[activeImage] || "/placeholder.svg"}
            alt={`${room.name} - Ảnh ${activeImage + 1}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {room.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative h-40 md:h-48 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setActiveImage(index + 1)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${room.name} - Ảnh ${index + 2}`}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
          <TabsTrigger value="policies">Chính sách</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4 border rounded-lg mt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{room.maxGuests} khách</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-muted-foreground" />
                <span>{room.bedType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <span>{room.roomSize}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{room.longDescription}</p>
          </div>
        </TabsContent>
        <TabsContent value="amenities" className="p-4 border rounded-lg mt-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <div className="text-primary">{getAmenityIcon(amenity)}</div>
                <span>{getAmenityLabel(amenity)}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="policies" className="p-4 border rounded-lg mt-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Nhận phòng & Trả phòng</h3>
              <p className="text-sm text-muted-foreground">Nhận phòng: 14:00 - 22:00</p>
              <p className="text-sm text-muted-foreground">Trả phòng: trước 12:00</p>
            </div>
            <div>
              <h3 className="font-medium">Chính sách hủy phòng</h3>
              <p className="text-sm text-muted-foreground">
                Miễn phí hủy phòng trước 3 ngày. Sau thời gian này, khách sẽ bị tính phí 100% giá trị đặt phòng.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Trẻ em & Giường phụ</h3>
              <p className="text-sm text-muted-foreground">Trẻ em dưới 6 tuổi: miễn phí khi sử dụng giường hiện có.</p>
              <p className="text-sm text-muted-foreground">Giường phụ: 300.000 VND/đêm (theo yêu cầu).</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
