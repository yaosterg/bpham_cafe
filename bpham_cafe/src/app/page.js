"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  ShoppingBag,
  Search,
  Menu,
  ArrowRight,
  Heart,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Quicksand } from "next/font/google";

// Initialize Quicksand font
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

// Custom Button component
const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const popUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export default function BrianCoffee() {
  // Custom animation hook
  function useAnimateInView() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    return [ref, isInView];
  }

  const [featuredRef, featuredInView] = useAnimateInView();
  const [aboutRef, aboutInView] = useAnimateInView();
  const [testimonialRef, testimonialInView] = useAnimateInView();
  const [contactRef, contactInView] = useAnimateInView();
  const [newsletterRef, newsletterInView] = useAnimateInView();

  // Animated Coffee Component
  const AnimatedCoffee = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Coffee Cup */}
          <motion.svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Saucer */}
            <motion.ellipse
              cx="100"
              cy="170"
              rx="70"
              ry="15"
              fill="#E9DCC9"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            />

            {/* Cup */}
            <motion.g
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              {/* Cup Body */}
              <motion.path
                d="M60,70 L60,140 C60,155 80,165 100,165 C120,165 140,155 140,140 L140,70 Z"
                fill="white"
                stroke="#E9DCC9"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Cup Handle */}
              <motion.path
                d="M140,90 C160,90 170,100 170,115 C170,130 160,140 140,140"
                fill="transparent"
                stroke="#E9DCC9"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />

              {/* Coffee Liquid */}
              <motion.path
                d="M65,80 L135,80 L135,135 C135,145 120,155 100,155 C80,155 65,145 65,135 Z"
                fill="#A67C52"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />

              {/* Coffee Surface */}
              <motion.ellipse
                cx="100"
                cy="80"
                rx="35"
                ry="10"
                fill="#8A6642"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              />

              {/* Latte Art - Heart */}
              <motion.path
                d="M90,75 C90,65 110,65 110,75 L100,85 Z"
                fill="white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
              />
            </motion.g>

            {/* Steam */}
            <motion.g>
              <motion.path
                d="M85,60 C85,50 75,45 75,35 C75,25 85,20 85,10"
                fill="transparent"
                stroke="#E9DCC9"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  times: [0, 0.5, 1],
                }}
              />
              <motion.path
                d="M100,55 C100,45 110,40 110,30 C110,20 100,15 100,5"
                fill="transparent"
                stroke="#E9DCC9"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: 0.5,
                  times: [0, 0.5, 1],
                }}
              />
              <motion.path
                d="M115,60 C115,50 125,45 125,35 C125,25 115,20 115,10"
                fill="transparent"
                stroke="#E9DCC9"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: 1,
                  times: [0, 0.5, 1],
                }}
              />
            </motion.g>

            {/* Coffee Beans */}
            <motion.g>
              {/* Bean 1 */}
              <motion.ellipse
                cx="50"
                cy="190"
                rx="15"
                ry="8"
                fill="#8A6642"
                transform="rotate(-30, 50, 190)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
              />
              {/* Bean 2 */}
              <motion.ellipse
                cx="150"
                cy="185"
                rx="15"
                ry="8"
                fill="#8A6642"
                transform="rotate(30, 150, 185)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.4, duration: 0.5 }}
              />
              {/* Bean 3 */}
              <motion.ellipse
                cx="30"
                cy="160"
                rx="12"
                ry="7"
                fill="#A67C52"
                transform="rotate(15, 30, 160)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6, duration: 0.5 }}
              />
              {/* Bean 4 */}
              <motion.ellipse
                cx="170"
                cy="160"
                rx="12"
                ry="7"
                fill="#A67C52"
                transform="rotate(-15, 170, 160)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              />
            </motion.g>
          </motion.svg>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#FAF3E8] ${quicksand.variable}`}
      style={{ fontFamily: "var(--font-quicksand, sans-serif)" }}
    >
      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FAF3E8]/90 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/dashboard">
              {" "}
              <span className="text-lg text-[#A67C52] tracking-tight font-medium">
                BP.HAM Cafe
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Menu", "About", "Contact"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-[#7D6E63] hover:text-[#A67C52] text-sm"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {[Search, ShoppingBag].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="h-4 w-4 text-[#7D6E63] hover:text-[#A67C52] cursor-pointer" />
              </motion.div>
            ))}
            <Menu className="h-5 w-5 text-[#7D6E63] md:hidden" />
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24" id="home">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            <motion.div
              className="md:w-1/2 space-y-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block bg-[#E9DCC9] text-[#A67C52] px-3 py-1 rounded-full text-xs mb-4"
                >
                  ☕ Now Open 7am-7pm
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#5C4738] leading-tight">
                  A <span className="text-[#A67C52]">cozy</span> little break in
                  your day
                </h1>
              </motion.div>
              <motion.p
                variants={fadeIn}
                className="text-[#7D6E63] max-w-md text-sm md:text-base"
              >
                Handcrafted coffee and homemade pastries in our adorable space
                designed for comfort and smiles.
              </motion.p>
              <motion.div variants={fadeIn} className="pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/order">
                    <Button className="bg-[#A67C52] hover:bg-[#8A6642] text-white rounded-full px-6 h-10 shadow-md">
                      Order!
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="w-full max-w-md h-[400px] relative">
                <AnimatedCoffee />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <motion.section
        id="menu"
        className="py-16 md:py-24 bg-white rounded-t-[40px]"
        ref={featuredRef}
        initial="hidden"
        animate={featuredInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-medium text-[#5C4738]">
                Our Specialties
              </h2>
              <p className="text-[#7D6E63] text-sm mt-2">
                Crafted with care, served with love
              </p>
            </div>
            <Link
              href="#"
              className="text-[#A67C52] text-sm flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Caramel Macchiato",
                price: "$4.50",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.9,
              },
              {
                name: "Matcha Latte",
                price: "$5.25",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.7,
              },
              {
                name: "Mocha",
                price: "$4.75",
                image: "/placeholder.svg?height=400&width=400",
                rating: 4.8,
              },
            ].map((item, index) => (
              <motion.div key={index} className="group" variants={popUp}>
                <div className="relative aspect-square w-full overflow-hidden mb-4 bg-[#FAF3E8] rounded-3xl shadow-sm">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <motion.div
                    className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-sm flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Star className="h-3 w-3 text-[#E6B325] fill-[#E6B325]" />
                    <span className="text-xs text-[#5C4738]">
                      {item.rating}
                    </span>
                  </motion.div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-[#5C4738] font-medium">{item.name}</h3>
                  <span className="text-[#A67C52] font-medium">
                    {item.price}
                  </span>
                </div>
                <motion.button
                  className="mt-2 text-sm text-[#7D6E63] hover:text-[#A67C52] flex items-center gap-1"
                  whileHover={{ x: 5 }}
                >
                  Add to cart <ArrowRight className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-16 md:py-24 bg-[#FAF3E8]"
        ref={aboutRef}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div variants={fadeIn} className="md:w-1/2">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Coffee brewing process"
                  fill
                  className="object-cover"
                />
                <motion.div
                  className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-md"
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Coffee className="h-6 w-6 text-[#A67C52]" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="md:w-1/2 space-y-6 mt-8 md:mt-0"
            >
              <h2 className="text-2xl md:text-3xl font-medium text-[#5C4738]">
                Our Story
              </h2>
              <p className="text-[#7D6E63] text-sm md:text-base">
                Founded in 2020, Brian Coffee was born from a passion for
                quality coffee and creating cute, cozy spaces. We believe in
                bringing joy to your day through delightful drinks and a
                cheerful atmosphere.
              </p>
              <p className="text-[#7D6E63] text-sm md:text-base">
                Every bean is ethically sourced and carefully roasted to bring
                out its unique character. Our adorable approach extends from our
                interior design to our menu—focusing on quality and happiness.
              </p>
              <div className="pt-2">
                <motion.div whileHover={{ x: 5 }}>
                  <Link
                    href="#"
                    className="text-[#A67C52] text-sm flex items-center gap-1 hover:underline"
                  >
                    Learn more about our process{" "}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section
        className="py-16 md:py-24 bg-white rounded-t-[40px]"
        ref={testimonialRef}
        initial="hidden"
        animate={testimonialInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-[#E9DCC9] text-[#A67C52] px-3 py-1 rounded-full text-xs mb-4"
          >
            ❤️ Customer Love
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-medium text-[#5C4738] mb-8">
            What Our Customers Say
          </h2>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-[#FAF3E8] p-8 rounded-3xl shadow-md relative"
          >
            <blockquote className="text-[#7D6E63] text-lg md:text-xl italic">
              "The cutest coffee shop I've ever been to! The latte art made my
              day, and the atmosphere is so cheerful and welcoming."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#E9DCC9] flex items-center justify-center">
                <span className="text-[#A67C52] font-medium">E</span>
              </div>
              <p className="text-[#A67C52] font-medium">
                Emma, Regular Customer
              </p>
            </div>
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 5,
                duration: 1,
              }}
            >
              <div className="bg-white h-8 w-8 rounded-full shadow-md flex items-center justify-center">
                <Heart className="h-4 w-4 text-[#A67C52] fill-[#A67C52]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Location */}
      <motion.section
        id="contact"
        className="py-16 md:py-24 bg-[#FAF3E8]"
        ref={contactRef}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div variants={fadeIn} className="md:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-medium text-[#5C4738]">
                Visit Us
              </h2>
              <div className="space-y-6">
                <motion.div
                  className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-4"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-[#E9DCC9] p-2 rounded-xl">
                    <MapPin className="h-5 w-5 text-[#A67C52]" />
                  </div>
                  <div>
                    <h3 className="text-[#A67C52] font-medium mb-1">Address</h3>
                    <p className="text-[#7D6E63] text-sm">
                      123 Cute Street, Cityville
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-4"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-[#E9DCC9] p-2 rounded-xl">
                    <Clock className="h-5 w-5 text-[#A67C52]" />
                  </div>
                  <div>
                    <h3 className="text-[#A67C52] font-medium mb-1">Hours</h3>
                    <p className="text-[#7D6E63] text-sm">
                      Monday–Friday: 7am–7pm
                    </p>
                    <p className="text-[#7D6E63] text-sm">
                      Saturday–Sunday: 8am–6pm
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-4"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-[#E9DCC9] p-2 rounded-xl">
                    <Coffee className="h-5 w-5 text-[#A67C52]" />
                  </div>
                  <div>
                    <h3 className="text-[#A67C52] font-medium mb-1">Contact</h3>
                    <p className="text-[#7D6E63] text-sm">
                      hello@briancoffee.com
                    </p>
                    <p className="text-[#7D6E63] text-sm">+1 (555) 123-4567</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Map location"
                  fill
                  className="object-cover"
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <div className="bg-[#A67C52] h-6 w-6 rounded-full flex items-center justify-center">
                    <div className="bg-white h-2 w-2 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section
        className="py-16 md:py-24 bg-[#E9DCC9] rounded-t-[40px]"
        ref={newsletterRef}
        initial="hidden"
        animate={newsletterInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium text-[#5C4738] mb-4">
              Stay Connected
            </h2>
            <p className="text-[#7D6E63] text-sm mb-8">
              Subscribe to our newsletter for updates, special offers, and
              coffee wisdom.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm border-2 border-white rounded-full focus:outline-none focus:border-[#A67C52]"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-[#A67C52] hover:bg-[#8A6642] text-white rounded-full px-6 h-12 shadow-md w-full sm:w-auto">
                Subscribe
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="flex items-center gap-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Coffee className="h-4 w-4 text-[#A67C52]" />
                <span className="text-[#A67C52] font-medium">Brian Coffee</span>
              </motion.div>
              <p className="text-[#7D6E63] text-sm max-w-xs">
                A cute coffee experience focused on quality and bringing smiles
                to your day.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Menu",
                  links: ["Coffee", "Tea", "Pastries"],
                },
                {
                  title: "Company",
                  links: ["About", "Careers", "Contact"],
                },
                {
                  title: "Follow",
                  links: ["Instagram", "Twitter", "Facebook"],
                },
              ].map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <h3 className="text-[#5C4738] font-medium mb-4 text-sm">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {section.links.map((link, j) => (
                      <motion.li key={link} whileHover={{ x: 5 }}>
                        <Link
                          href="#"
                          className="text-[#7D6E63] hover:text-[#A67C52]"
                        >
                          {link}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="border-t border-[#E9DCC9] mt-12 pt-8 text-center text-[#7D6E63] text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>
              © {new Date().getFullYear()} Brian Coffee. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
