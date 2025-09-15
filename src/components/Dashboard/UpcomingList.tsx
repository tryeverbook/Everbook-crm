import React, { useMemo, useState } from 'react';
import { Event } from '../../types';
import { format } from 'date-fns';
import { Calendar, Users, MapPin, Clock, Info, X } from 'lucide-react';

interface UpcomingListProps {
	events: Event[];
}

export const UpcomingList: React.FC<UpcomingListProps> = ({ events }) => {
	const [selected, setSelected] = useState<Event | null>(null);

	const nextSevenDays = useMemo(() => {
		const now = new Date();
		const inSeven = new Date();
		inSeven.setDate(now.getDate() + 7);
		return events
			.filter(e => new Date(e.date) >= now && new Date(e.date) <= inSeven)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [events]);

	return (
		<div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30">
			<div className="px-6 py-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-serif font-semibold text-charcoal">Upcoming (7 days)</h3>
					<Calendar className="h-5 w-5 text-mauve" />
				</div>
				<div className="space-y-3">
					{nextSevenDays.length === 0 && (
						<div className="text-center text-gray-500 py-8">No tours or events this week.</div>
					)}
					{nextSevenDays.map((ev, index) => (
						<button
							key={ev.id}
							onClick={() => setSelected(ev)}
							className="w-full text-left bg-white shadow-soft rounded-2xl border border-champagne/20 p-4 hover:shadow-elegant transition-all duration-200 animate-slide-up"
							style={{ animationDelay: `${index * 60}ms` }}
						>
							<div className="flex items-center justify-between">
								<div>
									<div className="text-charcoal font-serif font-semibold flex items-center gap-2">
										{ev.type === 'wedding' ? '💒' : '📅'} {ev.name}
										<span className="text-xs text-gray-500">{format(new Date(ev.date), 'EEE, MMM d • h:mm a')}</span>
									</div>
									<div className="mt-1 text-sm text-gray-600 flex items-center gap-4">
										<span className="inline-flex items-center"><Users className="h-4 w-4 mr-1 text-gray-400" />{ev.guestCount}</span>
										<span className="inline-flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-400" />{ev.venue}</span>
									</div>
								</div>
								<div className="text-sm text-gray-600 inline-flex items-center"><Clock className="h-4 w-4 mr-1 text-gray-400" />{ev.status}</div>
							</div>
						</button>
					))}
				</div>
			</div>

			{selected && (
				<div className="fixed inset-0 z-40 flex items-center justify-center p-4">
					<div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
					<div className="relative z-50 max-w-lg w-full bg-white rounded-2xl shadow-elegant border border-champagne/30">
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<h4 className="text-xl font-serif font-semibold text-charcoal">{selected.name}</h4>
								<button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-50">
									<X className="h-5 w-5 text-gray-500" />
								</button>
							</div>
							<div className="space-y-2 text-sm text-gray-700">
								<div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-400" />{format(new Date(selected.date), 'EEEE, MMMM d, yyyy • h:mm a')}</div>
								<div className="flex items-center"><Users className="h-4 w-4 mr-2 text-gray-400" />{selected.clientName} • {selected.guestCount} guests</div>
								<div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400" />{selected.venue}</div>
								<div className="flex items-center"><Info className="h-4 w-4 mr-2 text-gray-400" />Status: {selected.status} • Progress: {selected.progress}%</div>
							</div>
							<div className="mt-4 flex items-center justify-end gap-2">
								<button className="px-4 py-2 rounded-xl border border-champagne/40 hover:bg-gray-50">Close</button>
								<button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blush to-mauve text-white shadow-soft hover:shadow-elegant">View Details</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};



