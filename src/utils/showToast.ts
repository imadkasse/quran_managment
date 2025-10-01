import { toast } from "sonner";

export default function showToast(
  type: "success" | "error" | "info",
  message: string
) {
  const toastStyles = {
    success: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
      border: "2px solid oklch(0.75 0.14 150)",
      boxShadow:
        "0 10px 25px -5px oklch(0.62 0.15 145 / 0.3), 0 10px 10px -5px oklch(0.62 0.15 145 / 0.2)",
      icon: "✅",
    },
    error: {
      background: "var(--destructive)",
      color: "white",
      border: "2px solid oklch(0.7 0.18 25)",
      boxShadow:
        "0 10px 25px -5px oklch(0.58 0.24 27.3 / 0.3), 0 10px 10px -5px oklch(0.58 0.24 27.3 / 0.2)",
    },
    info: {
      background: "var(--accent)",
      color: "var(--accent-foreground)",
      border: "2px solid oklch(0.8 0.12 150)",
      boxShadow:
        "0 10px 25px -5px oklch(0.75 0.12 150 / 0.3), 0 10px 10px -5px oklch(0.75 0.12 150 / 0.2)",
    },
  };

  const currentStyle = toastStyles[type];

  toast[type](message, {
    duration: 4000,
    position: "top-center",
    style: {
      background: currentStyle.background,
      color: currentStyle.color,
      border: currentStyle.border,
      borderRadius: "var(--radius)",
      boxShadow: currentStyle.boxShadow,
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: "500",
      
    },
    action: {
      label: "تراجع",
      onClick: () => console.log("Undo"),
     
    },
   
  });


}

