"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Wifi,
  Coffee,
  Tv,
  Bath,
  Car,
  Dumbbell,
  Wind,
} from "lucide-react";

// Mock data for rooms
const mockRooms = [
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
    amenities: ["wifi", "tv", "aircon"],
    location: "Đà Nẵng",
  },
  {
    id: 3,
    name: "Phòng Suite",
    description: "Suite cao cấp với phòng khách riêng biệt",
    price: 2500000,
    image: "/grand-suite-living.png",
    rating: 4.9,
    amenities: ["wifi", "breakfast", "tv", "bathtub", "gym"],
    location: "Hồ Chí Minh",
  },
  {
    id: 4,
    name: "Phòng Standard",
    description: "Phòng tiêu chuẩn thoải mái",
    price: 750000,
    image: "/comfortable-hotel-stay.png",
    rating: 4.5,
    amenities: ["wifi", "tv", "aircon"],
    location: "Nha Trang",
  },
  {
    id: 5,
    name: "Phòng Family",
    description: "Phòng gia đình rộng rãi với 2 giường đôi",
    price: 1800000,
    image: "/spacious-family-room.png",
    rating: 4.7,
    amenities: ["wifi", "breakfast", "tv", "bathtub", "parking"],
    location: "Đà Lạt",
  },
  {
    id: 6,
    name: "Phòng Executive",
    description: "Phòng hạng sang với dịch vụ VIP",
    price: 3200000,
    image: "/executive-suite-vip.png",
    rating: 4.9,
    amenities: ["wifi", "breakfast", "tv", "bathtub", "gym", "parking"],
    location: "Hà Nội",
  },
];

export function RoomList() {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState(mockRooms);
  const [filteredRooms, setFilteredRooms] = useState(mockRooms);

  // Thêm vào sau phần khai báo state
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Try to fetch from the API
        const response = await fetch("/api/rooms/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Fall back to mock data when API fails
        console.log("Using mock data as fallback");
        setRooms(mockRooms);
        setFilteredRooms(mockRooms);
      }
    };

    fetchRooms();
  }, []);

  // Apply filters when search parameters change
  useEffect(() => {
    let filtered = [...rooms];

    // Filter by price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      filtered = filtered.filter(
        (room) =>
          room.price >= Number.parseInt(minPrice) &&
          room.price <= Number.parseInt(maxPrice)
      );
    }

    // Filter by location
    const location = searchParams.get("location");
    if (location) {
      filtered = filtered.filter((room) =>
        room.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by amenities
    const amenities = searchParams.getAll("amenities");
    if (amenities.length > 0) {
      filtered = filtered.filter((room) =>
        amenities.every((amenity) => room.amenities.includes(amenity))
      );
    }

    setFilteredRooms(filtered);
  }, [searchParams, rooms]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return (
          <span title="Wi-Fi">
            <Wifi className="h-4 w-4" />
          </span>
        );
      case "breakfast":
        return (
          <span title="Bữa sáng">
            <Coffee className="h-4 w-4" />
          </span>
        );
      case "tv":
        return (
          <span title="TV">
            <Tv className="h-4 w-4" />
          </span>
        );
      case "bathtub":
        return (
          <span title="Bồn tắm">
            <Bath className="h-4 w-4" />
          </span>
        );
      case "parking":
        return (
          <span title="Bãi đỗ xe">
            <Car className="h-4 w-4" />
          </span>
        );
      case "gym":
        return (
          <span title="Phòng tập gym">
            <Dumbbell className="h-4 w-4" />
          </span>
        );
      case "aircon":
        return (
          <span title="Điều hòa">
            <Wind className="h-4 w-4" />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {filteredRooms.length} phòng có sẵn
        </h2>
        <div className="text-sm text-muted-foreground">
          Sắp xếp theo:
          <select className="ml-2 p-1 border rounded">
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="rating-desc">Đánh giá</option>
          </select>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            Không tìm thấy phòng phù hợp
          </h3>
          <p className="text-muted-foreground mb-6">
            Vui lòng thử lại với các bộ lọc khác
          </p>
          <Button asChild>
            <Link href="/rooms">Xóa bộ lọc</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-white"
                    >
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {room.rating}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 md:w-3/5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {room.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {room.description}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {room.amenities.map((amenity) => (
                      <div key={amenity} className="text-muted-foreground">
                        {getAmenityIcon(amenity)}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="font-bold text-lg mb-2">
                      {formatPrice(room.price)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / đêm
                      </span>
                    </div>
                    <Link href={`/rooms/${room.id}`} className="w-full">
                      <Button className="w-full">Đặt ngay</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
