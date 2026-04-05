import { useNavigate } from "react-router-dom";
import { Store, BarChart3, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import ModeToggle from "@/components/common/mode-toggle";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Manajemen Inventori",
      desc: "Pantau stok barang secara real-time dengan notifikasi otomatis.",
      icon: <Store className="w-6 h-6 text-primary" />,
    },
    {
      title: "Laporan Penjualan",
      desc: "Analisa keuntungan dan tren penjualan dengan grafik yang mudah dipahami.",
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
    },
    {
      title: "Transaksi Cepat",
      desc: "Proses pembayaran kilat untuk meningkatkan kepuasan pelanggan.",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
      title: "Keamanan Data",
      desc: "Seluruh data transaksi terenkripsi aman di cloud bersama Supabase.",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Store className="w-6 h-6" />
            </div>
            kasirKU
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Kelola Bisnis Lebih <span className="text-primary">Cerdas</span> &{" "}
            <span className="text-primary">Efisien</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solusi Kasir Digital (POS) modern untuk UMKM hingga bisnis skala
            besar. Cepat, aman, dan mudah digunakan di mana saja.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="px-8 gap-2"
            onClick={() => navigate("/login")}
          >
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground">
              Segala yang Anda butuhkan untuk mengembangkan bisnis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-background border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 kasirKU. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
