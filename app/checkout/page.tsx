"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, differenceInDays } from "date-fns"
import { vi } from "date-fns/locale"
import { CreditCard, Landmark, Wallet } from "lucide-react"

// Mock room data
const mockRooms = [
  {
    id: 1,
    name: "Phòng Deluxe",
    price: 1200000,
    image: "/penthouse-suite-vista.png",
  },
  {
    id: 2,
    name: "Phòng Superior",
    price: 950000,
    image: "/mountain-view-balcony.png",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const roomId = Number.parseInt(searchParams.get("roomId") || "1")
  const checkInStr = searchParams.get("checkIn") || ""
  const checkOutStr = searchParams.get("checkOut") || ""
  const guests = Number.parseInt(searchParams.get("guests") || "1")

  const room = mockRooms.find((r) => r.id === roomId) || mockRooms[0]
  const checkIn = checkInStr ? new Date(checkInStr) : new Date()
  const checkOut = checkOutStr ? new Date(checkOutStr) : new Date()
  const nights = differenceInDays(checkOut, checkIn) || 1

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    specialRequests: "",
    saveInfo: true,
    paymentMethod: "card",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const calculateTotalPrice = () => {
    return room.price * nights
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      saveInfo: checked,
    })
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Lấy bookingId từ URL parameters
      const bookingId = searchParams.get("bookingId")

      // Chuẩn bị dữ liệu thanh toán
      const paymentData = {
        bookingId,
        amount: calculateGrandTotal(),
        paymentMethod: formData.paymentMethod,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
      }

      // Gửi request đến Payment Service
      const response = await fetch("http://localhost:8082/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error("Payment failed")
      }

      const data = await response.json()

      // Chuyển hướng đến trang xác nhận đặt phòng
      router.push(`/booking-confirmation?bookingId=${bookingId}&paymentId=${data.id}`)
    } catch (error) {
      console.error("Payment error:", error)
      // Hiển thị thông báo lỗi cho người dùng
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                  <CardDescription>Vui lòng nhập thông tin của bạn để hoàn tất đặt phòng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Yêu cầu đặc biệt (không bắt buộc)</Label>
                    <Input
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="saveInfo" checked={formData.saveInfo} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="saveInfo">Lưu thông tin này cho lần sau</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <CardDescription>Chọn phương thức thanh toán bạn muốn sử dụng</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Thẻ tín dụng</span>
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        <span>Chuyển khoản</span>
                      </TabsTrigger>
                      <TabsTrigger value="wallet" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Ví điện tử</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Tên chủ thẻ</Label>
                        <Input id="cardName" placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Ngày hết hạn</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="pt-4">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Thông tin chuyển khoản</h3>
                          <p className="text-sm text-muted-foreground">Ngân hàng: Vietcombank</p>
                          <p className="text-sm text-muted-foreground">Số tài khoản: 1234567890</p>
                          <p className="text-sm text-muted-foreground">Chủ tài khoản: CÔNG TY TNHH KHÁCH SẠN ABC</p>
                          <p className="text-sm text-muted-foreground">
                            Nội dung: [Họ tên] - [Số điện thoại] - Đặt phòng
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sau khi chuyển khoản, vui lòng chụp ảnh biên lai và gửi qua email hoặc số điện thoại của chúng
                          tôi.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="wallet" className="pt-4">
                      <RadioGroup defaultValue="momo">
                        <div className="flex items-center space-x-2 mb-4">
                          <RadioGroupItem value="momo" id="momo" />
                          <Label htmlFor="momo">MoMo</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <RadioGroupItem value="zalopay" id="zalopay" />
                          <Label htmlFor="zalopay">ZaloPay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vnpay" id="vnpay" />
                          <Label htmlFor="vnpay">VNPay</Label>
                        </div>
                      </RadioGroup>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất đặt phòng"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {guests} khách · {nights} đêm
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(checkIn, "dd/MM/yyyy", { locale: vi })} - {format(checkOut, "dd/MM/yyyy", { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {formatPrice(room.price)} x {nights} đêm
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <p>Miễn phí hủy phòng trước 3 ngày</p>
                <p>Bạn sẽ nhận được email xác nhận sau khi đặt phòng thành công</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
