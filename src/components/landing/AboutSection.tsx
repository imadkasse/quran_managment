"use client";
import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export const AboutSection = () => (
  <section id="about" className="py-20 px-4 bg-muted/30">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative w-full h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(var(--secondary-rgb),0.1),transparent_50%)]"></div>
            <Award className="w-48 h-48 text-secondary/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-right"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            رؤيتنا ورسالتنا
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              نسعى في مدرسة النور القرآنية إلى إعداد جيل متقن للقرآن الكريم،
              يحفظه ويتدبره ويعمل بأحكامه.
            </p>
            <p>
              نؤمن بأن تعليم القرآن الكريم ليس مجرد حفظ، بل هو رحلة روحانية تبني
              شخصية المسلم وتقوي صلته بربه.
            </p>
            <p>
              من خلال برامجنا المتميزة ومعلمينا المؤهلين، نوفر بيئة تعليمية
              محفزة تساعد كل طالب على تحقيق أهدافه القرآنية.
            </p>
          </div>
          <div className="mt-8 flex gap-4 justify-end">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">طالب وطالبة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">معلم ومعلمة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">سنوات خبرة</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
