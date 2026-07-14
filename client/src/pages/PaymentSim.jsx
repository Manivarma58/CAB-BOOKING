import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../api';
import toast from 'react-hot-toast';
import { CreditCard, ShieldCheck, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentSim = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingId = searchParams.get('bookingId');
  const sessionId = searchParams.get('sessionId');
  const amount = searchParams.get('amount') || '0';

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (status) => {
    setLoading(true);
    try {
      const paymentId = `pay_stripe_sim_${Math.random().toString(36).substring(2, 10)}`;
      const res = await paymentAPI.verify({
        bookingId,
        sessionId,
        paymentId,
        status: status === 'success' ? 'success' : 'fail'
      });

      if (status === 'success') {
        toast.success('Payment authorized successfully!');
        navigate('/bookings?success=true');
      } else {
        toast.error('Payment cancelled or failed.');
        navigate('/bookings?cancel=true');
      }
    } catch (err) {
      console.error('Payment verify error:', err);
      toast.error('Transaction verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-8">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-black">
              U
            </div>
            <span className="text-lg font-black tracking-tight">UCab Payment Portal</span>
          </div>
          <span className="rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-xs text-secondary font-bold uppercase">
            Sandbox
          </span>
        </div>

        {/* Amount description */}
        <div className="text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-900">
          <p className="text-xs text-slate-400 font-medium">Transaction Amount</p>
          <p className="text-3xl font-extrabold text-white mt-1">₹{Number(amount).toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2 font-mono">Session: {sessionId?.slice(0, 16)}...</p>
        </div>

        {/* Card Mock inputs */}
        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Card Number</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-650">
                <CreditCard className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none"
                placeholder="4242 4242 4242 4242"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-sm focus:border-primary focus:outline-none text-center"
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-sm focus:border-primary focus:outline-none text-center"
                placeholder="•••"
              />
            </div>
          </div>
        </div>

        {/* Guarantee Info */}
        <div className="flex gap-2.5 items-start rounded-2xl bg-emerald-950/20 border border-emerald-900/30 p-4 text-xs text-emerald-450 text-left">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            Secure sandbox payment simulator. Selecting <strong>Authorize</strong> will trigger a mock webhook API confirm event and update booking status to confirmed.
          </p>
        </div>

        {/* Actions */}
        <div className="grid gap-3 pt-2">
          <button
            onClick={() => handlePayment('success')}
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-3 text-base font-bold text-white hover:bg-primary-dark disabled:opacity-50 transition shadow-lg shadow-primary/20"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              'Authorize Payment (Success)'
            )}
          </button>
          
          <button
            onClick={() => handlePayment('fail')}
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            Cancel / Fail Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSim;
