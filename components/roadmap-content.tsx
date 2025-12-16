"use client"

import { motion } from "framer-motion"
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  Fingerprint, 
  Blocks, 
  Glasses, 
  Globe2, 
  Video, 
  ArrowRight,
  Zap,
  Users
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function RoadmapContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 border-white/20 text-white/80 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-sm uppercase tracking-widest">
              Innovation Roadmap
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Building the Future of <br />
              <span className="text-white">Career Development</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              We&apos;re not just building a job board. We&apos;re engineering a comprehensive ecosystem powered by AI and Web3 to revolutionize how you learn, grow, and work.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Status Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* 1. Live Now */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Live & Operational</h2>
              <p className="text-gray-500">Foundational pillars currently active on the platform.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Globe2 className="h-6 w-6 text-green-400" />}
              title="Unified Ecosystem"
              description="Seamless integration of job opportunities and educational programs in one cohesive platform."
              status="Live"
              color="green"
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-green-400" />}
              title="Role-Based Dashboards"
              description="Tailored experiences for Students, Experts, Ambassadors, and Admins with specific toolsets."
              status="Live"
              color="green"
            />
            <FeatureCard 
              icon={<Fingerprint className="h-6 w-6 text-green-400" />}
              title="Verified Trust System"
              description="Robust ambassador verification and secure application management workflows."
              status="Live"
              color="green"
            />
          </div>
        </motion.div>

        {/* 2. In Development */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-32 relative"
        >
          {/* Connecting Line */}
          <div className="absolute left-6 -top-20 bottom-0 w-px bg-gradient-to-b from-green-500/20 via-blue-500/20 to-transparent hidden md:block" />

          <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Rocket className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">In Active Development</h2>
              <p className="text-gray-500">Cutting-edge features currently on the workbench.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LargeFeatureCard 
              icon={<BrainCircuit className="h-8 w-8 text-blue-400" />}
              title="AI Career Architect"
              description="A personal AI agent that interviews you to understand your deepest aspirations, then maps a step-by-step career path from education to executive level."
              tags={["Artificial Intelligence", "Personalization"]}
              color="blue"
            />
            <LargeFeatureCard 
              icon={<Video className="h-8 w-8 text-blue-400" />}
              title="Smart Video CV Studio"
              description="Integrated video recording suite with real-time AI coaching for tone, pace, and content. Get instant feedback before you submit."
              tags={["Computer Vision", "Coaching"]}
              color="blue"
            />
          </div>
        </motion.div>

        {/* 3. Future Horizon */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Future Horizon</h2>
              <p className="text-gray-500">Revolutionary concepts we are researching.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FutureCard 
              icon={<Blocks className="h-6 w-6" />}
              title="Decentralized Credential Wallet"
              description="Blockchain-verified degrees and certificates that you truly own. Shareable, verifiable, and tamper-proof."
            />
            <FutureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Cultural Fit AI"
              description="Beyond skills matching. Our AI agents assess company culture compatibility to ensure long-term happiness."
            />
            <FutureCard 
              icon={<Glasses className="h-6 w-6" />}
              title="VR Workplace Immersion"
              description="Don't just read about the office. Step inside a virtual twin of your potential workplace before applying."
            />
            <FutureCard 
              icon={<Globe2 className="h-6 w-6" />}
              title="Global Salary Equalizer"
              description="AI tool that calculates fair compensation across borders based on real-time purchasing power parity."
            />
            <FutureCard 
              icon={<Users className="h-6 w-6" />}
              title="Micro-Mentorship Market"
              description="On-demand P2P mentorship sessions. Connect with an expert for 15 minutes to solve a specific problem."
            />
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-32 text-center bg-zinc-900/50 rounded-3xl p-12 border border-zinc-800">
          <h2 className="text-3xl font-bold mb-6">Be Part of the Evolution</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            These features are built with you in mind. Join our community today to get early access to our beta features.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 text-lg font-semibold">
              Join the Platform <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, status, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-black border border-zinc-800">
          {icon}
        </div>
        <Badge variant="secondary" className={`bg-${color}-500/10 text-${color}-400 border-${color}-500/20`}>
          {status}
        </Badge>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function LargeFeatureCard({ icon, title, description, tags, color }: any) {
  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-blue-500/30 transition-all group">
      <div className="mb-6 inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
      <div className="flex gap-2">
        {tags.map((tag: string, i: number) => (
          <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function FutureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 rounded-2xl bg-black border border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
      <div className="mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  )
}
