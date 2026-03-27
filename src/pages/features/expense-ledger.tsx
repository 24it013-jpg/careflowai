import { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, TrendingDown,
    PieChart, Activity, Plus, Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import confetti from "canvas-confetti";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';

const MONTHLY_DATA = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 900 },
    { name: 'Mar', amount: 1600 },
    { name: 'Apr', amount: 1100 },
    { name: 'May', amount: 2100 },
    { name: 'Jun', amount: 1400 },
];

const CATEGORY_DATA = [
    { name: 'Consultations', value: 400, color: '#3b82f6' },
    { name: 'Medication', value: 300, color: '#10b981' },
    { name: 'Insurance', value: 300, color: '#8b5cf6' },
    { name: 'Labs', value: 200, color: '#f59e0b' },
];

const TRANSACTIONS = [
    { id: 1, title: "Dr. Smith Consultation", date: "Today, 10:30 AM", amount: -150.00, type: "expense" },
    { id: 2, title: "Pharmacy Purchase", date: "Yesterday, 4:15 PM", amount: -45.50, type: "expense" },
    { id: 3, title: "Insurance Claim Refund", date: "Jun 12, 2024", amount: +350.00, type: "income" },
    { id: 4, title: "MRI Scan (Co-pay)", date: "Jun 10, 2024", amount: -200.00, type: "expense" },
    { id: 5, title: "Lab Bloodwork", date: "Jun 05, 2024", amount: -85.00, type: "expense" },
];

export default function ExpenseLedger() {
    const [transactions, setTransactions] = useState(TRANSACTIONS);

    const handleAddExpense = () => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#3b82f6']
        });
        const newTx = {
            id: Date.now(),
            title: "New Mock Expense",
            date: "Just now",
            amount: -Math.floor(Math.random() * 100) - 10,
            type: "expense"
        };
        setTransactions([newTx, ...transactions]);
    };

    return (
        <div className="min-h-screen bg-[#050a08] text-white p-6 pb-24 space-y-8 font-sans selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full blur-[160px]" style={{background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[140px]" style={{background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                            <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                                <Wallet className="size-8" />
                            </span>
                            Health Finance Ledger
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Track Medical Expenses & Insurance Claims</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddExpense}
                            className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-600 text-white rounded-full px-8 h-12 text-lg shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] border-0 transition-all font-semibold hover:scale-105 active:scale-95"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Expense
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Monthly Trend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="premium-glass-panel rounded-[2rem] p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    Monthly Spending Trend
                                </h3>
                                <div className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">Last 6 Months</div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MONTHLY_DATA}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke="#666" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorAmount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Category Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="premium-glass-panel rounded-[2rem] p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <PieChart className="h-5 w-5 text-blue-500" />
                                    Expense Breakdown
                                </h3>
                            </div>
                            <div className="h-[300px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={CATEGORY_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {CATEGORY_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            formatter={(value) => <span className="text-slate-300 ml-2">{value}</span>}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Transactions List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="premium-glass-panel rounded-[2rem] p-8 flex flex-col h-full max-h-[800px]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Activity className="h-5 w-5 text-purple-500" />
                                Recent Activity
                            </h3>
                        </div>

                        <ScrollArea className="flex-1 -mr-4 pr-4">
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors group cursor-default"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-xl border border-white/5 backdrop-blur-sm",
                                                tx.type === 'income' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {tx.type === 'income' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{tx.title}</h4>
                                                <div className="text-xs text-slate-500">{tx.date}</div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "text-lg font-bold tabular-nums",
                                            tx.type === 'income' ? "text-emerald-400" : "text-slate-200"
                                        )}>
                                            {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center text-slate-400 mb-2">
                                <span className="text-sm font-medium">Total Balance Spent</span>
                                <span className="text-white text-3xl font-bold">$1,245.50</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-4">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[65%] shadow-[0_0_10px_theme(colors.emerald.500)]" />
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-right">65% of monthly budget utilized</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
