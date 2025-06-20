import "./globals.css";
import Navigation from "./components/common/Navigation";

export const metadata = {
  title: "Albums & Blogs App",
  description: "A simple app to browse albums and blogs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
