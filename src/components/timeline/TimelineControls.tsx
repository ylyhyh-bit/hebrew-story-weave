import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Filter, 
  Users, 
  Star,
  Heart,
  GraduationCap,
  Home,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface TimelineControlsProps {
  onYearJump: (year: number) => void;
  onTypeFilter: (type: string) => void;
  onMemberFilter: (member: string) => void;
  activeFilters: {
    type: string;
    member: string;
  };
  eventCounts: Record<string, number>;
  familyMembers: Record<string, any>;
}

const quickYears = [
  { year: 1900, label: 'תחילת המאה', decade: '1900s' },
  { year: 1920, label: 'שנות העשרים', decade: '1920s' },
  { year: 1940, label: 'שנות הארבעים', decade: '1940s' },
  { year: 1948, label: 'הקמת המדינה', decade: '1948' }
];

const eventTypes = [
  { key: 'birth', label: 'לידות', icon: Heart, color: 'timeline-birth' },
  { key: 'marriage', label: 'נישואין', icon: Heart, color: 'timeline-marriage' },
  { key: 'achievement', label: 'הישגים', icon: GraduationCap, color: 'timeline-achievement' },
  { key: 'cultural', label: 'תרבות', icon: Star, color: 'timeline-cultural' },
  { key: 'tradition', label: 'מסורת', icon: Home, color: 'timeline-tradition' }
];

export function TimelineControls({ 
  onYearJump, 
  onTypeFilter, 
  onMemberFilter, 
  activeFilters, 
  eventCounts,
  familyMembers 
}: TimelineControlsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <Card className="p-6 shadow-elegant">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          ניווט מהיר
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickYears.map((item) => (
            <Button
              key={item.year}
              variant="outline"
              className="h-auto p-3 flex flex-col gap-1 hover:shadow-md transition-all duration-300"
              onClick={() => onYearJump(item.year)}
            >
              <span className="font-semibold">{item.decade}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Event Type Filters */}
      <Card className="p-6 shadow-elegant">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          סוגי אירועים
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            variant={activeFilters.type === 'all' ? 'heritage' : 'outline'}
            className="justify-start h-auto p-3"
            onClick={() => onTypeFilter('all')}
          >
            <div className="flex items-center justify-between w-full">
              <span>כל האירועים</span>
              <Badge variant="secondary">
                {Object.values(eventCounts).reduce((a, b) => a + b, 0)}
              </Badge>
            </div>
          </Button>
          
          {eventTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.key}
                variant={activeFilters.type === type.key ? 'heritage' : 'outline'}
                className="justify-start h-auto p-3"
                onClick={() => onTypeFilter(type.key)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </div>
                  <Badge variant="secondary">
                    {eventCounts[type.key] || 0}
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Family Member Filters */}
      <Card className="p-6 shadow-elegant">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          בני המשפחה
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant={activeFilters.member === 'all' ? 'heritage' : 'outline'}
            className="justify-start h-auto p-3"
            onClick={() => onMemberFilter('all')}
          >
            <div className="flex items-center justify-between w-full">
              <span>כל בני המשפחה</span>
              <Badge variant="secondary">
                {Object.keys(familyMembers).length}
              </Badge>
            </div>
          </Button>
          
          {Object.entries(familyMembers).map(([id, member]) => (
            <Button
              key={id}
              variant={activeFilters.member === id ? 'heritage' : 'outline'}
              className="justify-start h-auto p-4"
              onClick={() => onMemberFilter(id)}
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">{member.role}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Scroll Helpers */}
      <Card className="p-4 shadow-elegant">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">ניווט מהיר</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className="w-4 h-4" />
              למעלה
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              <ArrowDown className="w-4 h-4" />
              למטה
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}