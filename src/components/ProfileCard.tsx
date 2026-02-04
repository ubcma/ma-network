import { type NetworkProfile } from "@/utils/networkProfileUtils";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ProfileCardProps {
  profile: NetworkProfile;
  onClick: () => void;
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`;

  const maPosition = profile.ma_role?.position?.trim();
  const maPortfolio = profile.ma_role?.portfolio?.trim();
  const year = profile.year?.trim();
  const currentRole = profile.current_role?.trim();
  const currentCompany = profile.current_company?.trim();

  const id = new URLSearchParams(
    new URL(profile.profile_photo_url ?? "", window.location.href).search,
  ).get("id");
  const photoUrl = `https://drive.google.com/thumbnail?id=${id}`;

  const isAlumni = profile.contact_type === "alumni";

  // --- HOBBY TRUNCATION LOGIC ---
  const MAX_CHARS = 50; 
  let currentChars = 0;
  const visibleHobbies: string[] = [];

  (profile.hobbies || []).forEach((hobby) => {
    if (currentChars + hobby.length <= MAX_CHARS && visibleHobbies.length < 5) {
      visibleHobbies.push(hobby);
      currentChars += hobby.length; 
      currentChars += 2; 
    }
  });

  const hiddenCount = (profile.hobbies?.length || 0) - visibleHobbies.length;

  return (
    <Card
      className="glass-card group rounded-xs p-4 md:p-5 cursor-pointer h-full flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex gap-3 md:gap-4">
        {/* LEFT COLUMN: Photo & Status */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          {/* Responsive Avatar: w-14 on mobile, w-16 on desktop */}
          <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xs overflow-hidden bg-white/10 shadow-sm ring-1 ring-white/10">
            {profile.profile_photo_url ? (
              <img
                src={photoUrl}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-(--brand) text-black font-semibold text-lg md:text-xl">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Info */}
        <div className="flex-1 min-w-0">
          {/* Top meta tags */}
          <div className="flex md:flex-row flex-col items-start justify-start md:gap-1 mb-1.5">

            <span className="text-[11px] md:text-xs text-(--muted-ink) font-medium whitespace-nowrap">
              {maPosition && maPosition + ", "} {maPortfolio}  {year ? `(${year})` : ""}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-medium text-(--ink) leading-none mb-2 group-hover:text-(--brand-glow) transition-colors truncate overflow-visible">
            {profile.first_name} {profile.last_name}
          </h3>

          {/* Job Title */}
          {currentRole ? (
            <div className="flex items-start gap-2 text-(--muted-ink) mb-3 md:mb-4">
              <span className="font-medium text-xs leading-snug text-balance">
                {currentRole}
                {currentCompany ? (
                  <span className="text-(--muted-ink)/80 font-normal">
                    {" "}
                    at <span className="text-(--ink) group-hover:text-(--brand-glow) transition-colors duration-200 font-medium"> {currentCompany} </span>
                  </span>
                ) : null}
              </span>
            </div>
          )
        :(
            <div className="flex items-start gap-2 text-(--muted-ink) mb-3 md:mb-4">
              <span className="text-xs leading-snug text-balance text-(--muted-ink) font-normal">
                {isAlumni ? "Alumni, Graduated" : "Undergraduate Student"}
              </span>
            </div>
          )
        }

          {/* Hobbies - Wraps on mobile, Single line on desktop */}
          <div className="flex flex-row gap-1.5 flex-wrap items-center mt-auto overflow-hidden">
            {visibleHobbies.map((hobby, idx) => (
              <span
                key={idx}
                className="inline-flex shrink-0 items-center px-2 py-0.5 text-xs bg-white/10 text-(--muted-ink) rounded-xs truncate max-w-[140px] capitalize"
              >
                {hobby}
              </span>
            ))}
            
            {hiddenCount > 0 && (
              <span className="inline-flex shrink-0 items-center px-2 py-0.5 text-xs bg-white/10 text-(--muted-ink) rounded-xs">
                +{hiddenCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button className="flex items-center gap-1 text-xs font-medium text-(--muted-ink) group-hover:text-(--brand) transition-colors hover:cursor-pointer">
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:-rotate-45" />
        </button>
      </div>
    </Card>
  );
}