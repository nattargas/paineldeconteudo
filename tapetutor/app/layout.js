import "./globals.css";

export const metadata = {
  title: "TapeTutor IA",
  description: "Tutor da técnica de tape para unha encravada",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
