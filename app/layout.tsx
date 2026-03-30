import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '날씨 앱',
  description: '도시 이름으로 현재 날씨를 확인하세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
