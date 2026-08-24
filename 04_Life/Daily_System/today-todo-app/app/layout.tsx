import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今日烘焙单",
  description: "一份有小猫陪伴的轻量今日待办清单",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
