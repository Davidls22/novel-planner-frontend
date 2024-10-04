"use client";
import './globals.css';
import Header from './components/Header'; 
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa"; // Import icons

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const noHeaderRoutes = ['/', '/login', '/register'];
  const shouldShowHeader = isAuthenticated && !noHeaderRoutes.includes(pathname);
  const isDashboard = pathname === "/dashboard";

  // Check if the user is authenticated by checking the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        {shouldShowHeader && <Header />}
        {!isDashboard && isAuthenticated && (
          <div className="p-4 flex items-center space-x-4"> {/* Flexbox for layout */}
            <button className="btn btn-outline mb-4 flex items-center space-x-2" onClick={() => router.back()}>
              <FaArrowLeft /> {/* Back icon */}
            </button>
            <button className="btn btn-outline mb-4 flex items-center space-x-2" onClick={() => router.push('/dashboard')}>
              <FaHome /> {/* Home icon */}
            </button>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}