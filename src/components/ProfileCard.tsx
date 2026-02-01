import { type NetworkProfile } from "@/utils/networkProfileUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageCircle, Users } from "lucide-react";

interface ProfileCardProps {
  profile: NetworkProfile;
  onClick: () => void;
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`;

  const maPosition = profile.ma_role?.position?.trim();
  const maPortfolio = profile.ma_role?.portfolio?.trim();

  const currentRole = profile.current_role?.trim();
  const currentCompany = profile.current_company?.trim();

  const id = new URLSearchParams(new URL(profile.profile_photo_url ?? "", window.location.href).search).get("id");
  const photoUrl = `https://drive.google.com/thumbnail?id=${id}`;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-4">
        {/* Avatar / Photo */}
        <div className="w-16 h-16 rounded-full bg-primary/10 ring-1 ring-primary/20 shrink-0 overflow-hidden flex items-center justify-center">
          {profile.profile_photo_url ? (
            <img
              src={photoUrl}
              alt={`${profile.first_name} ${profile.last_name}`}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-primary font-bold text-xl">{initials}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + Badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {profile.first_name} {profile.last_name}
              </h3>

              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant={profile.contact_type === "alumni" ? "default" : "secondary"}>
                  {profile.contact_type === "alumni" ? "Alumni" : "Executive"}
                </Badge>

                {/* MA role (position + portfolio) */}
                {maPosition ? (
                  <Badge variant="outline" className="truncate max-w-[340px]">
                    MA: {maPosition}
                    {maPortfolio ? ` • ${maPortfolio}` : ""}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          {/* Current Position (role @ company) */}
          <div className="flex items-start gap-2 mb-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">
                {currentRole ? currentRole : "—"}
                {currentCompany ? (
                  <span className="font-normal text-gray-600">{` @ ${currentCompany}`}</span>
                ) : null}
              </p>
              {profile.current_role_desc ? (
                <p className="text-gray-600 line-clamp-1">{profile.current_role_desc}</p>
              ) : (
                <p className="text-gray-600 truncate">{currentCompany || "—"}</p>
              )}
            </div>
          </div>

          {/* Portfolio callout (optional, clearer than badge if you want it) */}
          {maPortfolio ? (
            <div className="flex items-start gap-2 mb-2 text-sm">
              <Users className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-gray-700 truncate">
                Portfolio: <span className="text-gray-600">{maPortfolio}</span>
              </p>
            </div>
          ) : null}

          {/* Bio */}
          {profile.bio ? (
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">{profile.bio}</p>
          ) : null}

          {/* Topics */}
          {profile.hobbies?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.hobbies.slice(0, 3).map((hobby, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {hobby}
                </Badge>
              ))}
              {profile.hobbies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.hobbies.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Contact Status */}
          <div className="flex items-center justify-between">
            {profile.open_to_contact ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>Open to contact</span>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Not available for contact</div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
