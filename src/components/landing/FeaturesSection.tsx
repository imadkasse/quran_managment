"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BookOpen, Users, Award, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export const FeaturesSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const features = [
    {
      icon: BookOpen,
      title: "تعليم التجويد",
      description: "تعلم أحكام التجويد والتلاوة الصحيحة على يد معلمين متخصصين",
    },
    {
      icon: Award,
      title: "برامج الحفظ",
      description: "برامج حفظ متدرجة ومنظمة تناسب جميع الأعمار والمستويات",
    },
    {
      icon: Users,
      title: "المتابعة الفردية",
      description: "متابعة شخصية لكل طالب لضمان التقدم والإتقان",
    },
    {
      icon: HeartHandshake,
      title: "المعلمون المؤهلون",
      description: "نخبة من المعلمين الحاصلين على إجازات في القراءات",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            لماذا تختار مدرستنا؟
          </h2>
          <p className="text-xl text-muted-foreground">
            نقدم لك أفضل تجربة تعليمية قرآنية
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-border hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-center text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
