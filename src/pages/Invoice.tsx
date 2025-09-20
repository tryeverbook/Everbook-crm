import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FileText, DollarSign, Mail, CheckCircle2 } from 'lucide-react';

export const InvoicePage: React.FC = () => {
  const { invoiceId } = useParams();
  const API_URL = useMemo(() => ((import.meta as any)?.env?.VITE_API_URL as string) || 'http://localhost:4000', []);
  const [invoice, setInvoice] = useState<any | null>(null);
  const [payer, setPayer] = useState({ name: '', email: '', phone: '' });
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/invoice/${invoiceId}`);
        setInvoice(resp.data?.invoice || null);
      } catch {
        setInvoice(null);
      }
    })();
  }, [API_URL, invoiceId]);

  const pay = async () => {
    try {
      await axios.post(`${API_URL}/api/invoice/${invoiceId}/pay`, { payer });
      setPaid(true);
    } catch {}
  };

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-gray-600">Invoice not found.</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 overflow-hidden">
        <div className="px-6 py-5 border-b border-champagne/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blush/20 to-mauve/20">
              <FileText className="h-6 w-6 text-mauve" />
            </div>
            <div>
              <div className="text-lg font-serif font-semibold text-charcoal">Invoice #{invoice.id.slice(-6)}</div>
              <div className="text-xs text-gray-500">Issued {new Date(invoice.issueDate).toLocaleDateString()}</div>
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2 space-y-4">
            {(invoice.lineItems || []).map((li: any) => (
              <div key={li.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-champagne/30">
                <div className="text-gray-700">{li.description}</div>
                <div className="text-charcoal font-medium">${li.unitPrice.toLocaleString()}</div>
              </div>
            ))}
            <div className="flex items-center justify-between p-4 bg-champagne/20 rounded-2xl border border-champagne/30">
              <div className="text-gray-700">Total</div>
              <div className="text-xl font-serif font-semibold text-charcoal">${invoice.total.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-champagne/30">
              <div className="text-sm font-medium text-charcoal mb-2">Payer Details</div>
              <div className="space-y-2">
                <input value={payer.name} onChange={(e) => setPayer({ ...payer, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 bg-champagne/20 border border-champagne/40 rounded-xl text-sm" />
                <input value={payer.email} onChange={(e) => setPayer({ ...payer, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 bg-champagne/20 border border-champagne/40 rounded-xl text-sm" />
                <input value={payer.phone} onChange={(e) => setPayer({ ...payer, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 bg-champagne/20 border border-champagne/40 rounded-xl text-sm" />
              </div>
            </div>

            <button onClick={pay} disabled={invoice.status === 'paid'} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blush to-mauve text-white rounded-2xl shadow-elegant disabled:opacity-60">
              <DollarSign className="h-5 w-5" /> {invoice.status === 'paid' ? 'Paid' : 'Pay Now'}
            </button>

            {paid && (
              <div className="p-3 text-sm bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Payment received. A receipt has been emailed.
              </div>
            )}

            <div className="p-4 bg-white rounded-2xl border border-champagne/30 text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-2"><Mail className="h-4 w-4" /> Billing Contact</div>
              invoices@rowanhouse.example
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;


