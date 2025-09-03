export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  partnerName?: string;
  eventDate?: string;
  eventType: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'other';
  budget: number;
  status: 'lead' | 'consultation' | 'booked' | 'planning' | 'completed';
  notes: string;
  createdAt: string;
}

export interface Event {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  type: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'other';
  date: string;
  venue: string;
  guestCount: number;
  budget: number;
  status: 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  tasks: Task[];
  createdAt: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  category: 'venue' | 'catering' | 'decoration' | 'photography' | 'music' | 'other';
}

export interface Vendor {
  id: string;
  name: string;
  category: 'venue' | 'catering' | 'photography' | 'videography' | 'music' | 'flowers' | 'decoration' | 'other';
  email: string;
  phone: string;
  website?: string;
  rating: number;
  priceRange: 'low' | 'medium' | 'high';
  description: string;
  tags: string[];
  lastContacted?: string;
}

export interface DashboardStats {
  totalClients: number;
  activeEvents: number;
  upcomingDeadlines: number;
  monthlyRevenue: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'client_added' | 'event_created' | 'task_completed' | 'vendor_contacted';
  description: string;
  timestamp: string;
  relatedEntity: string;
}
