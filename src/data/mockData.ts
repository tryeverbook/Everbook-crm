import { faker } from '@faker-js/faker';
import { Client, Event, Task, Vendor, DashboardStats, Activity } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Generate mock clients
export const mockClients: Client[] = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  partnerName: faker.datatype.boolean() ? faker.person.fullName() : undefined,
  eventDate: faker.date.future().toISOString(),
  eventType: faker.helpers.arrayElement(['wedding', 'corporate', 'birthday', 'anniversary', 'other']),
  budget: Number(faker.commerce.price({ min: 5000, max: 100000 })),
  status: faker.helpers.arrayElement(['lead', 'consultation', 'booked', 'planning', 'completed']),
  notes: faker.lorem.paragraph(),
  createdAt: faker.date.past().toISOString(),
}));

// Generate mock tasks
const generateTasks = (eventId: string): Task[] => {
  return Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    eventId,
    title: faker.helpers.arrayElement([
      'Book venue', 'Finalize menu', 'Photography session', 'Send invitations',
      'Flower arrangement', 'Music setup', 'Decoration planning', 'Final walkthrough'
    ]),
    description: faker.lorem.sentence(),
    dueDate: faker.date.future().toISOString(),
    status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed']),
    assignedTo: faker.person.fullName(),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    category: faker.helpers.arrayElement(['venue', 'catering', 'decoration', 'photography', 'music', 'other']),
  }));
};

// Generate mock events
export const mockEvents: Event[] = Array.from({ length: 12 }, () => {
  const eventId = faker.string.uuid();
  const client = faker.helpers.arrayElement(mockClients);
  return {
    id: eventId,
    clientId: client.id,
    clientName: client.name,
    name: faker.helpers.arrayElement([
      'Sarah & John Wedding', 'Corporate Gala 2024', 'Birthday Celebration',
      'Anniversary Party', 'Product Launch Event', 'Christmas Corporate Party'
    ]),
    type: faker.helpers.arrayElement(['wedding', 'corporate', 'birthday', 'anniversary', 'other']),
    date: faker.date.future().toISOString(),
    venue: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hall', 'Resort', 'Garden', 'Hotel']),
    guestCount: faker.number.int({ min: 50, max: 300 }),
    budget: Number(faker.commerce.price({ min: 10000, max: 150000 })),
    status: faker.helpers.arrayElement(['planning', 'confirmed', 'in-progress', 'completed', 'cancelled']),
    progress: faker.number.int({ min: 10, max: 100 }),
    tasks: generateTasks(eventId),
    createdAt: faker.date.past().toISOString(),
  };
});

// Generate mock vendors
export const mockVendors: Vendor[] = Array.from({ length: 25 }, () => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  category: faker.helpers.arrayElement(['venue', 'catering', 'photography', 'videography', 'music', 'flowers', 'decoration', 'other']),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  website: faker.internet.url(),
  rating: Number(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })),
  priceRange: faker.helpers.arrayElement(['low', 'medium', 'high']),
  description: faker.lorem.paragraph(),
  tags: faker.helpers.arrayElements(['reliable', 'creative', 'affordable', 'premium', 'flexible', 'experienced'], { min: 2, max: 4 }),
  lastContacted: faker.datatype.boolean() ? faker.date.past().toISOString() : undefined,
}));

// Generate mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalClients: mockClients.length,
  activeEvents: mockEvents.filter(e => ['planning', 'confirmed', 'in-progress'].includes(e.status)).length,
  upcomingDeadlines: 8,
  monthlyRevenue: Number(faker.commerce.price({ min: 50000, max: 200000 })),
  recentActivities: Array.from({ length: 6 }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['client_added', 'event_created', 'task_completed', 'vendor_contacted']),
    description: faker.lorem.sentence(),
    timestamp: faker.date.recent().toISOString(),
    relatedEntity: faker.person.fullName(),
  })),
};
