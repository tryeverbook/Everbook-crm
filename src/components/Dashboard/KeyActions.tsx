import React from 'react';
import { CheckCircle2, Mail, MessageSquare, FileText, CalendarDays, Sparkles } from 'lucide-react';

export interface KeyActionItem {
	id: string;
	title: string;
	description: string;
	category: 'lead_response' | 'draft_review' | 'template' | 'tour_review' | 'event_review';
	dueAt?: string;
}

interface KeyActionsProps {
	actions: KeyActionItem[];
	onApprove?: (id: string) => void;
	onDismiss?: (id: string) => void;
}

const categoryIconMap: Record<KeyActionItem['category'], React.ComponentType<{ className?: string }>> = {
	lead_response: MessageSquare,
	draft_review: Mail,
	template: FileText,
	tour_review: CalendarDays,
	event_review: CalendarDays,
};

const categoryPillMap: Record<KeyActionItem['category'], string> = {
	lead_response: 'bg-blue-50 text-blue-700 border-blue-200',
	draft_review: 'bg-purple-50 text-purple-700 border-purple-200',
	template: 'bg-amber-50 text-amber-700 border-amber-200',
	tour_review: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	event_review: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const KeyActions: React.FC<KeyActionsProps> = ({ actions, onApprove, onDismiss }) => {
	return (
		<div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30">
			<div className="px-6 py-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-serif font-semibold text-charcoal">Key Actions</h3>
					<Sparkles className="h-5 w-5 text-gold" />
				</div>
				<div className="space-y-4">
					{actions.length === 0 && (
						<div className="text-center text-gray-500 py-8">You're all caught up ✨</div>
					)}
					{actions.map((action, index) => {
						const Icon = categoryIconMap[action.category];
						return (
							<div
								key={action.id}
								className="flex items-start justify-between bg-white shadow-soft rounded-2xl border border-champagne/20 p-4 hover:shadow-elegant transition-all duration-200 animate-slide-up"
								style={{ animationDelay: `${index * 60}ms` }}
							>
								<div className="flex items-start">
									<div className="p-2 rounded-xl bg-gradient-to-br from-blush to-mauve text-white shadow-soft mr-4">
										<Icon className="h-5 w-5" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h4 className="text-charcoal font-serif font-semibold">{action.title}</h4>
											<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${categoryPillMap[action.category]}`}>
												{action.category.replace('_', ' ')}
											</span>
										</div>
										<p className="text-sm text-gray-600 mt-1">{action.description}</p>
										{action.dueAt && (
											<p className="text-xs text-gray-500 mt-1">Due {new Date(action.dueAt).toLocaleString()}</p>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={() => onApprove?.(action.id)}
										className="inline-flex items-center px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
									>
										<CheckCircle2 className="h-4 w-4 mr-1" /> Approve
									</button>
									<button
										onClick={() => onDismiss?.(action.id)}
										className="inline-flex items-center px-3 py-2 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
									>
										Dismiss
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};



