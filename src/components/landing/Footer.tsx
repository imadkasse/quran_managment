"use client";

import React from "react";

import { BookOpen, Facebook, Twitter, Instagram } from "lucide-react";

export const Footer = () => (
  <footer className="bg-card border-t border-border py-12 px-4">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="text-right  flex flex-col items-start">
          <div className="flex items-center gap-2 justify-end mb-4">
            <span className="text-lg font-bold text-foreground">
              مدرسة النور القرآنية
            </span>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            رحلتك نحو إتقان القرآن الكريم تبدأ هنا
          </p>
        </div>

        <div className="text-right">
          <h3 className="font-semibold text-foreground mb-4">روابط سريعة</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#home"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                الرئيسية
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                المميزات
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                من نحن
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>

        <div className="text-right">
          <h3 className="font-semibold text-foreground mb-4">البرامج</h3>
          <ul className="space-y-2">
            <li className="text-muted-foreground text-sm">تعليم التجويد</li>
            <li className="text-muted-foreground text-sm">حفظ القرآن</li>
            <li className="text-muted-foreground text-sm">دورات متخصصة</li>
            <li className="text-muted-foreground text-sm">برامج الإجازة</li>
          </ul>
        </div>

        <div className="text-right flex flex-col items-start">
          <h3 className="font-semibold text-foreground mb-4">تابعنا</h3>
          <div className="flex gap-3 justify-end">
            <a
              href="#"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-8 text-center">
        <p className="text-muted-foreground text-sm">
          © 2025 مدرسة النور القرآنية. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  </footer>
);
