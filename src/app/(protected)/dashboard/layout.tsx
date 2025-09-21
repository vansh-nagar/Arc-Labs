import Side_bar from "@/components/pages/dashboard/sidebar/sidebar";
import Top_bar from "@/components/pages/dashboard/topbar/top-bar";
import { Providers } from "@/components/pages/session-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Top_bar />
      <Side_bar />
      <Providers>{children}</Providers>
    </div>
  );
}
