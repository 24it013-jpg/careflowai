import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, Layers, X, Info, RotateCcw, Scan, Zap, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Landmark {
    x: number;
    y: number;
    z: number;
}



interface Layer {
    id: string;
    label: string;
    color: string;
    active: boolean;
}

interface AnatomyInfo {
    name: string;
    type: "Bone" | "Artery" | "Vein" | "Muscle" | "Tendon" | "Nerve";
    description: string;
    function: string;
    clinical: string;
}

// ─── Anatomical Info Database (Expanded) ──────────────────────────────────────

const ANATOMY_DB: Record<string, AnatomyInfo> = {
    // --- Head / Skull ---
    frontal_bone: {
        name: "Frontal Bone",
        type: "Bone",
        description: "The flat bone that forms the forehead and the upper part of the eye sockets (orbits).",
        function: "Protects the frontal lobes of the brain and provides structural support for the face.",
        clinical: "Site of frontal sinus infections; vulnerable to high-impact trauma (Le Fort fractures).",
    },
    temporal_bone: {
        name: "Temporal Bone",
        type: "Bone",
        description: "Paired bones on the sides and base of the skull, housing the structures of the inner ear.",
        function: "Supports the temples and protects the organs of hearing and balance.",
        clinical: "Contains the mastoid process; common site for middle ear surgery access.",
    },
    mandible: {
        name: "Mandible (Jawbone)",
        type: "Bone",
        description: "The largest, strongest, and lowest bone in the human facial skeleton.",
        function: "Forms the lower jaw and holds the lower teeth in place. Essential for mastication (chewing).",
        clinical: "Commonly fractured in facial trauma; the pivot point for TMJ (Temporomandibular Joint) disorders.",
    },
    facial_artery: {
        name: "Facial Artery",
        type: "Artery",
        description: "A branch of the external carotid artery that winds over the mandible to supply the face.",
        function: "Provides oxygenated blood to the muscles and skin of the lips, nose, and cheeks.",
        clinical: "Used as a pulse point during anesthesia; crucial for planning facial reconstructive surgery.",
    },
    // --- Arm / Upper Extremity ---
    humerus: {
        name: "Humerus (Upper Arm Bone)",
        type: "Bone",
        description: "The long bone in the upper arm that runs from the shoulder to the elbow.",
        function: "Acts as a lever for the arm's powerful muscle groups, facilitating lifting and throwing.",
        clinical: "Mid-shaft fractures can damage the radial nerve, leading to 'wrist drop'.",
    },
    brachial_artery: {
        name: "Brachial Artery",
        type: "Artery",
        description: "The major blood vessel of the (upper) arm, continuing from the axillary artery.",
        function: "Main supply of blood to the arm and hand. It bifurcates into the radial and ulnar arteries at the elbow.",
        clinical: "Primary site for blood pressure measurement (using a sphygmomanometer).",
    },
    biceps_brachii: {
        name: "Biceps Brachii",
        type: "Muscle",
        description: "A large, two-headed muscle that lies on the front of the upper arm between the shoulder and the elbow.",
        function: "Primary flexor of the forearm at the elbow and a powerful supinator of the forearm.",
        clinical: "Rupture of the long head tendon causes a visible 'Popeye' deformity in the arm.",
    },
    // --- Hand (Existing) ---
    wrist: {
        name: "Distal Radioulnar Joint & Wrist",
        type: "Bone",
        description: "The wrist comprises eight carpal bones arranged in two rows, forming the radiocarpal and midcarpal joints.",
        function: "Enables flexion, extension, radial and ulnar deviation of the hand. Transmits forces between the forearm and hand.",
        clinical: "Common site for fractures (Colles' fracture) and carpal tunnel syndrome.",
    },
    ulnar_artery: {
        name: "Ulnar Artery",
        type: "Artery",
        description: "Larger of the two terminal branches of the brachial artery. Runs along the medial aspect of the forearm into the palm.",
        function: "Primary blood supply to the hand, forming the superficial palmar arch with branches supplying the fingers.",
        clinical: "Palpable at the wrist. Measured alongside radial artery in Allen's test to assess hand circulation.",
    },
    radial_artery: {
        name: "Radial Artery",
        type: "Artery",
        description: "Branch of the brachial artery running along the lateral forearm. Crosses the anatomical snuffbox to reach the palm.",
        function: "Forms the deep palmar arch. Standard site for pulse measurement and arterial blood gas sampling.",
        clinical: "The gold standard site for pulse oximetry and continuous arterial pressure monitoring in ICUs.",
    },
    metacarpal: {
        name: "Metacarpal Bones (I–V)",
        type: "Bone",
        description: "Five miniature long bones forming the palm of the hand, connecting the wrist to the proximal phalanges.",
        function: "Structural framework of the palm. Muscle attachment points for intrinsic hand muscles.",
        clinical: "4th/5th metacarpal fractures ('Boxer's fracture') are extremely common in emergency medicine.",
    },
    proximal_phalanx: {
        name: "Proximal Phalanges",
        type: "Bone",
        description: "The first and longest of three phalangeal bones in each finger, articulating with the metacarpal head proximally.",
        function: "Forms the MCP joint with the metacarpal. Primary attachment for extensor expansion and collateral ligaments.",
        clinical: "Fractures here can disrupt extensor mechanisms causing 'boutonnière' deformity if untreated.",
    },
    flexor_tendon: {
        name: "Flexor Digitorum Profundus",
        type: "Tendon",
        description: "Deep flexor tendon running through the carpal tunnel, splitting into four slips to each finger's distal phalanx.",
        function: "Flexes the distal interphalangeal (DIP) joint. Essential for grip strength and fine motor tasks.",
        clinical: "Avulsion ('jersey finger') is a common sports injury. Travels through fibro-osseous tunnels with vascular supply.",
    },
    digital_nerve: {
        name: "Proper Palmar Digital Nerves",
        type: "Nerve",
        description: "Terminal branches of the median and ulnar nerves running along the sides of each finger.",
        function: "Sensory innervation to fingertip pulp — the most sensitive region of the human body (260 touch receptors/cm²).",
        clinical: "Injuries cause permanent fingertip numbness affecting precision grip and tactile discrimination.",
    },
    palmar_vein: {
        name: "Palmar Venous Arch",
        type: "Vein",
        description: "Network of superficial veins draining the palm, communicating with dorsal digital veins.",
        function: "Returns deoxygenated blood from the hand to the cephalic and basilic veins of the forearm.",
        clinical: "Primary site for IV cannulation. Subcutaneous visibility aids venepuncture procedures.",
    },
    lumbrical: {
        name: "Lumbrical Muscles (I–IV)",
        type: "Muscle",
        description: "Four small intrinsic muscles arising from flexor digitorum profundus tendons in the palm.",
        function: "Flex the MCP joints while simultaneously extending the IP joints — essential for writing and pinching.",
        clinical: "Lumbricals 1 & 2 are median-innervated; 3 & 4 are ulnar-innervated — lesions produce 'claw hand'.",
    },
    interosseous: {
        name: "Dorsal Interosseous Muscles",
        type: "Muscle",
        description: "Four bipennate muscles lying between the metacarpals in the dorsal compartment of the hand.",
        function: "Abduct fingers from the midline. Stabilize the hand during strong gripping and rotational tasks.",
        clinical: "Wasting of first dorsal interosseous is a hallmark sign of ulnar nerve palsy.",
    },
    // --- Thoracic / Abdominal Organs ---
    heart: {
        name: "Heart (Cor)",
        type: "Muscle",
        description: "A hollow muscular organ that pumps blood throughout the body by rhythmic contraction and dilation.",
        function: "The central pump of the circulatory system. Deoxygenated blood enters the right side; oxygenated blood is ejected from the left side.",
        clinical: "Target for ECG monitoring; site of myocardial infarction and valvular diseases; rate regulated by the sinoatrial node.",
    },
    lungs: {
        name: "Lungs (Pulmones)",
        type: "Muscle", // Simplification for UI consistency or categorize as 'Organ' if type expanded
        description: "Paired respiratory organs in the chest that facilitate gas exchange between the atmosphere and the blood.",
        function: "Gas exchange (O2 into blood, CO2 out). The right lung has three lobes, while the left has two to accommodate the heart.",
        clinical: "Commonly affected by pneumonia, asthma, and COPD; auscultation reveal breathing quality.",
    },
    liver: {
        name: "Liver (Hepar)",
        type: "Muscle",
        description: "The largest internal organ, located in the upper right quadrant of the abdomen.",
        function: "Metabolizes toxins, produces bile for digestion, and stores glycogen.",
        clinical: "Vulnerable to cirrhosis and hepatitis; primary site for drug metabolism.",
    },
    brain: {
        name: "Brain (Encephalon)",
        type: "Nerve",
        description: "The command center of the nervous system with 86 billion neurons.",
        function: "Processes sensory information, regulates blood pressure and breathing, and creates thoughts and emotions.",
        clinical: "Target for neuroimaging; site of stroke, tumors, and neurodegenerative diseases.",
    },
    stomach: {
        name: "Stomach (Ventriculus)",
        type: "Muscle",
        description: "A muscular, J-shaped pouch that churns food with acid and enzymes.",
        function: "Breaks down food into a semi-liquid form (chyme) before it enters the small intestine.",
        clinical: "Site of ulcers (H. pylori) and gastritis; target for endoscopy.",
    },
    aorta: {
        name: "Aorta",
        type: "Artery",
        description: "The largest artery in the body, carrying oxygenated blood from the heart to the rest of the body.",
        function: "Distributes blood to all systemic circuits. It arches over the heart (Aortic Arch).",
        clinical: "Site of aneurysms and dissection; critical for systemic blood pressure.",
    },
    intestines: {
        name: "Intestines",
        type: "Muscle",
        description: "The long, coiled tube that continues the process of digestion and absorbs nutrients and water.",
        function: "Small intestine absorbs nutrients; large intestine absorbs water and forms waste.",
        clinical: "Site of Crohn's disease, ulcerative colitis, and obstruction.",
    },
};

// ─── Helper: screen coords from normalized landmark ───────────────────────────

function lm(landmark: Landmark, w: number, h: number): [number, number] {
    return [landmark.x * w, landmark.y * h];
}

// ─── Canvas Drawing Functions ─────────────────────────────────────────────────

// ─── Canvas Drawing Functions (High Fidelity) ─────────────────────────────────

function drawBones(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }, w: number, h: number, alpha: number, time: number) {
    ctx.save();
    ctx.globalAlpha = alpha;

    // 1. Hand Bones (Existing Logic Enhanced)
    if (lms.hand && lms.hand.length >= 21) {
        const handConnections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
            [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16],
            [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]
        ];

        handConnections.forEach(([from, to]) => {
            const [x1, y1] = lm(lms.hand![from], w, h);
            const [x2, y2] = lm(lms.hand![to], w, h);
            drawBoneSegment(ctx, x1, y1, x2, y2, time);
        });
    }

    // 2. Pose Bones (Arms & Torso)
    if (lms.pose && lms.pose.length > 16) {
        // Holistic Pose landmarks: 11(L_sh), 12(R_sh), 13(L_elb), 14(R_elb), 15(L_wri), 16(R_wri)
        const poseConnections = [
            [11, 12], // Shoulders
            [11, 13], [13, 15], // Left Arm
            [12, 14], [14, 16], // Right Arm
        ];

        poseConnections.forEach(([from, to]) => {
            const [x1, y1] = lm(lms.pose![from], w, h);
            const [x2, y2] = lm(lms.pose![to], w, h);
            drawBoneSegment(ctx, x1, y1, x2, y2, time);
        });
    }

    // 3. Skull Outline (using Face Mesh)
    if (lms.face && lms.face.length > 0) {
        // Simplified skull outline from face mesh indices
        const skullIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

        ctx.beginPath();
        const start = lm(lms.face[skullIndices[0]], w, h);
        ctx.moveTo(start[0], start[1]);
        skullIndices.forEach(idx => {
            const [px, py] = lm(lms.face![idx], w, h);
            ctx.lineTo(px, py);
        });
        ctx.closePath();

        // Skull Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(240, 230, 200, 0.5)";
        ctx.strokeStyle = "rgba(240, 230, 200, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Mandible line
        const mandible = [172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397];
        ctx.beginPath();
        const mStart = lm(lms.face[mandible[0]], w, h);
        ctx.moveTo(mStart[0], mStart[1]);
        mandible.forEach(idx => {
            const [px, py] = lm(lms.face![idx], w, h);
            ctx.lineTo(px, py);
        });
        ctx.strokeStyle = "rgba(220, 210, 190, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.restore();
}

function drawBoneSegment(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, time: number) {
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (dist < 5) return;

    // Shadow & Bioluminescence
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(240, 230, 200, 0.4)";

    // Bone shaft
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "rgba(240, 230, 200, 0.95)");
    grad.addColorStop(0.5, "rgba(255, 250, 240, 1)");
    grad.addColorStop(1, "rgba(240, 230, 200, 0.95)");

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(3, dist * 0.1);
    ctx.lineCap = "round";
    ctx.stroke();

    // Specular highlight
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = ctx.lineWidth * 0.3;
    ctx.stroke();

    // Joint balls
    const pulse = 1 + 0.08 * Math.sin(time * 0.003);
    [[x1, y1], [x2, y2]].forEach(([jx, jy]) => {
        ctx.beginPath();
        ctx.arc(jx, jy, 5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 230, 200, 1)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    ctx.shadowBlur = 0;
}

function drawVeins(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }, w: number, h: number, alpha: number, time: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "screen";

    const pulse = 0.5 + 0.15 * Math.sin(time * 0.004);

    // 1. Hand Veins
    if (lms.hand && lms.hand.length >= 21) {
        const handVeinPaths = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [0, 9, 10, 11, 12], [0, 13, 14, 15, 16], [0, 17, 18, 19, 20]];
        handVeinPaths.forEach(path => {
            const points = path.map(idx => lm(lms.hand![idx], w, h));
            renderGlowPath(ctx, points, "rgba(30, 100, 255, 0.4)", 4 + pulse * 2);
        });
    }

    // 2. Pose Veins (Cephalic/Basilic)
    if (lms.pose && lms.pose.length > 16) {
        const poseVeinPaths = [[11, 13, 15], [12, 14, 16]];
        poseVeinPaths.forEach(path => {
            const points = path.map(idx => lm(lms.pose![idx], w, h));
            renderGlowPath(ctx, points, "rgba(40, 120, 255, 0.5)", 6 + pulse * 2);
        });
    }

    // 3. Face Veins (Temporal)
    if (lms.face && lms.face.length > 300) {
        const faceVeinPaths = [[21, 54, 103, 67, 109], [251, 284, 332, 297, 338]];
        faceVeinPaths.forEach(path => {
            const points = path.map(idx => lm(lms.face![idx], w, h));
            renderGlowPath(ctx, points, "rgba(50, 110, 240, 0.4)", 3 + pulse);
        });
    }

    ctx.restore();
}

function renderGlowPath(ctx: CanvasRenderingContext2D, points: [number, number][], color: string, width: number) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        const midX = (points[i - 1][0] + points[i][0]) / 2;
        const midY = (points[i - 1][1] + points[i][1]) / 2;
        ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], midX, midY);
    }

    // Outer Bioluminescence
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 1.5;
    ctx.stroke();

    // Core
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = width * 0.3;
    ctx.stroke();
}

function drawArteries(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }, w: number, h: number, alpha: number, time: number, bloodFlowActive: boolean, flowOffset: number) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const heartPulse = 0.5 + 0.5 * Math.abs(Math.sin(time * 0.0035)); // Heartbeat sync

    // Arterial paths (Hand, Arm, Face)
    const paths: { hand?: number[][], pose?: number[][], face?: number[][] } = {
        hand: [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [0, 9, 10, 11, 12], [0, 13, 14, 15, 16], [0, 17, 18, 19, 20]],
        pose: [
            [11, 13, 15], [12, 14, 16], // Brachial
            [11, 12], // Shoulder arch
            [11, 23], [12, 24] // Torso sides
        ],
        face: [[164, 167, 165, 92, 186, 57], [391, 393, 391, 322, 410, 287]] // Facial
    };

    const renderArtery = (points: [number, number][], isAorta: boolean = false) => {
        if (points.length < 2) return;

        // Artery Wall Glow
        ctx.shadowBlur = (isAorta ? 18 : 12) + heartPulse * 8;
        ctx.shadowColor = `rgba(255, 30, 30, ${0.3 + heartPulse * 0.4})`;
        ctx.strokeStyle = `rgba(220, 20, 20, 0.9)`;
        ctx.lineWidth = (isAorta ? 8 : 4) + heartPulse * 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.stroke();
        ctx.shadowBlur = 0;

        // High-fidelity flow particles
        if (bloodFlowActive) {
            const numParticles = isAorta ? 12 : 8;
            for (let i = 0; i < numParticles; i++) {
                const t = (flowOffset + i / numParticles) % 1;
                const p = getPointOnPath(points, t);

                ctx.beginPath();
                ctx.arc(p[0], p[1], isAorta ? 3.5 : 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 100, 100, ${0.8 * (1 - t)})`;
                ctx.fill();

                if (i === 0) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = "white";
                    ctx.fillStyle = "white";
                    ctx.arc(p[0], p[1], isAorta ? 2 : 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }
    };

    if (lms.hand) paths.hand!.forEach(p => renderArtery(p.map(idx => lm(lms.hand![idx], w, h))));
    if (lms.pose) {
        paths.pose!.forEach(p => renderArtery(p.map(idx => lm(lms.pose![idx], w, h))));
        // Draw Aorta (Center of chest to abdomen)
        const ls = lm(lms.pose[11], w, h);
        const rs = lm(lms.pose[12], w, h);
        const lh = lm(lms.pose[23], w, h);
        const rh = lm(lms.pose[24], w, h);
        const aortaStart: [number, number] = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2 + 10];
        const aortaEnd: [number, number] = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2 - 20];
        renderArtery([aortaStart, aortaEnd], true);
    }
    if (lms.face) paths.face!.forEach(p => renderArtery(p.map(idx => lm(lms.face![idx], w, h))));

    ctx.restore();
}

function getPointOnPath(points: [number, number][], t: number): [number, number] {
    if (points.length < 2) return points[0];
    const n = points.length - 1;
    const i = Math.min(Math.floor(t * n), n - 1);
    const frac = (t * n) - i;
    return [
        points[i][0] + frac * (points[i + 1][0] - points[i][0]),
        points[i][1] + frac * (points[i + 1][1] - points[i][1])
    ];
}

function drawMuscles(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }, w: number, h: number, alpha: number, _time: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 120, 80, 0.25)";
    ctx.strokeStyle = "rgba(255, 150, 100, 0.6)";
    ctx.lineWidth = 1.5;



    // 1. Face Muscles (Masseter, Frontalis)
    if (lms.face) {
        // Masseter simplified
        const masseter = [172, 136, 150, 149, 176, 148, 152];
        ctx.beginPath();
        masseter.forEach((idx, i) => {
            const p = lm(lms.face![idx], w, h);
            if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
        });
        ctx.fill(); ctx.stroke();
    }

    // 2. Head/Pose muscles (Trapezius)
    if (lms.pose && lms.pose.length > 12) {
        const [ls, rs] = [lm(lms.pose[11], w, h), lm(lms.pose[12], w, h)];
        const neck = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2 - 40];

        ctx.beginPath();
        ctx.moveTo(neck[0], neck[1]);
        ctx.lineTo(ls[0], ls[1]);
        ctx.lineTo(rs[0], rs[1]);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
    }

    ctx.restore();
}

function drawOrgans(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }, w: number, h: number, alpha: number, time: number) {
    if (!lms.pose || lms.pose.length < 24) return;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Anchor points
    const ls = lm(lms.pose[11], w, h); // Left Shoulder
    const rs = lm(lms.pose[12], w, h); // Right Shoulder
    const lh = lm(lms.pose[23], w, h); // Left Hip

    const chestCenter = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2 + 50];
    const torsoWidth = Math.abs(ls[0] - rs[0]);
    const torsoHeight = Math.abs(ls[1] - lh[1]);

    // 1. LUNGS (Respiration simulation)
    const respScale = 1 + 0.05 * Math.sin(time * 0.001);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255, 100, 150, 0.3)";

    // Left Lung
    const lLungPos: [number, number] = [chestCenter[0] - torsoWidth * 0.22, chestCenter[1] + 15];
    const lungW = torsoWidth * 0.16 * respScale;
    const lungH = torsoHeight * 0.32 * respScale;

    const lungGrad = ctx.createRadialGradient(lLungPos[0], lLungPos[1], 0, lLungPos[0], lLungPos[1], lungH);
    lungGrad.addColorStop(0, "rgba(255, 120, 160, 0.4)");
    lungGrad.addColorStop(1, "rgba(200, 80, 120, 0.1)");

    ctx.fillStyle = lungGrad;
    ctx.beginPath();
    ctx.ellipse(lLungPos[0], lLungPos[1], lungW, lungH, 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 150, 200, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right Lung
    const rLungPos: [number, number] = [chestCenter[0] + torsoWidth * 0.22, chestCenter[1] + 15];
    ctx.beginPath();
    ctx.ellipse(rLungPos[0], rLungPos[1], lungW, lungH, -0.12, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 2. HEART (Detailed Pulsing)
    const heartPulse = 1 + 0.12 * Math.sin(time * 0.005);
    const heartPos: [number, number] = [chestCenter[0] - 18, chestCenter[1] + 5];

    ctx.shadowBlur = 20 * heartPulse;
    ctx.shadowColor = "rgba(255, 0, 50, 0.5)";

    const heartGrad = ctx.createRadialGradient(heartPos[0], heartPos[1], 5, heartPos[0], heartPos[1], 25);
    heartGrad.addColorStop(0, "rgba(255, 50, 80, 0.95)");
    heartGrad.addColorStop(1, "rgba(180, 20, 40, 0.8)");

    ctx.fillStyle = heartGrad;
    ctx.beginPath();
    // Complex heart shape
    ctx.moveTo(heartPos[0], heartPos[1] - 12 * heartPulse);
    ctx.bezierCurveTo(heartPos[0] + 15 * heartPulse, heartPos[1] - 18 * heartPulse, heartPos[0] + 25 * heartPulse, heartPos[1] + 5 * heartPulse, heartPos[0], heartPos[1] + 20 * heartPulse);
    ctx.bezierCurveTo(heartPos[0] - 25 * heartPulse, heartPos[1] + 5 * heartPulse, heartPos[0] - 15 * heartPulse, heartPos[1] - 18 * heartPulse, heartPos[0], heartPos[1] - 12 * heartPulse);
    ctx.fill();

    // Heart detail lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. LIVER
    const liverPos: [number, number] = [chestCenter[0] + torsoWidth * 0.15, chestCenter[1] + torsoHeight * 0.35];
    const liverW = torsoWidth * 0.25;
    const liverH = torsoHeight * 0.15;

    const liverGrad = ctx.createLinearGradient(liverPos[0] - liverW, liverPos[1], liverPos[0] + liverW, liverPos[1]);
    liverGrad.addColorStop(0, "rgba(139, 69, 19, 0.7)");
    liverGrad.addColorStop(0.5, "rgba(160, 82, 45, 0.8)");
    liverGrad.addColorStop(1, "rgba(139, 69, 19, 0.7)");

    ctx.fillStyle = liverGrad;
    ctx.beginPath();
    ctx.moveTo(liverPos[0] - liverW * 0.8, liverPos[1] - liverH * 0.5);
    ctx.quadraticCurveTo(liverPos[0] + liverW, liverPos[1] - liverH * 0.8, liverPos[0] + liverW * 0.9, liverPos[1] + liverH * 0.5);
    ctx.quadraticCurveTo(liverPos[0], liverPos[1] + liverH * 0.8, liverPos[0] - liverW * 0.9, liverPos[1] + liverH * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(180, 100, 60, 0.4)";
    ctx.stroke();

    // 4. STOMACH
    const stomachPos: [number, number] = [chestCenter[0] - torsoWidth * 0.1, chestCenter[1] + torsoHeight * 0.4];
    const stomW = torsoWidth * 0.18;
    const stomH = torsoHeight * 0.12;

    ctx.fillStyle = "rgba(180, 100, 140, 0.65)";
    ctx.beginPath();
    ctx.ellipse(stomachPos[0], stomachPos[1], stomW, stomH, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(200, 120, 160, 0.5)";
    ctx.stroke();

    // 5. INTESTINES (Coiled simulation)
    const intPos: [number, number] = [chestCenter[0], chestCenter[1] + torsoHeight * 0.65];
    const intW = torsoWidth * 0.35;
    const intH = torsoHeight * 0.25;

    ctx.strokeStyle = "rgba(180, 130, 100, 0.5)";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    // Coiled path
    ctx.moveTo(intPos[0] - intW * 0.5, intPos[1] - intH * 0.4);
    for (let i = 0; i < 5; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        ctx.quadraticCurveTo(intPos[0] + intW * 0.6 * dir, intPos[1] - intH * 0.4 + i * 15, intPos[0] - intW * 0.5 * dir, intPos[1] - intH * 0.4 + (i + 1) * 15);
    }
    ctx.stroke();

    ctx.restore();
}

function drawBrain(ctx: CanvasRenderingContext2D, face: Landmark[], w: number, h: number, alpha: number, time: number) {
    if (!face || face.length < 10) return;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Anchor: Top of forehead (landmark 10) and eyebrow center
    const top = lm(face[10], w, h);
    const center = lm(face[168], w, h); // Between eyes
    const left = lm(face[21], w, h);
    const right = lm(face[251], w, h);

    const brainW = Math.abs(left[0] - right[0]) * 1.5;
    const brainH = Math.abs(top[1] - center[1]) * 2.5;
    const brainY = top[1] - brainH * 0.2;

    // Brain shadow/glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(200, 100, 255, 0.4)";

    // Main Brain Body (Volume simulation)
    const brainGrad = ctx.createRadialGradient(top[0], brainY, 5, top[0], brainY, brainW * 0.6);
    brainGrad.addColorStop(0, "rgba(230, 180, 255, 0.9)");
    brainGrad.addColorStop(0.6, "rgba(180, 120, 240, 0.85)");
    brainGrad.addColorStop(1, "rgba(140, 80, 200, 0.7)");

    ctx.fillStyle = brainGrad;
    ctx.beginPath();
    ctx.ellipse(top[0], brainY, brainW * 0.5, brainH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brain Folds
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
        const offset = (i - 3) * (brainW * 0.12);
        ctx.beginPath();
        ctx.moveTo(top[0] + offset, brainY - brainH * 0.4);
        ctx.quadraticCurveTo(top[0] + offset + Math.sin(time * 0.002 + i) * 10, brainY, top[0] + offset, brainY + brainH * 0.4);
        ctx.stroke();
    }

    // "Thought" Pulses
    const pulseCount = 3;
    for (let i = 0; i < pulseCount; i++) {
        const t = (time * 0.001 + i / pulseCount) % 1;
        const pulseR = brainW * 0.5 * t;
        ctx.beginPath();
        ctx.ellipse(top[0], brainY, pulseR, pulseR * (brainH / brainW), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - t)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}

function drawNerves(ctx: CanvasRenderingContext2D, lms: { hand?: Landmark[], pose?: Landmark[] }, w: number, h: number, alpha: number, time: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "screen";

    const nervePulse = 0.5 + 0.5 * Math.sin(time * 0.01);

    const paths = {
        hand: [[0, 9, 10, 11, 12], [0, 17, 18, 19, 20]],
        pose: [[11, 13, 15], [12, 14, 16]]
    };

    const renderNerve = (points: [number, number][]) => {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(p => ctx.lineTo(p[0], p[1]));

        ctx.shadowBlur = 5 + 10 * nervePulse;
        ctx.shadowColor = `rgba(180, 255, 100, ${0.3 + 0.5 * nervePulse})`;
        ctx.strokeStyle = `rgba(180, 255, 100, ${0.5 + 0.4 * nervePulse})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Signal pulse
        const t = (time * 0.005) % 1;
        const p = getPointOnPath(points, t);
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    };

    if (lms.hand) paths.hand.forEach(p => renderNerve(p.map(idx => lm(lms.hand![idx], w, h))));
    if (lms.pose) paths.pose.forEach(p => renderNerve(p.map(idx => lm(lms.pose![idx], w, h))));

    ctx.restore();
}

function drawCinematicOverlay(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
    ctx.save();

    // 1. Chromatic Aberration Rim
    const rim = 30;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rim, rim, w - rim * 2, h - rim * 2);

    // 2. Scanning Grid
    const gridAlpha = 0.03 + 0.02 * Math.sin(time * 0.002);
    ctx.strokeStyle = `rgba(0, 255, 200, ${gridAlpha})`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 50) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // 3. HUD Elements
    ctx.fillStyle = "rgba(0, 255, 200, 0.4)";
    ctx.font = "bold 10px monospace";
    ctx.fillText("LIVE_ANATOMY_SCAN_V2.0", 40, 50);
    ctx.fillText(`SEQ_${Math.floor(time / 1000)}`, 40, 65);

    ctx.restore();
}

// ─── Layer Config ─────────────────────────────────────────────────────────────

const DEFAULT_LAYERS: Layer[] = [
    { id: "bones", label: "Bones", color: "#e8d5a3", active: true },
    { id: "veins", label: "Veins", color: "#4080ff", active: true },
    { id: "arteries", label: "Arteries", color: "#ff4444", active: true },
    { id: "muscles", label: "Muscles", color: "#ff8c40", active: true },
    { id: "organs", label: "Organs", color: "#ff60b0", active: true },
    { id: "nerves", label: "Nerves", color: "#aaff40", active: false },
    { id: "blood", label: "Blood Flow", color: "#ff3030", active: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnatomyAR() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const holisticRef = useRef<any>(null);
    const multiLandmarksRef = useRef<{ hand?: Landmark[], pose?: Landmark[], face?: Landmark[] }>({});
    const streamRef = useRef<MediaStream | null>(null);
    const flowOffset = useRef(0);
    const timeRef = useRef(0);

    const [cameraActive, setCameraActive] = useState(false);
    const [handDetected, setHandDetected] = useState(false); // Using this for general tracking active status
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
    const [regionsDetected, setRegionsDetected] = useState({ hand: false, head: false, arm: false });
    const [selectedInfo, setSelectedInfo] = useState<AnatomyInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showLayers, setShowLayers] = useState(false);
    const [fps, setFps] = useState(0);

    const isLayerActive = useCallback((id: string) => layers.find(l => l.id === id)?.active ?? false, [layers]);

    // ── Draw loop ──────────────────────────────────────────────────────────────
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        // Mirror the video onto canvas
        ctx.save();
        if (facingMode === "user") {
            ctx.translate(W, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, W, H);
        ctx.restore();

        // High-end cinematic color grade
        ctx.fillStyle = "rgba(0, 10, 30, 0.1)"; // Deep blue cinematic tint
        ctx.fillRect(0, 0, W, H);

        const lms = multiLandmarksRef.current;
        const T = timeRef.current;

        // Draw Anatomical Layers
        if (isLayerActive("muscles")) drawMuscles(ctx, lms, W, H, 0.85, T);
        if (isLayerActive("veins")) drawVeins(ctx, lms, W, H, 0.8, T);
        if (isLayerActive("organs")) {
            drawOrgans(ctx, lms, W, H, 0.9, T);
            if (lms.face) drawBrain(ctx, lms.face, W, H, 0.9, T);
        }
        if (isLayerActive("arteries")) drawArteries(ctx, lms, W, H, 0.85, T, isLayerActive("blood"), flowOffset.current);
        if (isLayerActive("nerves")) drawNerves(ctx, lms, W, H, 0.8, T);
        if (isLayerActive("bones")) drawBones(ctx, lms, W, H, 0.9, T);

        // Cinematic Overlay (HUD)
        drawCinematicOverlay(ctx, W, H, T);

        flowOffset.current = (flowOffset.current + 0.008) % 1;
        timeRef.current += 16;
    }, [facingMode, isLayerActive]);

    // ── Render loop ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!cameraActive) return;
        let lastFpsTime = performance.now();
        let frameCount = 0;

        const loop = () => {
            drawFrame();
            frameCount++;
            const now = performance.now();
            if (now - lastFpsTime > 1000) {
                setFps(Math.round(frameCount * 1000 / (now - lastFpsTime)));
                frameCount = 0;
                lastFpsTime = now;
            }
            animRef.current = requestAnimationFrame(loop);
        };
        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, [cameraActive, drawFrame]);

    // ── Start Camera & MediaPipe ───────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API is unavailable. This usually happens when the application is not running on a secure context (HTTPS) or localhost.");
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });
            streamRef.current = stream;

            const video = videoRef.current!;
            video.srcObject = stream;
            await video.play();

            const canvas = canvasRef.current!;
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;

            // Load MediaPipe Holistic dynamically
            // @ts-ignore
            const { Holistic } = await import("@mediapipe/holistic");
            // @ts-ignore
            const { Camera } = await import("@mediapipe/camera_utils");

            const holistic = new Holistic({
                locateFile: (file: string) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`,
            });

            holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
                refineFaceLandmarks: true
            });

            holistic.onResults((results: any) => {
                const isTracking = !!(results.poseLandmarks || results.faceLandmarks || results.leftHandLandmarks || results.rightHandLandmarks);
                setHandDetected(isTracking);

                setRegionsDetected({
                    hand: !!(results.leftHandLandmarks || results.rightHandLandmarks),
                    head: !!results.faceLandmarks,
                    arm: !!results.poseLandmarks
                });

                multiLandmarksRef.current = {
                    hand: results.rightHandLandmarks || results.leftHandLandmarks || undefined,
                    pose: results.poseLandmarks || undefined,
                    face: results.faceLandmarks || undefined
                };
            });

            const camera = new Camera(video, {
                onFrame: async () => {
                    await holistic.send({ image: video });
                },
                width: canvas.width,
                height: canvas.height,
            });

            holisticRef.current = { holistic, camera };
            await camera.start();
            setCameraActive(true);
        } catch (err: any) {
            const errorMessage = err?.message || "Camera access denied. Please allow camera permissions.";
            setError(errorMessage);
            console.warn(`AR Camera Warning: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, [facingMode]);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (holisticRef.current?.camera) {
            holisticRef.current.camera.stop();
        }
        if (holisticRef.current?.holistic) {
            holisticRef.current.holistic.close();
        }
        multiLandmarksRef.current = {};
        setCameraActive(false);
        setHandDetected(false);
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, []);

    const toggleCamera = useCallback(() => {
        if (cameraActive) stopCamera();
        else startCamera();
    }, [cameraActive, stopCamera, startCamera]);

    const switchCamera = useCallback(async () => {
        const next = facingMode === "user" ? "environment" : "user";
        setFacingMode(next);
        if (cameraActive) {
            stopCamera();
            await new Promise(r => setTimeout(r, 300));
            startCamera();
        }
    }, [facingMode, cameraActive, stopCamera, startCamera]);

    const toggleLayer = useCallback((id: string) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
    }, []);

    // Click on canvas → show anatomy info
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const lms = multiLandmarksRef.current;

        let found = false;

        // 1. Check Face/Skull
        if (lms.face && !found) {
            const facePoint = lms.face[1];
            if (facePoint) {
                const dist = Math.sqrt((facePoint.x - x) ** 2 + (facePoint.y - y) ** 2);
                if (dist < 0.15) {
                    setSelectedInfo(ANATOMY_DB.skull);
                    found = true;
                }
            }
        }

        // 2. Check Organs (Chest Area)
        if (lms.pose && !found && isLayerActive("organs")) {
            const ls = lms.pose[11];
            const rs = lms.pose[12];
            const chestX = (ls.x + rs.x) / 2;
            const chestY = (ls.y + rs.y) / 2 + 0.1; // Offset slightly down from shoulders

            const dist = Math.sqrt((chestX - x) ** 2 + (chestY - y) ** 2);
            if (dist < 0.15) {
                // Determine if specifically Heart or Lungs based on side
                if (x < chestX) {
                    setSelectedInfo(ANATOMY_DB.heart);
                } else {
                    setSelectedInfo(ANATOMY_DB.lungs);
                }
                found = true;
            }
        }

        // 3. Check Arm
        if (lms.pose && !found) {
            const elbow = lms.pose[14] || lms.pose[13];
            if (elbow) {
                const dist = Math.sqrt((elbow.x - x) ** 2 + (elbow.y - y) ** 2);
                if (dist < 0.2) {
                    setSelectedInfo(ANATOMY_DB.biceps_brachii);
                    found = true;
                }
            }
        }

        // 3. Check Hand
        if (lms.hand && !found) {
            let minDist = Infinity, closestIdx = -1;
            lms.hand.forEach((lm, i) => {
                const d = Math.sqrt((lm.x - x) ** 2 + (lm.y - y) ** 2);
                if (d < minDist) { minDist = d; closestIdx = i; }
            });

            if (minDist < 0.1) {
                const info =
                    closestIdx === 0 ? ANATOMY_DB.wrist :
                        closestIdx <= 4 ? ANATOMY_DB.metacarpal :
                            [5, 9, 13, 17].includes(closestIdx) ? ANATOMY_DB.proximal_phalanx :
                                closestIdx === 8 || closestIdx === 12 ? ANATOMY_DB.digital_nerve :
                                    ANATOMY_DB.flexor_tendon;
                setSelectedInfo(info);
                found = true;
            }
        }
    }, []);

    // Cleanup
    useEffect(() => () => { stopCamera(); }, [stopCamera]);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="h-[calc(100vh-5rem)] bg-[#010912] text-white overflow-hidden flex flex-col relative">
            {/* HUD Status Bar (Top) */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-white uppercase tracking-widest">Anatomy AR</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Augmented Reality Interface</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 max-w-xl mx-auto hidden md:block">
                    <p className="text-white/50 text-xs font-light leading-relaxed text-center">
                        Explore human anatomy in real-time. Use your camera to overlay bones, muscles, and organs, gaining interactive insights into your body's structure.
                    </p>
                </div>

                <div className="flex items-center gap-3 pointer-events-auto">
                    {cameraActive && (
                        <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md text-[10px] font-mono text-cyan-400 tracking-tighter">
                            SYSTEM_FPS: {fps}
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas / Camera Area */}
            <div className="flex-1 relative flex items-center justify-center bg-[#010912]">
                <video ref={videoRef} className="hidden" playsInline muted />

                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className={cn(
                        "w-full h-full max-h-full object-cover cursor-crosshair transition-opacity duration-300",
                        cameraActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{ aspectRatio: "16/9" }}
                />

                {/* Splash screen when camera off */}
                {!cameraActive && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                        {/* Animated body scan graphic */}
                        <motion.div className="relative size-48" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }}>
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: "3s" }} />
                            <div className="absolute inset-4 rounded-full border border-cyan-400/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-32 h-32 text-cyan-400/60" viewBox="0 0 200 200" fill="none">
                                    {/* Hand outline */}
                                    <path d="M100 180 C70 180 50 160 50 130 L50 80 C50 72 56 66 64 66 C68 66 72 68 74 72 L74 55 C74 47 80 41 88 41 C92 41 96 43 98 47 L98 45 C98 37 104 31 112 31 C120 31 126 37 126 45 L126 52 C128 48 132 46 136 46 C144 46 150 52 150 60 L150 130 C150 160 130 180 100 180Z" stroke="currentColor" strokeWidth="3" fill="rgba(6,182,212,0.05)" strokeLinejoin="round" />
                                    {/* Finger joints */}
                                    {[74, 98, 126].map((x, i) => (
                                        <g key={i}>
                                            <circle cx={x} cy={80} r="3" fill="rgba(6,182,212,0.5)" />
                                            <circle cx={x} cy={60} r="3" fill="rgba(6,182,212,0.5)" />
                                        </g>
                                    ))}
                                    {/* Bone lines */}
                                    {[74, 98, 126].map((x, i) => (
                                        <line key={i} x1={x} y1={44} x2={x} y2={165} stroke="rgba(240,220,180,0.4)" strokeWidth="2" strokeLinecap="round" />
                                    ))}
                                    {/* Veins */}
                                    <path d="M85 170 C80 130 75 100 80 70" stroke="rgba(60,120,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M110 170 C108 130 110 100 108 68" stroke="rgba(255,60,60,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </motion.div>

                        <div className="text-center max-w-sm">
                            <h2 className="text-2xl font-black text-white mb-2 italic tracking-tight">AR ANATOMY EXPLORER</h2>
                            <p className="text-sm text-white/50 leading-relaxed">
                                Experience high-fidelity anatomical visualization. Scan your <span className="text-cyan-400">head, torso, or limb</span> to reveal internal organs, skeletal structures, and neural pathways.
                            </p>
                        </div>

                        {error && (
                            <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center max-w-xs">
                                {error}
                            </div>
                        )}

                        <motion.button
                            onClick={toggleCamera}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Camera className="size-5" />
                            Activate AR Scanner
                        </motion.button>
                        <p className="text-[10px] text-white/20">Requires camera permission · Works best in good lighting</p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <motion.div
                            className="size-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-sm text-cyan-400/80 font-medium">Initializing Neural Scanner...</p>
                        <p className="text-[10px] text-white/30">Loading MediaPipe AI · Requesting camera</p>
                    </div>
                )}

                {/* Scan frame overlay */}
                {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Corner brackets */}
                        {[["top-4 left-4", "border-t-2 border-l-2"], ["top-4 right-4", "border-t-2 border-r-2"], ["bottom-4 left-4", "border-b-2 border-l-2"], ["bottom-4 right-4", "border-b-2 border-r-2"]].map(([pos, borders]) => (
                            <div key={pos} className={`absolute ${pos} w-8 h-8 ${borders} border-cyan-400/60`} />
                        ))}
                        {/* Scan line */}
                        {!handDetected && (
                            <motion.div
                                className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                                animate={{ top: ["10%", "90%", "10%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                        {/* Instruction */}
                        {!handDetected && (
                            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                                <motion.div
                                    className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-xs text-white/60 backdrop-blur-sm"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Position your upper body or hand in the scan frame
                                </motion.div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#010912]/95 via-[#010912]/60 to-transparent px-4 py-4">
                <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
                    {/* Layers toggle button */}
                    <motion.button
                        onClick={() => setShowLayers(p => !p)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 text-white/80 text-xs font-bold backdrop-blur-sm"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Layers className="size-4" />
                        Layers
                    </motion.button>

                    {/* Start/Stop */}
                    <motion.button
                        onClick={toggleCamera}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all backdrop-blur-sm",
                            cameraActive
                                ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                                : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
                        )}
                        whileTap={{ scale: 0.95 }}
                    >
                        {cameraActive ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
                        {cameraActive ? "Stop" : "Start"}
                    </motion.button>

                    {/* Switch camera */}
                    <motion.button
                        onClick={switchCamera}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 text-white/80 text-xs font-bold backdrop-blur-sm"
                        whileTap={{ scale: 0.95 }}
                    >
                        <RotateCcw className="size-4" />
                        Flip
                    </motion.button>
                </div>

                {/* Layer toggles */}
                <AnimatePresence>
                    {showLayers && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-3 flex flex-wrap gap-2 justify-center"
                        >
                            {layers.map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => toggleLayer(layer.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border backdrop-blur-sm",
                                        layer.active
                                            ? "border-white/20 bg-white/10 text-white"
                                            : "border-white/5 bg-black/20 text-white/30"
                                    )}
                                >
                                    <div className={cn("size-2 rounded-full transition-all", layer.active ? "opacity-100" : "opacity-20")} style={{ backgroundColor: layer.color }} />
                                    {layer.id === "blood" ? (layer.active ? <Eye className="size-3" /> : <EyeOff className="size-3" />) : <Zap className="size-3" />}
                                    {layer.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
                {selectedInfo && (
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="absolute top-20 right-4 z-40 w-72 premium-glass-panel rounded-3xl p-5 shadow-2xl shadow-cyan-900/20"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold mb-1",
                                    selectedInfo.type === "Bone" ? "bg-amber-500/20 text-amber-400" :
                                        selectedInfo.type === "Artery" ? "bg-red-500/20 text-red-400" :
                                            selectedInfo.type === "Vein" ? "bg-blue-500/20 text-blue-400" :
                                                selectedInfo.type === "Muscle" ? "bg-orange-500/20 text-orange-400" :
                                                    selectedInfo.type === "Nerve" ? "bg-green-500/20 text-green-400" :
                                                        "bg-purple-500/20 text-purple-400"
                                )}>
                                    {selectedInfo.type}
                                </div>
                                <h3 className="text-sm font-black text-white leading-tight">{selectedInfo.name}</h3>
                            </div>
                            <button onClick={() => setSelectedInfo(null)} className="mt-0.5 size-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                <X className="size-3.5 text-white/50" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Description</p>
                                <p className="text-white/70">{selectedInfo.description}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Function</p>
                                <p className="text-white/70">{selectedInfo.function}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                                <p className="text-[9px] uppercase tracking-widest text-cyan-400/60 font-bold mb-0.5 flex items-center gap-1">
                                    <Info className="size-3" /> Clinical Relevance
                                </p>
                                <p className="text-cyan-300/70">{selectedInfo.clinical}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
