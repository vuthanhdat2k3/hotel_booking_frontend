"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Search, ShoppingBag, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      // Fetch thông tin người dùng từ token
      fetchUserInfo(token)
    }
  }, [])

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8083/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUserName(`${userData.firstName} ${userData.lastName}`)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUserName("")
    // Chuyển hướng về trang chủ
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/rooms"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Phòng
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liên hệ
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/bookings"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đặt phòng của tôi
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">HotelBooking</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <Link href="/rooms" className="text-sm font-medium transition-colors hover:text-primary">
            Phòng
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            Giới thiệu
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Liên hệ
          </Link>
          {isLoggedIn && (
            <Link href="/bookings" className="text-sm font-medium transition-colors hover:text-primary">
              Đặt phòng của tôi
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="ghost" size="icon" aria-label="Bookings">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName || "Tài khoản"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Thông tin cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings">Đặt phòng của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="default">Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
