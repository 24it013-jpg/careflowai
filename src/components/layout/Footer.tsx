import { Github, Twitter, Linkedin, Heart, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "Integrations", href: "#" },
        { label: "Pricing", href: "#pricing" },
        { label: "Changelog", href: "#" },
    ],
    Company: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "HIPAA Compliance", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <Heart className="w-4 h-4 text-white fill-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                CAREflow AI
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Revolutionizing healthcare with AI-powered insights, real-time monitoring, and seamless patient care integration.
                        </p>

                        {/* Newsletter */}
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">Stay Updated</p>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-white/80 mb-4 text-sm uppercase tracking-widest">{category}</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        © 2026 CAREflow AI. All rights reserved. Built with ❤️ for better healthcare.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {[
                            { Icon: Twitter, href: "#" },
                            { Icon: Github, href: "#" },
                            { Icon: Linkedin, href: "#" },
                        ].map(({ Icon, href }, i) => (
                            <motion.a
                                key={i}
                                href={href}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-500 hover:text-white transition-all"
                            >
                                <Icon className="w-4 h-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
