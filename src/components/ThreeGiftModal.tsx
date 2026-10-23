import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Gift,
  X,
  Sparkles,
  Award,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  RotateCw,
  Eye
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

interface ThreeGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentAccount: StudentAccount | null;
  onOpenRegister: () => void;
}

interface ClaimedGiftData {
  studentName: string;
  studentEmail: string;
  giftCode: string;
  giftTitle: string;
  claimedAt?: string;
}

export function ThreeGiftModal({
  isOpen,
  onClose,
  studentAccount,
  onOpenRegister,
}: ThreeGiftModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [giftData, setGiftData] = useState<ClaimedGiftData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Student identification
  const currentEmail = studentAccount?.email || 'talaba@student.uz';
  const currentName = studentAccount?.name || 'Hurmatli O\'quvchi';

  // Check gift status on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/gifts/status?email=${encodeURIComponent(currentEmail)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.claimed && data.gift) {
              setIsClaimed(true);
              setGiftData({
                studentName: data.gift.student_name || currentName,
                studentEmail: data.gift.student_email || currentEmail,
                giftCode: data.gift.gift_code || 'VIP-3D-GOLD',
                giftTitle: data.gift.gift_title || 'Admin Maxsus Sovg\'asi',
                claimedAt: data.gift.claimed_at,
              });
            } else {
              // Check local storage fallback
              const localClaim = localStorage.getItem(`tanishuv_gift_claimed_${currentEmail}`);
              if (localClaim) {
                setIsClaimed(true);
                setGiftData(JSON.parse(localClaim));
              } else {
                setIsClaimed(false);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Gift status check fallback to local:', e);
        const localClaim = localStorage.getItem(`tanishuv_gift_claimed_${currentEmail}`);
        if (localClaim && isMounted) {
          setIsClaimed(true);
          setGiftData(JSON.parse(localClaim));
        }
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [isOpen, currentEmail, currentName]);

  // Three.js 3D Scene setup
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = 280;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark slate

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf43f5e, 2.5); // Rose neon light
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.5); // Cyan light
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfbbf24, 3, 10); // Amber glow
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Procedural 3D Composite Model (Gift Trophy Group)
    const giftGroup = new THREE.Group();

    // Part A: Floating Crystal Gem (Octahedron with Bevels)
    const gemGeo = new THREE.OctahedronGeometry(1.0, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      ior: 1.7,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    giftGroup.add(gemMesh);

    // Part B: Inner Golden Star Core
    const coreGeo = new THREE.IcosahedronGeometry(0.45, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    giftGroup.add(coreMesh);

    // Part C: Orbiting Golden Torus Ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    giftGroup.add(ringMesh);

    // Part D: Orbiting Cyan Ring
    const ring2Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    giftGroup.add(ring2Mesh);

    // Part E: Sparkling Star Particles (50 particles)
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5;
      positions[i + 1] = (Math.random() - 0.5) * 3.5;
      positions[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    giftGroup.add(particles);

    scene.add(giftGroup);

    // 5. Interactive Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      giftGroup.rotation.y += deltaX * 0.01;
      giftGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 6. Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth idle rotation
      if (!isDragging) {
        giftGroup.rotation.y += delta * 0.6;
        gemMesh.rotation.y += delta * 0.4;
        gemMesh.rotation.x += delta * 0.2;
        ringMesh.rotation.z += delta * 0.5;
        ring2Mesh.rotation.x -= delta * 0.4;
        coreMesh.rotation.y -= delta * 1.0;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      renderer.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle claiming the 1-time gift
  const handleClaimGift = async () => {
    setLoading(true);
    setClaimError('');

    try {
      const res = await fetch('/api/gifts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentName,
          studentEmail: currentEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const giftObj: ClaimedGiftData = {
          studentName: data.gift.student_name || currentName,
          studentEmail: data.gift.student_email || currentEmail,
          giftCode: data.gift.gift_code,
          giftTitle: data.gift.gift_title,
          claimedAt: data.gift.claimed_at,
        };
        setIsClaimed(true);
        setGiftData(giftObj);
        localStorage.setItem(`tanishuv_gift_claimed_${currentEmail}`, JSON.stringify(giftObj));
      } else {
        setClaimError(data.error || 'Sovg\'ani qabul qilishda xatolik yuz berdi');
        if (data.gift) {
          setIsClaimed(true);
          setGiftData({
            studentName: data.gift.student_name,
            studentEmail: data.gift.student_email,
            giftCode: data.gift.gift_code,
            giftTitle: data.gift.gift_title,
            claimedAt: data.gift.claimed_at,
          });
        }
      }
    } catch (e: any) {
      console.warn('API error, using local storage fallback for 1-time gift:', e);
      const giftCode = 'VIP-3D-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const giftObj: ClaimedGiftData = {
        studentName: currentName,
        studentEmail: currentEmail,
        giftCode: giftCode,
        giftTitle: 'Admin Maxsus Sovg\'asi: 3D Dasturchi Oltin To\'plami',
        claimedAt: 'Hozirgina',
      };
      setIsClaimed(true);
      setGiftData(giftObj);
      localStorage.setItem(`tanishuv_gift_claimed_${currentEmail}`, JSON.stringify(giftObj));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!giftData?.giftCode) return;
    navigator.clipboard.writeText(giftData.giftCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download standalone 3D gift HTML file
  const handleDownloadGiftTemplate = () => {
    const standaloneHtml = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin 3D Sovg'asi | ${currentName}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#090d16; color:#fff; font-family:sans-serif; overflow:hidden; }
    #canvas-container { width:100vw; height:100vh; position:absolute; top:0; left:0; }
    .overlay { position:absolute; bottom:30px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); border:1px solid rgba(251,191,36,0.3); padding:20px 30px; border-radius:18px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5); max-width:90vw; }
    .title { font-size:18px; font-weight:bold; color:#fbbf24; margin-bottom:6px; }
    .badge { font-family:monospace; background:rgba(251,191,36,0.15); color:#fde68a; padding:4px 12px; border-radius:8px; font-size:13px; display:inline-block; margin-bottom:10px; }
    .desc { font-size:12px; color:#94a3b8; line-height:1.4; }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  <div class="overlay">
    <div class="title">🎁 Admin 3D Eksklyuziv Sovg'asi</div>
    <div class="badge">Ega: ${currentName} (${giftData?.giftCode || 'VIP-3D-GOLD'})</div>
    <div class="desc">Ushbu 3D interaktiv sayt Tanishuv.uz & Akademiya Admini tomonidan maxsus 1 marta taqdim etildi. Sichqoncha bilan aylantirib ko'ring!</div>
  </div>
  <script>
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 4.5);
    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const light1 = new THREE.DirectionalLight(0xf43f5e, 2);
    light1.position.set(2, 4, 2);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0x06b6d4, 2);
    light2.position.set(-2, -3, -2);
    scene.add(light2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const group = new THREE.Group();
    const geo = new THREE.OctahedronGeometry(1.2, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.1, wireframe: false });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), wireMat);
    group.add(wire);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 64), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
    ring.rotation.x = Math.PI / 3;
    group.add(ring);
    scene.add(group);

    function animate() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
      ring.rotation.z += 0.008;
      renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_3d_sovga_${currentName.toLowerCase().replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Admindan Eksklyuziv 3D Sovg'a
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-600/50">
                  1 marta beriladi
                </span>
              </div>
              <p className="text-xs text-stone-300">
                WebGL & Three.js asosidagi maxsus interaktiv sovg'a
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D WebGL Canvas Viewer */}
        <div className="relative bg-slate-950 flex flex-col items-center justify-center select-none">
          <div ref={mountRef} className="w-full h-70 cursor-grab active:cursor-grabbing" />
          <div className="absolute top-3 right-3 text-[10px] font-mono text-amber-300/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Sichqoncha bilan aylantiring</span>
          </div>
        </div>

        {/* Body & Claim Status */}
        <div className="p-5 sm:p-6 space-y-4">
          {isClaimed ? (
            /* Already Claimed State (Enforces 1-time rule) */
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Siz ushbu 3D sovg'ani qabul qilgansiz!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Sovg'a barcha o'quvchilarga faqat 1 marta taqdim etiladi.
                  </p>
                </div>
              </div>

              {/* VIP Code Box */}
              <div className="p-3 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    Shaxsiy VIP Token Kodi:
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-stone-900">
                    {giftData?.giftCode || 'VIP-3D-GOLD'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Nusxalandi' : 'Nusxa'}</span>
                </button>
              </div>

              {/* Download standalone 3D gift website */}
              <button
                onClick={handleDownloadGiftTemplate}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>O'zingizning 3D sayt faylingizni yuklab oling (.html)</span>
              </button>
            </div>
          ) : (
            /* Unclaimed State */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Admin Shaxsiy Sovg'asi: 3D Dasturchi Oltin To'plami
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ushbu interaktiv 3D WebGL sovg'asi barcha qatnashuvchi o'quvchilar uchun Admindan shaxsiy rag'bat sifatida beriladi. Uni qabul qilib, o'zingiz uchun to'liq mustaqil 3D veb-sayt fayliga ega bo'lasiz.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Eslatma:</strong> Sovg'a har bir o'quvchiga PostgreSQL bazasida qayd etilib, <strong>faqat 1 marta</strong> beriladi!
                </span>
              </div>

              {claimError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {claimError}
                </div>
              )}

              <button
                onClick={handleClaimGift}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:opacity-95 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>{loading ? 'Sovg\'a rasmiylashtirilmoqda...' : '3D Sovg\'ani Qabul Qilish (1 marta)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
