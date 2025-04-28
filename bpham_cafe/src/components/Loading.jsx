"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CoffeeAnimation() {
  const [isPouring, setIsPouring] = useState(true);

  // Automatically restart the pouring animation every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPouring(false);
      setTimeout(() => setIsPouring(true), 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Colors
  const darkBrown = "#3A2618";
  const mediumBrown = "#8B5A2B";
  const lightBrown = "#C69C6D";
  const cream = "#F5E8C7";

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background circle */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: cream }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
        }}
      />

      {/* Coffee cup container - perfectly centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
        {/* Enhanced Steam - more visible and prominent */}
        <div
          className="absolute top-0 w-full flex justify-center"
          style={{ zIndex: 10 }}
        >
          {/* Main steam columns */}
          {[0, 1, 2].map((i) => (
            <div key={`steam-column-${i}`} className="relative mx-1">
              {/* Multiple steam particles per column for fuller effect */}
              {[...Array(3)].map((_, j) => (
                <motion.div
                  key={`steam-${i}-${j}`}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: "white",
                    width: `${6 - i * 0.8}px`,
                    height: `${14 - i * 1.5}px`,
                    left: `${(j - 1) * 4}px`,
                    filter: "blur(2px)",
                    boxShadow: "0 0 5px 2px rgba(255,255,255,0.5)",
                  }}
                  animate={{
                    y: [-5, -25, -40],
                    opacity: [0, 0.9, 0],
                    x: [(j - 1) * 3, (j - 1) * 6 + i * 2, (j - 1) * 9 + i * 3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2.5 + j * 0.2,
                    delay: i * 0.2 + j * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          ))}

          {/* Additional wispy steam particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`wisp-${i}`}
              className="absolute rounded-full"
              style={{
                backgroundColor: "white",
                width: `${3 - Math.random() * 1.5}px`,
                height: `${8 - Math.random() * 3}px`,
                left: `${30 + Math.random() * 40}%`,
                filter: "blur(1.5px)",
                opacity: 0.7,
              }}
              animate={{
                y: [-2, -15 - Math.random() * 15],
                opacity: [0, 0.7, 0],
                x: [Math.random() * 10 - 5, Math.random() * 20 - 10],
                rotate: [0, Math.random() * 90 - 45],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5 + Math.random() * 1,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Saucer - perfectly centered */}
        <motion.div
          className="absolute w-40 h-5 rounded-full"
          style={{
            backgroundColor: "white",
            bottom: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        />

        {/* Cup body - perfectly centered */}
        <motion.div
          className="absolute w-32 h-28 rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "white",
            bottom: "20px",
            borderRadius: "16px 16px 50% 50% / 16px 16px 30px 30px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
          }}
        >
          {/* Coffee liquid filling animation */}
          <motion.div
            className="absolute bottom-0 left-0 w-full"
            style={{
              backgroundColor: mediumBrown,
              borderRadius: "0 0 40px 40px",
            }}
            initial={{ height: 0 }}
            animate={{
              height: isPouring ? [0, "100%"] : 0,
            }}
            transition={{
              duration: 2.5,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 1],
            }}
          />

          {/* Coffee surface ripple effect */}
          {isPouring && (
            <motion.div
              className="absolute w-full h-3 left-0"
              style={{
                backgroundColor: darkBrown,
                opacity: 0.3,
                bottom: "100%",
              }}
              animate={{
                bottom: ["100%", "0%"],
                opacity: [0, 0.3, 0],
                scale: [0.8, 1, 1.1, 1],
              }}
              transition={{
                bottom: {
                  duration: 2.5,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: 2.5,
                  times: [0, 0.8, 1],
                },
                scale: {
                  duration: 0.5,
                  repeat: 5,
                  repeatType: "reverse",
                },
              }}
            />
          )}

          {/* Coffee bubbles */}
          {isPouring && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: lightBrown,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 80 + 10}%`,
                    opacity: 0.6,
                  }}
                  initial={{
                    bottom: "0%",
                    scale: 0,
                  }}
                  animate={{
                    bottom: ["0%", `${Math.random() * 30 + 60}%`],
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: 1 + i * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Cup rim highlight */}
        <motion.div
          className="absolute w-32 h-4 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
            bottom: "44px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />
      </div>
    </div>
  );
}
