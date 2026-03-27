import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "Testimonials", id: "testimonials" },
];

export function FloatingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4"
        >
            <div className={`
                flex items-center justify-between px-6 py-3 rounded-[2rem] border transition-all duration-500
                ${scrolled
                    ? "premium-glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-black/40 border-white/10"
                    : "bg-white/5 backdrop-blur-md border-white/5"
                }
            `}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-400/40 transition-all duration-500" />
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all relative z-10">
                        <Heart className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">CAREflow</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="hover:text-white transition-colors relative group py-1"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300 ease-out" />
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="premium-button px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-4 p-6 rounded-[2rem] premium-glass-panel border-white/10 flex flex-col gap-4 shadow-2xl origin-top"
                >
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="text-left text-white/70 hover:text-white text-base font-medium py-3 border-b border-white/5 last:border-0 transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                    <Link to="/dashboard" className="mt-4">
                        <button className="premium-button w-full px-6 py-4 rounded-full border border-blue-500/30 bg-blue-600/80 backdrop-blur-md text-white text-base font-medium flex items-center justify-center gap-2">
                            Get Started Free
                        </button>
                    </Link>
                </motion.div>
            )}
        </motion.nav>
    );
}
