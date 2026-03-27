/// <reference types="@types/google.maps" />
import { useState, useEffect, useCallback } from "react";

import { motion } from "framer-motion";

import {
    MapPin, Navigation, Phone, Star,
    Search, Crosshair, Globe,
    AlertCircle, Activity, Info
} from "lucide-react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    InfoWindow,
    useMap,
    useMapsLibrary
} from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// Use environment variable for API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface Location {
    id: string;
    name: string;
    type: "clinic" | "hospital" | "pharmacy";
    distance: string;
    rating: number;
    isOpen: boolean;
    address: string;
    position: { lat: number; lng: number };
    isSpecialized?: boolean;
}

const mapId = "bf23528b18a224a1"; // Dark themed map ID

export default function NearbyCareLocator() {
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [symptomContext, setSymptomContext] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude 
                    };
                    setUserLocation(pos);
                    setCenter(pos);
                    setIsScanning(false);
                },
                () => {
                    toast.error("Location access denied. Using default location.");
                    setIsScanning(false);
                }
            );
        } else {
            setIsScanning(false);
        }
    }, []);

    const handleSearch = (results: Location[]) => {
        setLocations(results);
    };

    const handleGetDirections = (loc: Location) => {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#3b82f6', '#14b8a6']
        });
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + loc.address)}`, '_blank');
    };

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <div className="min-h-screen bg-[#020918] text-white/90 p-6 pb-24 space-y-8 font-sans selection:bg-blue-500/30 overflow-hidden relative">
                {/* Premium Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[130px] mix-blend-screen" />
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-teal-600/15 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"
                >
                    <div>
                        <h1 className="text-4xl font-light tracking-tight text-white flex items-center gap-3">
                            <span className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                <Globe className="size-6" />
                            </span>
                            Nearby Care Radar
                        </h1>
                        <p className="text-white/50 mt-2 text-lg font-light">
                            {symptomContext === "breathing problems" ? 
                                "Prioritizing Respiratory & Emergency Care" : 
                                "Locate Emergency & Specialist Services Instantly"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {symptomContext && (
                            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full animate-pulse border flex items-center gap-2">
                                <Activity className="h-3 w-3" />
                                Context: {symptomContext}
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-blue-400/50 hover:text-white"
                                    onClick={() => setSymptomContext("")}
                                >
                                    ×
                                </Button>
                            </Badge>
                        )}
                        <Button 
                            variant="outline" 
                            className={cn(
                                "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all",
                                symptomContext === "breathing problems" && "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            )}
                            onClick={() => setSymptomContext("breathing problems")}
                        >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Breathing Mode
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px] relative z-10">
                    {/* Map Area */}
                    <motion.div
                        className="lg:col-span-3 rounded-3xl overflow-hidden relative border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm group"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {!GOOGLE_MAPS_API_KEY ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-50 p-8 text-center">
                                <AlertCircle className="h-16 w-16 text-amber-500 mb-6" />
                                <h2 className="text-2xl font-medium text-white mb-2">API Key Required</h2>
                                <p className="text-white/60 max-w-md">
                                    Please add your Google Maps API Key to the <code className="bg-white/10 px-2 py-1 rounded">.env</code> file as 
                                    <code className="bg-white/10 px-2 py-1 rounded ml-1">VITE_GOOGLE_MAPS_API_KEY</code> to enable the Proximity Radar.
                                </p>
                            </div>
                        ) : (
                            <Map
                                mapId={mapId}
                                defaultCenter={center}
                                defaultZoom={14}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                className="w-full h-full"
                            >
                                <PlacesSearch 
                                    onResults={handleSearch} 
                                    symptomContext={symptomContext} 
                                    setIsSearching={setIsSearching}
                                />
                                
                                {locations.map((loc) => (
                                    <AdvancedMarker
                                        key={loc.id}
                                        position={loc.position}
                                        onClick={() => setSelectedLocation(loc)}
                                    >
                                        <div className={cn(
                                            "relative flex items-center justify-center p-2 rounded-full shadow-lg border transition-all duration-300 backdrop-blur-md",
                                            loc.isSpecialized ? "bg-blue-600/80 scale-125 border-blue-400 z-50 shadow-[0_0_20px_rgba(37,99,235,0.5)]" :
                                            loc.type === 'hospital' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                            loc.type === 'clinic' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                            'bg-teal-500/20 text-teal-400 border-teal-500/30',
                                            selectedLocation?.id === loc.id ? "scale-125 border-white ring-4 ring-white/10" : ""
                                        )}>
                                            {loc.isSpecialized ? <Activity className="h-5 w-5 text-white" /> : <MapPin className="h-5 w-5" />}
                                            {loc.isSpecialized && (
                                                <motion.div
                                                    className="absolute -inset-1 rounded-full border border-blue-400/50"
                                                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </div>
                                    </AdvancedMarker>
                                ))}

                                {userLocation && (
                                    <AdvancedMarker position={userLocation}>
                                        <div className="relative">
                                            <div className="h-8 w-8 bg-blue-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                                                <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                                            </div>
                                            <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping pointer-events-none" />
                                        </div>
                                    </AdvancedMarker>
                                )}

                                {selectedLocation && (
                                    <InfoWindow
                                        position={selectedLocation.position}
                                        onCloseClick={() => setSelectedLocation(null)}
                                    >
                                        <div className="p-2 min-w-[200px] text-zinc-900">
                                            <h3 className="font-bold text-sm mb-1">{selectedLocation.name}</h3>
                                            <p className="text-xs text-zinc-600 mb-2">{selectedLocation.address}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none text-[10px]">
                                                    {selectedLocation.type.toUpperCase()}
                                                </Badge>
                                                <Button 
                                                    size="sm" 
                                                    className="h-7 text-[10px] px-2"
                                                    onClick={() => handleGetDirections(selectedLocation)}
                                                >
                                                    Directions
                                                </Button>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Map>
                        )}

                        {/* Radar Controls overlay */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="rounded-full shadow-lg bg-black/50 text-white border border-white/10 hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md"
                                onClick={() => userLocation && setCenter(userLocation)}
                            >
                                <Crosshair className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Status Overlay */}
                        <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl">
                                <div className={cn("size-2 rounded-full animate-pulse", isSearching ? "bg-blue-500" : "bg-emerald-500")} />
                                <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
                                    {isSearching ? "Updating Targets..." : "Satellite Link Active"}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar List */}
                    <div className="premium-glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl h-[700px] border border-white/10 bg-black/40 backdrop-blur-xl">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                                <Input
                                    placeholder="Search facilities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 bg-black/20 border-white/10 rounded-xl text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 hover:bg-black/30 transition-all h-12"
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {isScanning || isSearching ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/40 font-mono text-sm">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                                        <p className="animate-pulse tracking-[0.2em]">ACQUIRING DATA...</p>
                                    </div>
                                ) : locations.length === 0 ? (
                                    <div className="text-center py-20 text-white/30 italic font-light">
                                        No facilities found in this sector.
                                    </div>
                                ) : (
                                    locations
                                        .filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((loc) => (
                                            <motion.div
                                                key={loc.id}
                                                layoutId={`card-${loc.id}`}
                                                onClick={() => {
                                                    setSelectedLocation(loc);
                                                    setCenter(loc.position);
                                                }}
                                                className={cn(
                                                    "p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group",
                                                    selectedLocation?.id === loc.id
                                                        ? "bg-white/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                                        : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10",
                                                    loc.isSpecialized && "border-blue-500/30"
                                                )}
                                            >
                                                {loc.isSpecialized && (
                                                    <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600/20 text-blue-400 text-[10px] font-mono border-l border-b border-blue-500/30 rounded-bl-xl flex items-center gap-1.5">
                                                        <Activity className="h-3 w-3" />
                                                        PRIORITY MATCH
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-3 relative z-10">
                                                    <h3 className={cn("font-medium pr-8 transition-colors", 
                                                        selectedLocation?.id === loc.id ? "text-white" : "text-white/90 group-hover:text-white"
                                                    )}>{loc.name}</h3>
                                                </div>
                                                
                                                <div className="flex items-center text-xs text-white/50 gap-2 mb-4 font-mono relative z-10">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{loc.distance}</span>
                                                    <span className="text-white/20">|</span>
                                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                    <span className="text-amber-400">{loc.rating || "N/A"}</span>
                                                </div>

                                                <div className="space-y-3 relative z-10">
                                                    {loc.isSpecialized && symptomContext === "breathing problems" && (
                                                        <div className="flex items-start gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-3">
                                                            <div className="mt-0.5"><Info className="h-3 w-3 text-blue-400" /></div>
                                                            <p className="text-[10px] text-blue-400/80 leading-relaxed font-light">
                                                                Equipped with 24/7 ICU & Respiratory Care units.
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex gap-3">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-9 text-xs rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400/30 transition-all duration-300 active:scale-[0.98]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleGetDirections(loc);
                                                            }}
                                                        >
                                                            <Navigation className="h-3 w-3 mr-2" />
                                                            Navigate
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-lg">
                                                            <Phone className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                {selectedLocation?.id === loc.id && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                                                )}
                                            </motion.div>
                                        ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </APIProvider>
    );
}

// Logic for searching places
function PlacesSearch({ onResults, symptomContext, setIsSearching }: { 
    onResults: (results: Location[]) => void; 
    symptomContext: string;
    setIsSearching: (val: boolean) => void;
}) {
    const map = useMap();
    const placesLib = useMapsLibrary("places");
    const [service, setService] = useState<google.maps.places.PlacesService | null>(null);


    useEffect(() => {
        if (!map || !placesLib) return;
        setService(new placesLib.PlacesService(map));
    }, [map, placesLib]);

    const performSearch = useCallback(() => {
        if (!service || !map) return;

        setIsSearching(true);
        const center = map.getCenter();
        if (!center) return;

        const request: google.maps.places.PlaceSearchRequest = {
            location: center,
            radius: 5000,
            type: 'hospital'
        };

        service.nearbySearch(request, (
            results: google.maps.places.PlaceResult[] | null, 
            status: google.maps.places.PlacesServiceStatus
        ) => {

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const formatted: Location[] = results.map((place: google.maps.places.PlaceResult) => {
                    const placePos = {
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0
                    };
                    
                    // Logic for specialization matching
                    let isSpecialized = false;
                    if (symptomContext === "breathing problems") {
                        const keywords = ["emergency", "hospital", "respiratory", "pulmonary", "specialist", "icu"];
                        const name = place.name?.toLowerCase() || "";
                        isSpecialized = keywords.some(k => name.includes(k)) || place.types?.includes("emergency_room") || false;
                    }

                    return {
                        id: place.place_id || Math.random().toString(),
                        name: place.name || "Unknown Facility",
                        type: place.types?.includes("pharmacy") ? "pharmacy" : 
                               place.types?.includes("hospital") ? "hospital" : "clinic",
                        distance: calculateDistance(
                            center.lat(), center.lng(),
                            placePos.lat, placePos.lng
                        ),
                        rating: place.rating || 0,
                        isOpen: place.opening_hours?.isOpen?.() ?? true,
                        address: place.vicinity || "Unknown Address",
                        position: placePos,
                        isSpecialized
                    };
                });
                
                // Sort specialized ones to the top
                formatted.sort((a, b) => (b.isSpecialized ? 1 : 0) - (a.isSpecialized ? 1 : 0));
                
                onResults(formatted);
                setIsSearching(false);
            } else {
                setIsSearching(false);
            }
        });
    }, [service, map, symptomContext, onResults, setIsSearching]);

    useEffect(() => {
        const timer = setTimeout(performSearch, 500);
        return () => clearTimeout(timer);
    }, [performSearch]);

    return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1) + " km";
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
