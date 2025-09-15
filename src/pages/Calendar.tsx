import React, { useMemo, useState } from 'react';
import { mockEvents, mockTours } from '../data/mockData';
import { Event, Tour } from '../types';
import { Calendar as CalendarIcon, Plus, X, Users, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isToday } from 'date-fns';

type CalendarItem = (Event | Tour) & { kind: 'event' | 'tour' };

export const Calendar: React.FC = () => {
  const [items, setItems] = useState<CalendarItem[]>([
    ...mockEvents.map(e => ({ ...e, kind: 'event' as const })),
    ...mockTours.map(t => ({ ...t, kind: 'tour' as const })),
  ]);

  const [selected, setSelected] = useState<CalendarItem | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const monthMatrix = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    const matrix: { date: Date; entries: CalendarItem[] }[] = [];
    let cursor = start;
    while (cursor <= end) {
      const dayDate = cursor;
      const dayEntries = items
        .filter(i => new Date(i.date).toDateString() === dayDate.toDateString())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      matrix.push({ date: dayDate, entries: dayEntries });
      cursor = addDays(cursor, 1);
    }
    return matrix;
  }, [items, currentMonth]);

  const addQuick = () => {
    const id = Math.random().toString(36).slice(2);
    const when = new Date();
    when.setDate(when.getDate() + 1);
    const newTour: CalendarItem = {
      id,
      kind: 'tour',
      leadId: id,
      leadName: 'Walk-in Lead',
      date: when.toISOString(),
      venue: 'Main Hall',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    } as any;
    setItems([newTour, ...items]);
  };

  const addQuickEvent = () => {
    const id = Math.random().toString(36).slice(2);
    const when = new Date();
    when.setDate(when.getDate() + 2);
    const newEvent: CalendarItem = {
      id,
      kind: 'event',
      clientId: id,
      clientName: 'New Client',
      name: 'New Event',
      type: 'wedding',
      date: when.toISOString(),
      venue: 'Main Hall',
      guestCount: 100,
      budget: 50000,
      status: 'planning',
      progress: 0,
      tasks: [],
      createdAt: new Date().toISOString(),
    } as any;
    setItems([newEvent, ...items]);
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">Calendar</h1>
          <p className="text-lg text-gray-600">Tours and weddings at a glance.</p>
        </div>
        <div className="mt-6 lg:mt-0 flex gap-3">
          <button onClick={addQuick} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transition-all">
            <Plus className="h-5 w-5 mr-2" /> Quick Add Tour
          </button>
          <button onClick={addQuickEvent} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transition-all">
            <Plus className="h-5 w-5 mr-2" /> Quick Add Event
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-4">
        <div className="flex items-center justify-between px-2 pb-4">
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 rounded-xl hover:bg-champagne/40"><ChevronLeft className="h-5 w-5" /></button>
          <div className="text-lg font-serif font-semibold text-charcoal">{format(currentMonth, 'MMMM yyyy')}</div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-champagne/40"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-xs text-gray-500 px-2 py-1">{d}</div>
          ))}
          {monthMatrix.map(({ date, entries }) => (
            <div key={date.toISOString()} className={`min-h-28 bg-white rounded-2xl border border-champagne/30 p-2 flex flex-col ${!isSameMonth(date, currentMonth) ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <div className={`text-xs font-medium ${isToday(date) ? 'text-blush' : 'text-gray-600'}`}>{format(date, 'd')}</div>
                <button
                  onClick={() => {
                    const id = Math.random().toString(36).slice(2);
                    const newTour: CalendarItem = {
                      id,
                      kind: 'tour',
                      leadId: id,
                      leadName: 'Quick Tour',
                      date: new Date(date.setHours(11, 0, 0, 0)).toISOString(),
                      venue: 'Main Hall',
                      status: 'scheduled',
                      createdAt: new Date().toISOString(),
                    } as any;
                    setItems([...items, newTour]);
                  }}
                  className="text-xs text-gray-400 hover:text-charcoal"
                >+ Tour</button>
              </div>
              <div className="space-y-1 overflow-hidden">
                {entries.slice(0, 3).map(it => (
                  <button key={it.id} onClick={() => setSelected(it)} className={`w-full text-left text-xs rounded-lg px-2 py-1 border ${it.kind === 'event' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} truncate`}>
                    {it.kind === 'event' ? '💒 ' + (it as Event).name : 'Tour: ' + (it as any).leadName}
                  </button>
                ))}
                {entries.length > 3 && (
                  <div className="text-[10px] text-gray-500">+{entries.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative z-50 max-w-lg w-full bg-white rounded-2xl shadow-elegant border border-champagne/30">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-xl font-serif font-semibold text-charcoal">{selected.kind === 'event' ? (selected as Event).name : 'Tour with ' + (selected as any).leadName}</h4>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-50">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy • h:mm a')}</div>
                <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-gray-400" />{selected.kind === 'event' ? (selected as Event).clientName + ' • ' + (selected as Event).guestCount + ' guests' : (selected as any).leadName}</div>
                <div className="flex items-center"><Info className="h-4 w-4 mr-2 text-gray-400" />{selected.kind === 'event' ? (selected as Event).status : (selected as any).status}</div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                {selected.kind === 'event' && (
                  <button
                    onClick={() => {
                      setItems(items.map(i => {
                        if (i.id !== selected.id) return i;
                        const ev = i as any;
                        const newTask = {
                          id: Math.random().toString(36).slice(2),
                          eventId: ev.id,
                          title: 'New Task',
                          description: 'Added from calendar',
                          dueDate: ev.date,
                          status: 'pending',
                          assignedTo: 'Unassigned',
                          priority: 'medium',
                          category: 'other',
                        };
                        return { ...ev, tasks: [...(ev.tasks || []), newTask] } as any;
                      }));
                    }}
                    className="px-4 py-2 rounded-xl border border-champagne/40 hover:bg-gray-50"
                  >
                    Add Task for this day
                  </button>
                )}
                <button className="px-4 py-2 rounded-xl border border-champagne/40 hover:bg-gray-50">Close</button>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blush to-mauve text-white shadow-soft hover:shadow-elegant">Open</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


