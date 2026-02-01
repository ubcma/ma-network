import { type NetworkProfile } from "@/utils/networkProfileUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Briefcase, User, MessageCircle, Users } from "lucide-react";

interface ProfileDetailProps {
  profile: NetworkProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDetail({ profile, isOpen, onClose }: ProfileDetailProps) {
  if (!profile) return null;

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`;
  const maPosition = profile.ma_role?.position?.trim();
  const maPortfolio = profile.ma_role?.portfolio?.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {/* Photo / Avatar */}
            <div className="w-12 h-12 rounded-full bg-primary/10 ring-1 ring-primary/20 overflow-hidden flex items-center justify-center shrink-0">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-primary font-bold text-lg">{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-xl truncate">
                {profile.first_name} {profile.last_name}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant={profile.contact_type === "alumni" ? "default" : "secondary"}>
                  {profile.contact_type === "alumni" ? "Alumni" : "Executive"}
                </Badge>

                {/* MA role badge (position + portfolio) */}
                {maPosition ? (
                  <Badge variant="outline" className="truncate max-w-[520px]">
                    MA: {maPosition}
                    {maPortfolio ? ` • ${maPortfolio}` : ""}
                  </Badge>
                ) : null}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* MA Role (explicit section, only if portfolio exists or you want it prominent) */}
          {(maPosition || maPortfolio) ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">UBCMA Role</h3>
              </div>
              <div className="ml-7">
                {maPosition ? (
                  <p className="font-medium">{maPosition}</p>
                ) : (
                  <p className="font-medium">—</p>
                )}
                {maPortfolio ? (
                  <p className="text-gray-600">Portfolio: {maPortfolio}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Current Position */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">Current Position</h3>
            </div>
            <div className="ml-7">
              <p className="font-medium">
                {profile.current_role || "—"}
                {profile.current_company ? (
                  <span className="font-normal text-gray-600">{` @ ${profile.current_company}`}</span>
                ) : null}
              </p>
              {profile.current_role_desc ? (
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                  {profile.current_role_desc}
                </p>
              ) : null}
            </div>
          </div>

          {/* About */}
          {profile.bio ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">About</h3>
              </div>
              <p className="ml-7 text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          ) : null}

          {/* Past Experience */}
          {profile.past_experience?.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-3">Past Experience</h3>
              <div className="space-y-3">
                {profile.past_experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-gray-300 pl-4 ml-2">
                    <p className="font-medium">{exp.role}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    {exp.desc ? (
                      <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
                        {exp.desc}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Interests */}
          {profile.hobbies?.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-2">Interests & Topics</h3>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby, idx) => (
                  <Badge key={idx} variant="outline">
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {/* Contact */}
          {profile.open_to_contact ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Contact</h3>
              </div>

              {profile.contact_notes ? (
                <div className="ml-7 mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
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
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                This member is not currently available for contact.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
