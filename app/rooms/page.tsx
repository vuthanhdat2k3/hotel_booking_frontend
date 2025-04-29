import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RoomList } from "@/components/room-list"
import { RoomFilters } from "@/components/room-filters"

export default function RoomsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tìm kiếm phòng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <RoomFilters />
          </div>

          <div className="lg:col-span-3">
            <RoomList />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
