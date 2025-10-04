// Top-level module (imports)
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable/EnhancedCard';
import Button from '@/components/reusable/Button';
import Badge from '@/components/reusable/Badge';
import { Avatar } from '@/components/reusable/Avatar';
import { MessageCircle } from 'lucide-react' // removed Star
import { Agent } from '@/types/api';

interface AssignedAgentCardProps {
  agent: Agent;
  assignedAt: string;
  propertyId: string;
}

export default function AssignedAgentCard({ agent, assignedAt, propertyId }: AssignedAgentCardProps) {
  // Removed contact toggle state
  // const [showContact, setShowContact] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  // Safeguard missing fields from backend
  const specializations = Array.isArray(agent?.specializations) ? agent.specializations : [];
  const safeName = agent?.name || 'Agent';
  const safeAvatar = agent?.avatar || '';

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          Agent Assigned
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar
            src={safeAvatar}
            alt={safeName}
            fallback={safeName.split(' ').map(n => n[0]).join('')}
            className="h-16 w-16"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{safeName}</h3>
                <p className="text-gray-600">{agent.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {/* Removed star icon and rating */}
                  <Badge variant="secondary">{agent.experience}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const email = agent?.email?.trim();
                    const phone = agent?.phone?.trim();
                    if (email) {
                      window.location.href = `mailto:${email}`;
                    } else if (phone) {
                      window.location.href = `tel:${phone}`;
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{agent.bio}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Assigned on {formatDate(assignedAt)}
            </div>

            {/* Removed inline contact information (email, phone, office) */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}