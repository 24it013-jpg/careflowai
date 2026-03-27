import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingDown,
    ExternalLink,
    MapPin,
    ArrowUpDown,
    Filter,
    Store,
    ShoppingBag,
    Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface PharmacyPrice {
    pharmacy: string;
    price: number;
    distance?: number;
    inStock: boolean;
    lastUpdated: Date;
    url?: string;
}

interface PricingComparisonProps {
    medicationName: string;
    prices: PharmacyPrice[];
    genericPrice?: number;
    onViewCoupon?: (pharmacy: string) => void;
}

export function PricingComparison({
    medicationName,
    prices,
    genericPrice,
    onViewCoupon
}: PricingComparisonProps) {
    const [sortKey, setSortKey] = useState<'price' | 'distance'>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterStock, setFilterStock] = useState(false);

    const sortedPrices = [...prices]
        .filter(p => !filterStock || p.inStock)
        .sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            if (sortKey === 'price') return (a.price - b.price) * multiplier;
            if (sortKey === 'distance') return ((a.distance || 0) - (b.distance || 0)) * multiplier;
            return 0;
        });

    const bestPrice = Math.min(...prices.map(p => p.price));
    const averagePrice = prices.reduce((acc, curr) => acc + curr.price, 0) / prices.length;
    const potentialSavings = Math.max(...prices.map(p => p.price)) - bestPrice;

    const toggleSort = (key: 'price' | 'distance') => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-teal-100 shadow-lg">
            <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-teal-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Store className="w-5 h-5 text-teal-600" />
                            Pricing Comparison: {medicationName}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Prices near you (within 10 miles)
                        </p>
                    </div>

                    {potentialSavings > 0 && (
                        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                            <TrendingDown className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Potential Savings</p>
                                <p className="text-lg font-bold text-green-700">${potentialSavings.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSort('price')}
                        className={sortKey === 'price' ? 'bg-teal-50 border-teal-200 text-teal-700' : ''}
                    >
                        Price <ArrowUpDown className="w-3 h-3 ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSort('distance')}
                        className={sortKey === 'distance' ? 'bg-teal-50 border-teal-200 text-teal-700' : ''}
                    >
                        Distance <ArrowUpDown className="w-3 h-3 ml-2" />
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStock(!filterStock)}>
                            {filterStock && <Check className="w-4 h-4 mr-2" />}
                            In Stock Only
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pharmacy</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Distance</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {sortedPrices.map((price, index) => (
                                <motion.tr
                                    key={price.pharmacy}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-slate-50 transition-colors"
                                >
                                    <TableCell className="font-medium text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                                            {price.pharmacy}
                                            {price.price === bestPrice && (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-[10px] ml-2">
                                                    Best Price
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-700">
                                        ${price.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-500">
                                        <div className="flex items-center justify-end gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {price.distance?.toFixed(1)} mi
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {price.inStock ? (
                                            <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">In Stock</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50">Out of Stock</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                            onClick={() => onViewCoupon?.(price.pharmacy)}
                                        >
                                            Get Coupon <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {genericPrice && genericPrice < averagePrice && (
                <div className="p-4 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-yellow-800">Generic Option Available</p>
                        <p className="text-xs text-yellow-700">Estimated price: ${genericPrice.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                        View Generic
                    </Button>
                </div>
            )}
        </Card>
    );
}
