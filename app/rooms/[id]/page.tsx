"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RoomDetail } from "@/components/room-detail";
import { RoomBookingForm } from "@/components/room-booking-form";
import { RoomReviews } from "@/components/room-reviews";

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = Number.parseInt(params.id as string);
  interface Room {
    id: number;
    name: string;
    description: string;
    longDescription: string;
    price: number;
    images: string[];
    rating: number;
    amenities: string[];
    location: string;
    maxGuests: number;
    bedType: string;
    roomSize: string;
  }

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // Try to fetch from the API
        const response = await fetch(`/api/rooms/${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // For demo purposes, use mock data if API fails
          console.error(`API returned status: ${response.status}`);

          // Mock data for development
          const mockRooms = [
            {
              id: 1,
              name: "Phòng Deluxe",
              description: "Phòng sang trọng với view thành phố",
              longDescription:
                "Phòng Deluxe của chúng tôi mang đến không gian sang trọng và thoải mái với diện tích 35m². Phòng được trang bị đầy đủ tiện nghi hiện đại, bao gồm TV màn hình phẳng, minibar, két an toàn và Wi-Fi miễn phí.",
              price: 1200000,
              images: [
                "/penthouse-suite-vista.png",
                "/opulent-bathroom-retreat.png",
                "/luxurious-white-bed.png",
                "/executive-suite-workspace.png",
              ],
              rating: 4.8,
              amenities: [
                "wifi",
                "breakfast",
                "tv",
                "bathtub",
                "aircon",
                "minibar",
                "safe",
              ],
              location: "Hà Nội",
              maxGuests: 2,
              bedType: "1 giường King size",
              roomSize: "35m²",
            },
            {
              id: 2,
              name: "Phòng Superior",
              description: "Phòng rộng rãi với ban công",
              longDescription:
                "Phòng Superior của chúng tôi mang đến không gian rộng rãi và thoải mái với diện tích 30m². Điểm nổi bật của phòng là ban công riêng, nơi bạn có thể thư giãn và ngắm nhìn khung cảnh tuyệt đẹp.",
              price: 950000,
              images: [
                "/mountain-view-balcony.png",
                "/modern-hotel-shower.png",
                "/crisp-hotel-bed.png",
                "/placeholder.svg?height=600&width=800&query=hotel room balcony with chairs",
              ],
              rating: 4.6,
              amenities: ["wifi", "tv", "aircon", "minibar", "balcony"],
              location: "Đà Nẵng",
              maxGuests: 2,
              bedType: "1 giường Queen size",
              roomSize: "30m²",
            },
          ];

          const mockRoom = mockRooms.find((r) => r.id === roomId);
          if (mockRoom) {
            setRoom(mockRoom);
          } else {
            throw new Error("Room not found");
          }
          return;
        }

        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room details:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!room) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RoomDetail room={room} />
            <RoomReviews roomId={roomId} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RoomBookingForm room={room} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
