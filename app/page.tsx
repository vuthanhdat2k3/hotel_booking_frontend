import { HotelSearch } from "@/components/hotel-search";
import { FeaturedRooms } from "@/components/featured-rooms";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <div
          className="h-[600px] bg-cover bg-center"
          style={{ backgroundImage: `url('/opulent-hotel-arrival.png')` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Tìm phòng khách sạn hoàn hảo
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-3xl">
            Đặt phòng dễ dàng với hệ thống đặt phòng trực tuyến của chúng tôi
          </p>
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-lg p-6">
            <HotelSearch />
          </div>
        </div>
      </div>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Phòng nổi bật</h2>
        <FeaturedRooms />
      </section>

      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Đánh giá từ khách hàng
          </h2>
          <Testimonials />
        </div>
      </section>

      <Footer />
    </main>
  );
}
