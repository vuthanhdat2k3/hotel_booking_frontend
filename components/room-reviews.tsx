"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    roomId: 1,
    name: "Nguyễn Văn A",
    avatar: "/confident-leader.png",
    rating: 5,
    date: "2023-10-15",
    comment:
      "Phòng rất sạch sẽ và thoải mái. Nhân viên thân thiện và nhiệt tình. Vị trí thuận tiện để đi tham quan các điểm du lịch. Tôi sẽ quay lại lần sau!",
  },
  {
    id: 2,
    roomId: 1,
    name: "Trần Thị B",
    avatar: "/confident-asian-professional.png",
    rating: 4,
    date: "2023-09-22",
    comment:
      "Phòng đẹp và thoáng mát. Tuy nhiên, hơi ồn vào buổi sáng do gần đường lớn. Nhưng nhìn chung là một trải nghiệm tốt.",
  },
  {
    id: 3,
    roomId: 2,
    name: "Lê Văn C",
    avatar: "/thoughtful-young-man.png",
    rating: 5,
    date: "2023-11-05",
    comment:
      "Phòng rộng rãi và thoải mái. View từ ban công rất đẹp, nhìn ra biển. Sẽ giới thiệu cho bạn bè!",
  },
];

interface RoomReviewsProps {
  roomId: number;
}

export function RoomReviews({ roomId }: RoomReviewsProps) {
  interface Review {
    id: number;
    roomId: number;
    name: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Thêm useEffect để fetch đánh giá từ API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Try to fetch from the API
        const response = await fetch(`/api/reviews/${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Fall back to mock data when API fails
        console.log("Using mock data as fallback");
        setReviews(mockReviews.filter((review) => review.roomId === roomId));
      }
    };

    fetchReviews();
  }, [roomId]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Điều chỉnh hàm handleSubmitReview
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.trim()) return;

    setIsSubmitting(true);

    try {
      // Gửi request đến Review Service
      const response = await fetch("http://localhost:8085/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token xác thực
        },
        body: JSON.stringify({
          roomId,
          rating: Number.parseInt(rating),
          comment: newReview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReviewData = await response.json();

      // Cập nhật UI với đánh giá mới
      setReviews([newReviewData, ...reviews]);
      setNewReview("");
      setRating("5");
    } catch (error) {
      console.error("Error submitting review:", error);
      // Hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Đánh giá ({reviews.length})</h2>

      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">Viết đánh giá</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block mb-2 text-sm font-medium">
              Đánh giá của bạn
            </label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="Chọn đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 sao - Xuất sắc</SelectItem>
                <SelectItem value="4">4 sao - Rất tốt</SelectItem>
                <SelectItem value="3">3 sao - Tốt</SelectItem>
                <SelectItem value="2">2 sao - Trung bình</SelectItem>
                <SelectItem value="1">1 sao - Kém</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="review" className="block mb-2 text-sm font-medium">
              Nhận xét của bạn
            </label>
            <Textarea
              id="review"
              placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !newReview.trim()}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </form>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{review.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có đánh giá nào cho phòng này.
        </div>
      )}
    </div>
  );
}
