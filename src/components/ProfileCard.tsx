import { type NetworkProfile } from '@/data/mockNetworkData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MessageCircle } from 'lucide-react';

interface ProfileCardProps {
  profile: NetworkProfile;
  onClick: () => void;
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <Card 
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0 ring-1 ring-primary/20">
          {profile.first_name[0]}{profile.last_name[0]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-lg">
                {profile.first_name} {profile.last_name}
              </h3>
              <Badge 
                variant={profile.contact_type === 'alumni' ? 'default' : 'secondary'}
                className="mt-1"
              >
                {profile.contact_type === 'alumni' ? 'Alumni' : 'Executive'}
              </Badge>
            </div>
          </div>

          {/* Current Role */}
          <div className="flex items-start gap-2 mb-2 text-sm">
            <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{profile.current_role}</p>
              <p className="text-gray-600">{profile.current_company}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {profile.bio}
          </p>

          {/* Topics */}
          {profile.hobbies.length > 0 && (
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
              <div className="text-gray-500 text-sm">
                Not available for contact
              </div>
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
