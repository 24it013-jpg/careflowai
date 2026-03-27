import { useEffect } from "react";
import { MonitorUp, ExternalLink, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoCallManagerProps {
    isCallActive: boolean;
    isWhiteboardOpen: boolean;
    isScreenSharing: boolean;
    callMethod: "jitsi" | "meet" | "whatsapp";
    onMethodChange: (method: "jitsi" | "meet" | "whatsapp") => void;
}

export function VideoCallManager({
    isCallActive,
    isWhiteboardOpen,
    isScreenSharing,
    callMethod,
    onMethodChange
}: VideoCallManagerProps) {
    // Jitsi Meet Integration
    useEffect(() => {
        if (isCallActive && callMethod === "jitsi" && !isWhiteboardOpen && !isScreenSharing) {
            // In a real app, we'd load the Jitsi External API script
            // For this demo, we'll use an iframe to the public Jitsi meet
            // which is more reliable for a demonstration
            const roomName = "CAREflowAI-Secure-Consultation-" + Math.random().toString(36).substring(7);
            const domain = "meet.jit.si";
            console.log(`Starting Jitsi call in room: ${roomName} on domain: ${domain}`);
        }
    }, [isCallActive, callMethod, isWhiteboardOpen, isScreenSharing]);

    if (!isCallActive) {
        return null;
    }

    return (
        <div className="w-full h-full relative bg-slate-100 flex flex-col">
            {/* Call Method Switcher Overlay (only visible when not in full jitsi) */}
            <div className="absolute top-20 left-6 z-30 flex flex-col gap-2">
                <Button
                    variant={callMethod === "jitsi" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onMethodChange("jitsi")}
                    className="rounded-full shadow-lg"
                >
                    <Video className="h-4 w-4 mr-2" />
                    Embedded Call
                </Button>
                <Button
                    variant={callMethod === "meet" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onMethodChange("meet")}
                    className="rounded-full shadow-lg"
                >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Meet
                </Button>
                <Button
                    variant={callMethod === "whatsapp" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onMethodChange("whatsapp")}
                    className="rounded-full shadow-lg"
                >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                </Button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {isWhiteboardOpen ? (
                    <div className="w-full h-full bg-white flex items-center justify-center">
                        {/* Whiteboard is handled by parent, but we can show a placeholder if needed */}
                        <div className="text-slate-400">Whiteboard Overlay Active</div>
                    </div>
                ) : isScreenSharing ? (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center p-8">
                        <div className="w-full h-full border-4 border-dashed border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center text-white gap-4 bg-slate-900/80">
                            <MonitorUp className="h-20 w-20 text-cyan-500" />
                            <div className="text-center">
                                <h4 className="text-2xl font-bold">Screen Share Active</h4>
                                <p className="text-slate-400 mt-2">Displaying patient records & imaging</p>
                            </div>
                        </div>
                    </div>
                ) : callMethod === "jitsi" ? (
                    <iframe
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        src={`https://meet.jit.si/CAREflowAI-Consultation-Demo#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`}
                        className="w-full h-full border-0"
                        title="Jitsi Meet"
                    />
                ) : callMethod === "meet" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 p-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
                            <img src="https://www.gstatic.com/meet/google_meet_primary_horizontal_2020q4_logo_be3f01bc7242133bc4e76092f6b450c2.png" alt="Google Meet" className="h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Switch to Google Meet</h3>
                        <p className="text-slate-500 mt-2 max-w-md">
                            Click the button below to open a secure Google Meet session in a new tab.
                        </p>
                        <Button
                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-full text-lg shadow-lg shadow-blue-200"
                            onClick={() => window.open("https://meet.google.com/new", "_blank")}
                        >
                            Open Google Meet
                        </Button>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 p-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-12 w-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Consult via WhatsApp</h3>
                        <p className="text-slate-500 mt-2 max-w-md">
                            Continue this consultation via WhatsApp Web for easier mobile integration.
                        </p>
                        <Button
                            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 h-12 rounded-full text-lg shadow-lg shadow-green-200"
                            onClick={() => window.open("https://wa.me/?text=Starting%20CAREflow%20Telehealth%20Consultation", "_blank")}
                        >
                            Open WhatsApp Web
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
