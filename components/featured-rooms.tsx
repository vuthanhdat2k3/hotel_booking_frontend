"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Coffee, Tv, Bath } from "lucide-react"

// Mock data for featured rooms
const mockFeaturedRooms = [
  {
    id: 1,
    name: "Phòng Deluxe",
    description: "Phòng sang trọng với view thành phố",
    price: 1200000,
    image: "/penthouse-suite-vista.png",
    rating: 4.8,
    amenities: ["wifi", "breakfast", "tv", "bathtub"],
    location: "Hà Nội",
  },
  {
    id: 2,
    name: "Phòng Superior",
    description: "Phòng rộng rãi với ban công",
    price: 950000,
    image: "/mountain-view-balcony.png",
    rating: 4.6,
    amenities: ["wifi", "tv"],
    location: "Đà Nẵng",
  },
  {
    id: 3,
    name: "Phòng Suite",
    description: "Suite cao cấp với phòng khách riêng biệt",
    price: 2500000,
    image: "/grand-suite-living.png",
    rating: 4.9,
    amenities: ["wifi", "breakfast", "tv", "bathtub"],
    location: "Hồ Chí Minh",
  },
  {
    id: 4,
    name: "Phòng Standard",
    description: "Phòng tiêu chuẩn thoải mái",
    price: 750000,
    image: "/comfortable-hotel-stay.png",
    rating: 4.5,
    amenities: ["wifi", "tv"],
    location: "Nha Trang",
  },
]

export function FeaturedRooms() {
  const [rooms, setRooms] = useState(mockFeaturedRooms)

  // In a real application, you would fetch data from your API
  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       const response = await fetch('/api/rooms/featured');
  //       const data = await response.json();
  //       setRooms(data);
  //     } catch (error) {
  //       console.error('Error fetching featured rooms:', error);
  //     }
  //   };
  //
  //   fetchRooms();
  // }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Try to fetch from the API
        const response = await fetch("/api/rooms", {
          // Use relative URL for easier deployment
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          // If response is not OK, throw an error to be caught
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setRooms(data)
      } catch (error) {
        console.error("Error fetching featured rooms:", error)
        // Fall back to mock data when API fails
        console.log("Using mock data as fallback")
        setRooms(mockFeaturedRooms)
      }
    }

    fetchRooms()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "breakfast":
        return <Coffee className="h-4 w-4" />
      case "tv":
        return <Tv className="h-4 w-4" />
      case "bathtub":
        return <Bath className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-white">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {room.rating}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{room.name}</h3>
              <span className="text-sm text-muted-foreground">{room.location}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
            <div className="flex gap-2 mb-4">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="text-muted-foreground" title={amenity}>
                  {getAmenityIcon(amenity)}
                </div>
              ))}
            </div>
            <div className="font-bold text-lg">
              {formatPrice(room.price)} <span className="text-sm font-normal text-muted-foreground">/ đêm</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/rooms/${room.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
