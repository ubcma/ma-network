"use client";

import { type NetworkProfile } from "@/utils/networkProfileUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <h3 className="text-xs font-medium tracking-widest uppercase  text-(--ink)">{title}</h3>
      <div className="mt-2 h-px w-full bg-white/10" />
    </div>
  );
}

export function ProfileDetail({
  profile,
  isOpen,
  onClose,
}: ProfileDetailProps) {
  if (!profile) return null;

  const initials = `${profile.first_name?.[0] ?? ""}${
    profile.last_name?.[0] ?? ""
  }`;
  const maPosition = profile.ma_role?.position?.trim();
  const maPortfolio = profile.ma_role?.portfolio?.trim();
  const year = profile.year?.trim();

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
      transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const avatarVariants: Variants = {
    hidden: { opacity: 0, scale: 0.93 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* centering logic unchanged */}
      <DialogContent className="profile-dialog max-w-4xl md:min-h-0 min-h-screen max-h-screen rounded-none md:min-w-3xl min-w-screen md:rounded-xs md:max-h-[90vh] overflow-y-auto align-top pr-14">
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
                    className="w-13 h-13 rounded-xs bg-white/10 ring-1 ring-white/15 overflow-hidden flex items-center justify-center shrink-0"
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
                      <span className="text-(--brand) font-semibold text-lg">
                        {initials}
                      </span>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="min-w-0">
                    <div className="text-xl font-semibold text-start leading-tight truncate text-(--ink)">
                      {profile.first_name} {profile.last_name}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge
                        variant={
                          profile.contact_type === "alumni"
                            ? "default"
                            : "secondary"
                        }
                        className="bg-(--brand) text-black border-none"
                      >
                        {profile.contact_type === "alumni"
                          ? "Alumni"
                          : "Executive"}
                      </Badge>

                      {maPosition ? (
                        <Badge
                          variant="outline"
                          className="truncate max-w-[520px] border-white/15 text-(--muted-ink)"
                        >
                          {maPosition}{maPortfolio ? `, ${maPortfolio}` : ""}
                        </Badge>
                      ) : null}

                      {year ? (
                        <Badge
                          variant="outline"
                          className="truncate max-w-[520px] border-white/15 text-(--muted-ink)"
                        >
                          {year}
                        </Badge>
                      ) : null}
                    </div>
                  </motion.div>
                </DialogTitle>
              </DialogHeader>

              {/* Body */}
              <motion.div
                className="space-y-6 mt-4"
                variants={containerVariants}
              >
                {/* Current Position */}
                {profile.current_role && (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="Current Position" />
                    <div className="">
                      <p className="font-medium text-(--ink)">
                        {profile.current_role || "—"}
                        {profile.current_company ? (
                          <span className="font-normal text-(--muted-ink)">{` @ ${profile.current_company}`}</span>
                        ) : null}
                      </p>

                      {profile.current_role_desc ? (
                        <p className="text-sm text-(--muted-ink) mt-1 whitespace-pre-wrap leading-relaxed">
                          {profile.current_role_desc}
                        </p>
                      ) : null}
                    </div>
                  </motion.section>
                )}

                {/* About */}
                {profile.bio ? (
                  <motion.section variants={itemVariants}>
                    <SectionHeading title="About" />
                    <p className=" text-(--muted-ink) whitespace-pre-wrap leading-relaxed">
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
                        <div
                          key={idx}
                          className="border-l-2 border-white/10 pl-4"
                        >
                          <p className="font-medium text-(--ink)">{exp.role}</p>
                          <p className="text-(--muted-ink)">{exp.company}</p>
                          {exp.desc ? (
                            <p className="text-sm text-(--muted-ink) mt-1 whitespace-pre-wrap leading-relaxed">
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
                    <div className="">
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-white/15 text-(--muted-ink)"
                          >
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
                        <div className=" mb-3 p-3 bg-white/5 rounded-xs border border-white/10">
                          <p className="text-sm text-(--muted-ink) whitespace-pre-wrap leading-relaxed">
                            {profile.contact_notes}
                          </p>
                        </div>
                      ) : null}

                      <div className=" flex flex-wrap gap-2">
                        {profile.linkedin_url ? (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-white/15 text-(--ink) hover:bg-white/10"
                          >
                            <a
                              href={profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </a>
                          </Button>
                        ) : null}

                        {profile.email ? (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-white/15 text-(--ink) hover:bg-white/10"
                          >
                            <a href={`mailto:${profile.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className=" p-4 bg-white/5 border border-white/10 rounded-xs">
                      <p className="text-sm text-(--muted-ink)">
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
