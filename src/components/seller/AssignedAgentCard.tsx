'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable/EnhancedCard';
import Button from '@/components/reusable/Button';
import Badge from '@/components/reusable/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/reusable/Avatar';
import { Star, Phone, Mail, MessageCircle, Calendar, MapPin } from 'lucide-react';
import { Agent } from '@/types/api';

interface AssignedAgentCardProps {
  agent: Agent;
  assignedAt: string;
  propertyId: string;
}

export default function AssignedAgentCard({ agent, assignedAt, propertyId }: AssignedAgentCardProps) {
  const [showContact, setShowContact] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <Avatar className="h-16 w-16">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-gray-600">{agent.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{agent.rating}</span>
                    <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                  </div>
                  <Badge variant="secondary">{agent.experience}</Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContact(!showContact)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">{agent.bio}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {agent.specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-green-600 font-medium">
                {agent.propertiesSold} properties sold
              </span>
              <span className="text-blue-600 font-medium">
                Avg. {agent.averageDaysOnMarket} days on market
              </span>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              Assigned on {formatDate(assignedAt)}
            </div>
            
            {showContact && (
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${agent.phone}`} className="text-blue-600 hover:underline">
                      {agent.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${agent.email}`} className="text-blue-600 hover:underline">
                      {agent.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{agent.office}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}