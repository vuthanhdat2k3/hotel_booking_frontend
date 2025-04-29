"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

// Mock data for testimonials
const mockTestimonials = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/confident-leader.png",
    rating: 5,
    comment: "Dịch vụ tuyệt vời, phòng sạch sẽ và nhân viên rất thân thiện. Tôi sẽ quay lại lần sau!",
    hotel: "Khách sạn Hà Nội Plaza",
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/confident-asian-professional.png",
    rating: 4,
    comment: "Vị trí thuận tiện, gần các điểm tham quan. Bữa sáng ngon và đa dạng.",
    hotel: "Khách sạn Đà Nẵng Riverside",
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/thoughtful-young-man.png",
    rating: 5,
    comment: "Phòng rộng rãi và thoải mái. View từ phòng rất đẹp, nhìn ra biển. Sẽ giới thiệu cho bạn bè!",
    hotel: "Khách sạn Nha Trang Seaview",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "/serene-gaze.png",
    rating: 4,
    comment: "Giá cả hợp lý cho chất lượng phòng. Nhân viên nhiệt tình hỗ trợ khi cần.",
    hotel: "Khách sạn Sài Gòn Central",
  },
]

export function Testimonials() {
  const [testimonials] = useState(mockTestimonials)

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.hotel}</p>
              </div>
            </div>
            <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
            <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
