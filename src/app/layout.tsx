import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Todo App", description: "Next.js + MongoDB" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          {children}
          </AuthProvider>
      </body>
    </html>
  );
}
