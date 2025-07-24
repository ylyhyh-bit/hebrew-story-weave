import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Calendar, 
  Users, 
  Star,
  Heart,
  GraduationCap,
  Home,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';
import timelineData from '@/data/timeline.json';
import heroImage from '@/assets/family-museum-hero.jpg';

interface TimelineEvent {
  id: string;
  date: string;
  hebrewDate: string;
  type: 'birth' | 'marriage' | 'achievement' | 'cultural' | 'tradition';
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  familyMembers: string[];
  location: string;
  culturalContext: string;
  significance: string;
  relatedEvents: string[];
  tags: string[];
}

interface FamilyMember {
  name: string;
  englishName: string;
  birthYear: number;
  description: string;
  role: string;
  characteristics: string[];
}

const eventTypeConfig = {
  birth: { 
    icon: Heart, 
    color: 'timeline-birth', 
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    label: 'לידה' 
  },
  marriage: { 
    icon: Heart, 
    color: 'timeline-marriage', 
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    borderColor: 'border-pink-200 dark:border-pink-800',
    label: 'נישואין' 
  },
  achievement: { 
    icon: GraduationCap, 
    color: 'timeline-achievement', 
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-800',
    label: 'הישג' 
  },
  cultural: { 
    icon: Star, 
    color: 'timeline-cultural', 
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'תרבות' 
  },
  tradition: { 
    icon: Home, 
    color: 'timeline-tradition', 
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
    label: 'מסורת' 
  }
};

export function InteractiveTimeline() {
  const [events] = useState<TimelineEvent[]>(timelineData.events as TimelineEvent[]);
  const [familyMembers] = useState<Record<string, FamilyMember>>(timelineData.familyMembers);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>(events);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter events based on search, type, and family member
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.includes(searchQuery) ||
        event.description.includes(searchQuery) ||
        event.location.includes(searchQuery) ||
        event.tags.some(tag => tag.includes(searchQuery))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    if (selectedMember !== 'all') {
      filtered = filtered.filter(event => event.familyMembers.includes(selectedMember));
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedType, selectedMember, events]);

  const scrollToYear = (year: number) => {
    if (timelineRef.current) {
      const yearElements = timelineRef.current.querySelectorAll('[data-year]');
      const targetElement = Array.from(yearElements).find(el => 
        parseInt(el.getAttribute('data-year') || '0') >= year
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    const IconComponent = eventTypeConfig[type].icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const groupEventsByDecade = (events: TimelineEvent[]) => {
    const grouped = events.reduce((acc, event) => {
      const year = new Date(event.date).getFullYear();
      const decade = Math.floor(year / 10) * 10;
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(event);
      return acc;
    }, {} as Record<number, TimelineEvent[]>);

    return Object.entries(grouped).sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  const getRelatedFamilyMembers = (event: TimelineEvent) => {
    return event.familyMembers.map(memberId => familyMembers[memberId]).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-heritage p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-deep">
          <div className="relative h-80 bg-gradient-to-r from-museum-deep-blue/90 to-museum-bronze/90">
            <img 
              src={heroImage} 
              alt="המוזיאון המשפחתי העברי" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="animate-fade-up">
                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  המוזיאון המשפחתי העברי
                </h1>
                <p className="text-xl text-white/90 mb-6 drop-shadow-md">
                  מסע אינטראקטיבי בהיסטוריה ובמורשת של המשפחה
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30">
                    {filteredEvents.length} אירועים
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30">
                    {Object.keys(familyMembers).length} בני משפחה
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30">
                    חוויה אינטראקטיבית
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8 shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש באירועים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">כל הסוגים</option>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>

            {/* Family Member Filter */}
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">כל בני המשפחה</option>
              {Object.entries(familyMembers).map(([id, member]) => (
                <option key={id} value={id}>{member.name}</option>
              ))}
            </select>

            {/* Zoom Controls */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToYear(1900)}
              className="transition-all duration-300 hover:shadow-md"
            >
              1900s
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToYear(1920)}
              className="transition-all duration-300 hover:shadow-md"
            >
              1920s
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => scrollToYear(1940)}
              className="transition-all duration-300 hover:shadow-md"
            >
              1940s
            </Button>
          </div>
        </Card>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="relative"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        >
          {/* Timeline Line */}
          <div className="absolute right-1/2 top-0 bottom-0 w-1 bg-gradient-primary transform translate-x-1/2 shadow-lg"></div>

          {/* Timeline Events */}
          <div className="space-y-12">
            {groupEventsByDecade(filteredEvents).map(([decade, decadeEvents]) => (
              <div key={decade} className="relative">
                {/* Decade Header */}
                <div 
                  data-year={decade}
                  className="flex justify-center mb-8"
                >
                  <div className="bg-museum-gold text-museum-gold-foreground px-6 py-3 rounded-full shadow-deep font-bold text-lg">
                    שנות ה-{decade}
                  </div>
                </div>

                {/* Events in Decade */}
                {decadeEvents.map((event, index) => {
                  const isLeft = index % 2 === 0;
                  const config = eventTypeConfig[event.type];
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={event.id}
                      className={`relative flex items-center ${isLeft ? 'justify-end' : 'justify-start'} mb-8`}
                      onMouseEnter={() => setHoveredEvent(event.id)}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      {/* Event Card */}
                      <Card
                        className={`
                          w-80 p-6 cursor-pointer transition-all duration-500 hover:shadow-floating
                          ${config.bgColor} ${config.borderColor} border-2
                          ${isLeft ? 'ml-8 animate-slide-in-right' : 'mr-8 animate-slide-in-left'}
                          ${hoveredEvent === event.id ? 'scale-105 shadow-floating' : ''}
                        `}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="space-y-4">
                          {/* Event Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded-full bg-${config.color} text-white`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-lg text-card-foreground">
                                {event.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {event.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{event.hebrewDate}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(event.date).toLocaleDateString('he-IL')}</span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>

                          {/* Description */}
                          <p className="text-card-foreground text-sm leading-relaxed">
                            {event.description}
                          </p>

                          {/* Family Members */}
                          <div className="flex flex-wrap gap-1">
                            {getRelatedFamilyMembers(event).map((member) => (
                              <Badge 
                                key={member.name} 
                                variant="outline" 
                                className="text-xs"
                              >
                                <Users className="w-3 h-3 ml-1" />
                                {member.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>

                      {/* Timeline Dot */}
                      <div className="absolute right-1/2 transform translate-x-1/2">
                        <div 
                          className={`
                            w-6 h-6 rounded-full border-4 border-white shadow-lg
                            bg-${config.color} transition-all duration-300
                            ${hoveredEvent === event.id ? 'scale-125 animate-timeline-pulse' : ''}
                          `}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Event Detail Modal */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-${eventTypeConfig[selectedEvent.type].color} text-white`}>
                      {getEventIcon(selectedEvent.type)}
                    </div>
                    {selectedEvent.title}
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">פרטים</TabsTrigger>
                      <TabsTrigger value="family">משפחה</TabsTrigger>
                      <TabsTrigger value="context">הקשר תרבותי</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">תיאור מלא</h4>
                            <p className="leading-relaxed text-muted-foreground">
                              {selectedEvent.fullDescription}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">משמעות</h4>
                            <p className="text-muted-foreground">
                              {selectedEvent.significance}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">תאריך:</span>
                            <span>{selectedEvent.hebrewDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">מקום:</span>
                            <span>{selectedEvent.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">תקופה:</span>
                            <span>{new Date(selectedEvent.date).toLocaleDateString('he-IL')}</span>
                          </div>

                          <div>
                            <span className="font-medium">תגיות:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedEvent.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="family" className="space-y-4 mt-6">
                      <h4 className="font-semibold text-lg">בני משפחה קשורים</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getRelatedFamilyMembers(selectedEvent).map((member) => (
                          <Card key={member.name} className="p-4">
                            <h5 className="font-semibold text-lg">{member.name}</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              {member.englishName}
                            </p>
                            <p className="text-sm mb-2">{member.description}</p>
                            <p className="text-sm font-medium text-primary mb-2">
                              {member.role}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {member.characteristics.map((char) => (
                                <Badge key={char} variant="outline" className="text-xs">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="context" className="space-y-4 mt-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">הקשר תרבותי</h4>
                        <p className="leading-relaxed text-muted-foreground mb-4">
                          {selectedEvent.culturalContext}
                        </p>
                      </div>

                      {selectedEvent.relatedEvents.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">אירועים קשורים</h4>
                          <div className="space-y-2">
                            {selectedEvent.relatedEvents.map((relatedId) => {
                              const related = events.find(e => e.id === relatedId);
                              return related ? (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => setSelectedEvent(related)}
                                >
                                  <span className="truncate">{related.title}</span>
                                </Button>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}