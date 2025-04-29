"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, MapPin, Users, Clock } from "lucide-react"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId") || "123456789"

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Đặt phòng thành công!</h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã đặt phòng. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết đặt phòng</CardTitle>
              <CardDescription>Mã đặt phòng: {bookingId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Ngày nhận phòng</h3>
                      <p className="text-muted-foreground">15/05/2024, từ 14:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Ngày trả phòng</h3>
                      <p className="text-muted-foreground">18/05/2024, trước 12:00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Thời gian lưu trú</h3>
                      <p className="text-muted-foreground">3 đêm</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Địa chỉ</h3>
                      <p className="text-muted-foreground">
                        Khách sạn ABC
                        <br />
                        123 Đường XYZ, Quận 1<br />
                        Hà Nội, Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Thông tin phòng</h3>
                      <p className="text-muted-foreground">
                        Phòng Deluxe
                        <br />2 khách
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá phòng (3 đêm)</span>
                    <span>3.600.000 ₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế và phí</span>
                    <span>540.000 ₫</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Tổng cộng</span>
                    <span>4.140.000 ₫</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Vui lòng lưu lại mã đặt phòng để check-in nhanh chóng.</p>
                <p>
                  Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email support@hotelbooking.com hoặc số điện
                  thoại +84 123 456 789.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button asChild className="flex-1">
                  <Link href="/bookings">Xem đặt phòng của tôi</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Quay lại trang chủ</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
