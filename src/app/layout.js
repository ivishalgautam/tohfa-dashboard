"use client";
import Layout from "@/components/Layout";
import { AllRoutes } from "@/data/sidebarData";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Context from "@/store/context";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
        queryCache: new QueryCache({
          onError: (error, query) => {
            // 🎉 only show error toasts if we already have data in the cache
            // which indicates a failed background update
            if (query.state.data !== undefined) {
            }
          },
        }),
      },
    },
  });
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);

    if (pathname === "/login" || pathname === "/signup") {
      return;
    }

    // Find the current route in the AllRoutes array

    const currentRoute = AllRoutes?.find(
      (route) => route.link === pathname.replace(id, "[id]")
    );
    //  || route.link.includes(router.pathname)
    // If the current route is not found in the array or the user's role is not allowed for this route
    if (!currentRoute || !currentRoute?.roles?.includes(currentUser?.role)) {
      router.replace("/unauthorized");
    }
  }, [pathname]);

  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (["/login", "/signup", "/unauthorized"].includes(pathname)) {
      return children;
    }

    return (
      <Context>
        <Layout>{children}</Layout>
      </Context>
    );
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={GeistSans.className}>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors />
          {getContent()}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
