import { type NetworkProfile } from '@/data/mockNetworkData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, Briefcase, User, MessageCircle } from 'lucide-react';

interface ProfileDetailProps {
  profile: NetworkProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDetail({ profile, isOpen, onClose }: ProfileDetailProps) {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl ring-1 ring-primary/20">
              {profile.first_name[0]}{profile.last_name[0]}
            </div>
            <div>
              <div className="text-xl">
                {profile.first_name} {profile.last_name}
              </div>
              <Badge variant={profile.contact_type === 'alumni' ? 'default' : 'secondary'}>
                {profile.contact_type === 'alumni' ? 'Alumni' : 'Executive'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Position */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">Current Position</h3>
            </div>
            <div className="ml-7">
              <p className="font-medium">{profile.current_role}</p>
              <p className="text-gray-600">{profile.current_company}</p>
              <p className="text-sm text-gray-500 mt-1">{profile.current_role_desc}</p>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">About</h3>
              </div>
              <p className="ml-7 text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Past Experience */}
          {profile.past_experience.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Past Experience</h3>
              <div className="space-y-3">
                {profile.past_experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-gray-300 pl-4 ml-2">
                    <p className="font-medium">{exp.role}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies / Interests */}
          {profile.hobbies.length > 0 && (
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
          )}

          {/* Contact Information */}
          {profile.open_to_contact && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Contact Information</h3>
              </div>
              
              {profile.contact_notes && (
                <div className="ml-7 mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-gray-700">{profile.contact_notes}</p>
                </div>
              )}

              <div className="ml-7 flex flex-wrap gap-2">
                {profile.linkedin_url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.email && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {!profile.open_to_contact && (
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
