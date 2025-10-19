"use client";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export const HeroSection = () => (
  <section
    id="home"
    className="min-h-screen flex items-center justify-center pt-20 px-4 bg-gradient-to-b from-background to-muted/30"
  >
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-right"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            مدرسة النور القرآنية
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            رحلتك نحو إتقان القرآن الكريم تبدأ هنا
            <br />
            تعلم، احفظ، وأتقن مع نخبة من المعلمين المؤهلين
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            >
              ابدأ التعلم الآن
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
            <BookOpen className="w-48 h-48 text-primary/30" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
