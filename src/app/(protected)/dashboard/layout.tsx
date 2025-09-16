import Side_bar from "@/components/pages/dashboard/sidebar/sidebar";
import Top_bar from "@/components/pages/dashboard/topbar/top-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Top_bar />
      <Side_bar />

      {children}
    </div>
  );
}
