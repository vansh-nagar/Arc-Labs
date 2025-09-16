import Side_bar from "@/components/pages/dashboard/sidebar/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Side_bar />
      {children}
    </div>
  );
}
