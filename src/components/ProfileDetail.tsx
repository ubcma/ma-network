"use client";

import { type NetworkProfile } from "@/utils/networkProfileUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

interface ProfileDetailProps {
  profile: NetworkProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
      <div className="mt-2 h-px w-full bg-gray-100" />
    </div>
  );
}

export function ProfileDetail({ profile, isOpen, onClose }: ProfileDetailProps) {
  if (!profile) return null;

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`;
  const maPosition = profile.ma_role?.position?.trim();
  const maPortfolio = profile.ma_role?.portfolio?.trim();

  const id = new URLSearchParams(
    new URL(profile.profile_photo_url ?? "", window.location.href).search
  ).get("id");
  const photoUrl = id ? `https://drive.google.com/thumbnail?id=${id}` : "";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const avatarVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* centering logic unchanged */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto pr-14">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key={profile.id}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mt-1"
            >
              {/* Header */}
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {/* Avatar / Photo */}
                  <motion.div
                    variants={avatarVariants}
                    className="w-13 h-13 rounded-full bg-primary/10 ring-1 ring-primary/20 overflow-hidden flex items-center justify-center shrink-0"
                  >
                    {profile.profile_photo_url && photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-primary font-bold text-lg">{initials}</span>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="min-w-0">
                    <div className="text-xl font-semibold leading-tight truncate">
                      {profile.first_name} {profile.last_name}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant={profile.contact_type === "alumni" ? "default" : "secondary"}>
                        {profile.contact_type === "alumni" ? "Alumni" : "Executive"}
                      </Badge>

                      {maPosition ? (
                        <Badge variant="outline" className="truncate max-w-[520px]">
                          MA: {maPosition}
                          {maPortfolio ? ` • ${maPortfolio}` : ""}
                        </Badge>
                      ) : null}
                    </div>
                  </motion.div>
                </DialogTitle>
              </DialogHeader>

              {/* Body */}
              <motion.div className="space-y-6 mt-4" variants={containerVariants}>
                {/* MA Role */}
                {(maPosition || maPortfolio) ? (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="UBCMA Role" />
                    <div className="ml-7 space-y-1">
                      <p className="font-medium text-gray-900">{maPosition || "—"}</p>
                      {maPortfolio ? (
                        <p className="text-gray-600">Portfolio: {maPortfolio}</p>
                      ) : null}
                    </div>
                  </motion.section>
                ) : null}

                {/* Current Position */}
                <motion.section variants={itemVariants}>
                  <SectionHeading title="Current Position" />
                  <div className="ml-7">
                    <p className="font-medium text-gray-900">
                      {profile.current_role || "—"}
                      {profile.current_company ? (
                        <span className="font-normal text-gray-600">{` @ ${profile.current_company}`}</span>
                      ) : null}
                    </p>

                    {profile.current_role_desc ? (
                      <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap leading-relaxed">
                        {profile.current_role_desc}
                      </p>
                    ) : null}
                  </div>
                </motion.section>

                {/* About */}
                {profile.bio ? (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="About" />
                    <p className="ml-7 text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {profile.bio}
                    </p>
                  </motion.section>
                ) : null}

                {/* Past Experience */}
                {profile.past_experience?.length ? (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="Past Experience" />
                     

                    <div className="space-y-3">
                      {profile.past_experience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-gray-200 pl-4 ml-2">
                          <p className="font-medium text-gray-900">{exp.role}</p>
                          <p className="text-gray-600">{exp.company}</p>
                          {exp.desc ? (
                            <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap leading-relaxed">
                              {exp.desc}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </motion.section>
                ) : null}

                {/* Interests */}
                {profile.hobbies?.length ? (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="Interests & Topics" />
                    <div className="ml-7">
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby, idx) => (
                        <Badge key={idx} variant="outline">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  </motion.section>
                ) : null}

                {/* Contact */}
                <motion.section variants={itemVariants}>
                  <SectionHeading title="Contact" />

                  {profile.open_to_contact ? (
                    <>
                      {profile.contact_notes ? (
                        <div className="ml-7 mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {profile.contact_notes}
                          </p>
                        </div>
                      ) : null}

                      <div className="ml-7 flex flex-wrap gap-2">
                        {profile.linkedin_url ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </a>
                          </Button>
                        ) : null}

                        {profile.email ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={`mailto:${profile.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="ml-7 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">
                        This member is not currently available for contact.
                      </p>
                    </div>
                  )}
                </motion.section>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
