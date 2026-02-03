import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const PublicLayout = ({ children, hideFooter = false }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
