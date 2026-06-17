import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getLenis } from "@/components/motion/SmoothScroll";

/**
 * Opening scene: a pair of warm wooden doors that swing open on scroll,
 * revealing the linen-dressed room beyond. Built entirely in CSS so it is
 * pixel-perfect and never depends on a stock photo.
 */
export function Door({ roomImage }: { roomImage: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const leftRot = useTransform(scrollYProgress, [0, 0.8], [0, -112]);
  const rightRot = useTransform(scrollYProgress, [0, 0.8], [0, 112]);
  const roomScale = useTransform(scrollYProgress, [0, 1], [1.35, 1.06]);
  const roomBright = useTransform(scrollYProgress, [0, 0.6], [0.25, 1]);
  const roomFilter = useTransform(roomBright, (b) => `brightness(${b})`);
  const doorShadow = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const welcomeOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const welcomeY = useTransform(scrollYProgress, [0, 0.16], [0, -18]);
  const titleOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.55, 0.9], [40, 0]);
  const seamOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.9]);

  const enter = () => {
    const lenis = getLenis();
    const target = window.innerHeight * 1.5;
    if (lenis) lenis.scrollTo(target, { duration: 2.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden bg-[#111319]"
        style={{ perspective: 1800 }}
      >
        {/* Room behind the doors */}
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale: roomScale, filter: roomFilter }}
        >
          <ImageWithFallback
            src={roomImage}
            alt="A suite dressed in pure linen"
            fallbackLabel="Room Twenty-Four"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111319]/80 via-transparent to-[#111319]/40" />
        </motion.div>

        {/* Title revealed as the doors open */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          style={reduce ? undefined : { opacity: titleOpacity, y: titleY }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(14,11,8,0.7)_0%,transparent_60%)]" />
          <p
            className="relative text-[11px] font-medium uppercase tracking-[0.4em] text-clay-200"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.7)" }}
          >
            Room Twenty-Four · Colombo
          </p>
          <h1
            className="relative mt-5 font-serif text-[clamp(2.6rem,8vw,7rem)] font-light leading-[0.95] tracking-tight text-paper"
            style={{ textShadow: "0 4px 50px rgba(0,0,0,0.7)" }}
          >
            A Room Dressed<br />
            <span className="italic text-clay-100">in Linen</span>
          </h1>
        </motion.div>

        {/* The doors */}
        <div className="absolute inset-0 z-30 flex [transform-style:preserve-3d]">
          <motion.div
            className="relative h-full w-1/2 origin-left"
            style={reduce ? { display: "none" } : { rotateY: leftRot }}
          >
            <DoorLeaf side="left" />
          </motion.div>
          <motion.div
            className="relative h-full w-1/2 origin-right"
            style={reduce ? { display: "none" } : { rotateY: rightRot }}
          >
            <DoorLeaf side="right" />
          </motion.div>

          {/* light seam glow */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 z-40 h-full w-[3px] -translate-x-1/2 bg-clay-100 blur-[3px]"
            style={{ opacity: seamOpacity }}
          />
        </div>

        {/* outer vignette over doors */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.5))]"
          style={{ opacity: doorShadow }}
        />

        {/* welcome header - centred on the starting screen only, fades on entry */}
        <motion.div
          style={reduce ? undefined : { opacity: welcomeOpacity, y: welcomeY }}
          className="pointer-events-none absolute inset-x-0 top-[19%] z-40 flex justify-center px-6"
        >
          <div className="max-w-3xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-clay-600">
              A warm welcome
            </p>
            <h2 className="mt-4 font-serif text-[clamp(1.55rem,3.4vw,2.9rem)] font-light leading-[1.15] tracking-tight text-ink">
              Welcome to a <span className="italic text-clay-600">softer &amp; slower</span> world
              with The Linen Solutions
            </h2>
          </div>
        </motion.div>

        {/* Enter affordance */}
        <motion.button
          onClick={enter}
          style={reduce ? undefined : { opacity: hintOpacity }}
          className="group absolute bottom-10 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-3"
          aria-label="Enter the room"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-ink/65 transition-colors group-hover:text-clay-600">
            Enter the room
          </span>
          <motion.span
            animate={reduce ? undefined : { y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/35 text-ink/65 transition-colors group-hover:border-clay-500 group-hover:text-clay-600"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}

/** A single carved wooden door leaf, drawn with gradients. */
function DoorLeaf({ side }: { side: "left" | "right" }) {
  const handleSide = side === "left" ? "right-3" : "left-3";
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(100deg, #F8F8F5 0%, #F0F0EC 42%, #E7E7E2 100%)",
        boxShadow: "inset 0 0 120px rgba(90,95,105,0.14)",
      }}
    >
      {/* subtle vertical grain */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(90,95,105,0.13) 0 2px, transparent 2px 10px)",
        }}
      />
      {/* recessed panels */}
      <div className="absolute inset-7 flex flex-col gap-7 md:inset-10 md:gap-10">
        <Panel className="flex-[3]" />
        <Panel className="flex-[4]" />
        <Panel className="flex-[2]" />
      </div>

      {/* brass handle */}
      <div
        className={`absolute top-1/2 ${handleSide} h-20 w-2 -translate-y-1/2 rounded-full`}
        style={{
          background: "linear-gradient(180deg, #E8C98A, #B8965A 50%, #8A6E3E)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      />

    </div>
  );
}

function Panel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[3px] ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(90,95,105,0.10), rgba(255,255,255,0.6))",
        boxShadow:
          "inset 2px 2px 7px rgba(90,95,105,0.22), inset -2px -2px 6px rgba(255,255,255,0.8)",
      }}
    />
  );
}
