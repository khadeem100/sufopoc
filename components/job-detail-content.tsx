"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Building2, 
  Globe, 
  Clock, 
  Award, 
  Users, 
  CheckCircle, 
  FileText, 
  Home, 
  Plane, 
  Car,
  Share2,
  Bookmark,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApplyButton } from "@/components/apply-button"

interface JobDetailContentProps {
  job: any
  session: any
  existingApplication: any
}

export function JobDetailContent({ job, session, existingApplication }: JobDetailContentProps) {
  const router = useRouter()

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full bg-black">
        {job.bannerUrl ? (
          <Image
            src={job.bannerUrl}
            alt={job.title}
            fill
            className="object-cover opacity-40 grayscale"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-8 left-4 sm:left-8 z-20">
          <Button 
            variant="outline" 
            className="bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                {job.category}
              </Badge>
              {job.jobType && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  {job.jobType.replace(/-/g, " ")}
                </Badge>
              )}
              {job.employmentType && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  {job.employmentType}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span className="font-medium text-white">{job.companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{job.city}, {job.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-none shadow-sm p-8 border border-gray-200"
            >
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-2xl font-bold text-black mb-4">Overview</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-800">{job.shortDescription}</p>
                
                <Separator className="my-8" />
                
                <h3 className="text-2xl font-bold text-black mb-4">Job Description</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
                  {job.fullDescription || job.description}
                </p>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-black mt-8 mb-4">Key Responsibilities</h3>
                    <ul className="space-y-3">
                      {job.responsibilities.map((resp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-800">
                          <CheckCircle className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-black mt-8 mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-800">
                          <div className="h-1.5 w-1.5 rounded-full bg-black mt-2.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-zinc-50 rounded-none p-6 border border-zinc-200"
              >
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <Plane className="h-5 w-5" /> Relocation & Visa
                </h4>
                <ul className="space-y-3 text-sm text-zinc-700">
                  <li className="flex items-center gap-2">
                    {job.relocationSupport ? <CheckCircle className="h-4 w-4 text-black" /> : <div className="h-4 w-4" />}
                    Relocation Support
                  </li>
                  <li className="flex items-center gap-2">
                    {job.visaSponsorship ? <CheckCircle className="h-4 w-4 text-black" /> : <div className="h-4 w-4" />}
                    Visa Sponsorship {job.visaType && `(${job.visaType})`}
                  </li>
                  <li className="flex items-center gap-2">
                    {job.housingSupport ? <CheckCircle className="h-4 w-4 text-black" /> : <div className="h-4 w-4" />}
                    Housing Support
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-zinc-50 rounded-none p-6 border border-zinc-200"
              >
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" /> Benefits & Perks
                </h4>
                <ul className="space-y-3 text-sm text-zinc-700">
                  {job.extraBenefits && job.extraBenefits.length > 0 ? (
                    job.extraBenefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-black" /> {benefit}
                      </li>
                    ))
                  ) : (
                    <li>Competitive benefits package included</li>
                  )}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-none shadow-sm p-6 border border-gray-200 sticky top-8"
            >
              <div className="flex items-center gap-4 mb-6">
                {job.logoUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden border border-gray-200">
                    <Image src={job.logoUrl} alt={job.companyName} fill className="object-contain p-2 grayscale" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-zinc-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-black">{job.companyName}</h3>
                  <a href="#" className="text-sm text-zinc-500 hover:text-black transition-colors underline">View Company Profile</a>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-zinc-500 text-sm">Salary</span>
                  <span className="font-semibold text-black">
                    {job.salaryMin && job.salaryMax 
                      ? `${job.currency || '€'}${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                      : 'Competitive'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-zinc-500 text-sm">Experience</span>
                  <span className="font-semibold text-black capitalize">{job.seniorityLevel || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-zinc-500 text-sm">Openings</span>
                  <span className="font-semibold text-black">{job.positionsAvailable}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-zinc-500 text-sm">Deadline</span>
                  <span className="font-semibold text-black">
                    {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Open until filled'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {session?.user ? (
                  session.user.role === "STUDENT" || session.user.role === "EXPERT" ? (
                    <ApplyButton 
                      jobId={job.id} 
                      userId={session.user.id}
                      existingApplication={existingApplication}
                    />
                  ) : (
                    <div className="text-center p-4 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600">
                      Log in as a student or expert to apply.
                    </div>
                  )
                ) : (
                  <Button className="w-full h-12 text-lg font-semibold bg-black hover:bg-zinc-800 text-white rounded-none">
                    Sign Up to Apply
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full rounded-none border-zinc-300 hover:bg-zinc-50">
                    <Bookmark className="h-4 w-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" className="w-full rounded-none border-zinc-300 hover:bg-zinc-50">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
