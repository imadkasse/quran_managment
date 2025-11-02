"use client";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  // const fadeInUp = {
  //   initial: { opacity: 0, y: 60 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.6 },
  // };

  // const staggerContainer = {
  //   animate: {
  //     transition: {
  //       staggerChildren: 0.1,
  //     },
  //   },
  // };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              مدرسة النور القرآنية
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-foreground hover:text-primary transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="#features"
              className="text-foreground hover:text-primary transition-colors"
            >
              المميزات
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              من نحن
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              تواصل معنا
            </a>
          </div>

          <div className="hidden md:block">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={() => {
                router.push("/login");
              }}
            >
              انضم الآن
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col gap-4">
              <a
                href="#home"
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                الرئيسية
              </a>
              <a
                href="#features"
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                المميزات
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                من نحن
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                تواصل معنا
              </a>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                انضم الآن
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
