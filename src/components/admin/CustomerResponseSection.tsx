import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Mail, 
  Send, 
  History, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { OrderRecord } from '../../types/order';
import { TemplateType, CommunicationChannel, CommunicationLog } from '../../types/communication';
import { generateOrderResponse } from '../../lib/orderResponseTemplates';
import { getCommunicationLogs, saveCommunicationLog } from '../../lib/storage';
import { useAuth } from '../../context/AuthContext';
import { InstagramIcon } from '../common/Icons';

interface CustomerResponseSectionProps {
  order: OrderRecord;
  onStatusChange?: (newStatus: string) => void;
}

const TEMPLATE_OPTIONS: Array<{ type: TemplateType; label: string }> = [
  { type: 'order_confirmed', label: '1. Order Confirmed — Proceed to Payment' },
  { type: 'partially_available', label: '2. Partially Available' },
  { type: 'out_of_stock', label: '3. Out of Stock' },
  { type: 'payment_received', label: '4. Payment Received' },
  { type: 'ready_for_collection', label: '5. Ready for Collection' },
  { type: 'out_for_delivery', label: '6. Out for Delivery' }
];

export const CustomerResponseSection: React.FC<CustomerResponseSectionProps> = ({ order }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('order_confirmed');
  const [availableItemIds, setAvailableItemIds] = useState<string[]>(
    order.items.map((i) => i.productId)
  );
  const [unavailableItemIds, setUnavailableItemIds] = useState<string[]>([]);
  const [editedMessage, setEditedMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [logs, setLogs] = useState<CommunicationLog[]>([]);

  // Load existing communication logs for this order
  const loadLogs = () => {
    setLogs(getCommunicationLogs(order.id));
  };

  useEffect(() => {
    loadLogs();
  }, [order.id]);

  // Regenerate message template when template type or availability changes
  useEffect(() => {
    const generated = generateOrderResponse(selectedTemplate, {
      order,
      availableItemIds,
      unavailableItemIds
    });
    setEditedMessage(generated);
  }, [selectedTemplate, availableItemIds, unavailableItemIds, order]);

  // Handle Item Availability Toggles for Partial / Out of Stock
  const toggleItemAvailability = (productId: string) => {
    if (availableItemIds.includes(productId)) {
      setAvailableItemIds(availableItemIds.filter((id) => id !== productId));
      setUnavailableItemIds([...unavailableItemIds, productId]);
    } else {
      setUnavailableItemIds(unavailableItemIds.filter((id) => id !== productId));
      setAvailableItemIds([...availableItemIds, productId]);
    }
  };

  const handleResetTemplate = () => {
    const generated = generateOrderResponse(selectedTemplate, {
      order,
      availableItemIds,
      unavailableItemIds
    });
    setEditedMessage(generated);
  };

  const logCommunication = (channel: CommunicationChannel, status: 'Sent' | 'Copied' | 'Logged') => {
    const adminName = user?.name || 'VETANIC Staff';
    saveCommunicationLog({
      orderId: order.id,
      orderReference: order.orderReference,
      templateType: selectedTemplate,
      channel,
      message: editedMessage,
      adminUser: adminName,
      status
    });
    loadLogs();
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedMessage);
      setCopySuccess(true);
      logCommunication('Other', 'Copied');
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // WhatsApp trigger
  const handleWhatsApp = () => {
    const cleanedPhone = order.customer.contactNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(editedMessage)}`;
    logCommunication('WhatsApp', 'Sent');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Email trigger
  const handleEmail = () => {
    const subject = `VETANIC Singapore Order ${order.orderReference} Update`;
    const mailto = `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(editedMessage)}`;
    logCommunication('Email', 'Sent');
    window.location.href = mailto;
  };

  const handleManualLog = () => {
    let channel: CommunicationChannel = 'WhatsApp';
    if (order.customer.preferredContact === 'Telegram') channel = 'Telegram';
    else if (order.customer.preferredContact === 'Instagram DM') channel = 'Instagram';
    else if (order.customer.preferredContact === 'SMS') channel = 'SMS';

    logCommunication(channel, 'Logged');
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2000);
  };

  const isPartialOrOos = selectedTemplate === 'partially_available' || selectedTemplate === 'out_of_stock';

  return (
    <div className="bg-white rounded-3xl border border-[#DED7CE] shadow-soft p-6 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DED7CE]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#9E2328]/10 text-[#9E2328] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-[#222222]">
              Customer Response
            </h2>
            <p className="text-xs text-[#6F6A65]">
              Select a pre-populated message template, review or customize, then send via customer's preferred channel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#6F6A65] uppercase tracking-wider mr-1">
            Preferred:
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#9E2328] bg-[#9E2328]/10 px-2.5 py-1 rounded-lg border border-[#9E2328]/20">
            {order.customer.preferredContact}
          </span>
        </div>
      </div>

      {/* Template Selector & Partial Inventory Configuration */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider mb-1.5">
              Select Message Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
              className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DED7CE] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] cursor-pointer"
            >
              {TEMPLATE_OPTIONS.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetTemplate}
            className="self-end inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6A65] hover:text-[#222222] px-3 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] hover:bg-[#E9E0D4]/60 transition-colors"
            title="Reset to default template text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Master Text</span>
          </button>
        </div>

        {/* Item Stock Availability Selector (for Partial / Out of Stock) */}
        {isPartialOrOos && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 animate-soft-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Configure Item Availability for this Message:</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Toggle items below to mark which products are in stock vs unavailable. The template copy will update automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {order.items.map((item) => {
                const isAvailable = availableItemIds.includes(item.productId);
                return (
                  <button
                    key={item.productId}
                    type="button"
                    onClick={() => toggleItemAvailability(item.productId)}
                    className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isAvailable
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-red-50 border-red-200 text-red-800 font-semibold'
                    }`}
                  >
                    <span className="truncate pr-2">{item.productName} (×{item.quantity})</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isAvailable ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Editable Message Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider">
              Message Preview (Editable before sending)
            </label>
            <span className="text-[11px] text-[#6F6A65] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#9E2328]" />
              Auto-filled with customer & order data
            </span>
          </div>
          <textarea
            rows={10}
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full font-mono text-xs p-4 rounded-2xl border border-[#DED7CE] bg-[#FAF7F2] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] focus:border-[#9E2328] leading-relaxed resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Copy Message Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#222222] font-bold text-xs py-3 px-4 rounded-xl border border-[#DED7CE] shadow-xs transition-colors cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#6F6A65]" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>

          {/* Email Button */}
          <button
            type="button"
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#222222] font-bold text-xs py-3 px-4 rounded-xl border border-[#DED7CE] transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#6F6A65]" />
            <span>Send via Email</span>
          </button>

          {/* Mark as Contacted / Log to History */}
          <button
            type="button"
            onClick={handleManualLog}
            className="flex items-center justify-center gap-2 bg-[#9E2328] hover:bg-[#841C21] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {logSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Logged!</span>
              </>
            ) : (
              <>
                <History className="w-4 h-4" />
                <span>Mark as Contacted</span>
              </>
            )}
          </button>
        </div>

        {/* Telegram / Instagram Profile Shortcut if available */}
        {(order.customer.telegramHandle || order.customer.instagramAccount) && (
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="text-[#6F6A65] font-semibold">Social Handles:</span>
            {order.customer.telegramHandle && (
              <a
                href={`https://t.me/${order.customer.telegramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logCommunication('Telegram', 'Sent')}
                className="inline-flex items-center gap-1 bg-[#0088cc]/10 text-[#0088cc] px-2.5 py-1 rounded-lg border border-[#0088cc]/20 font-semibold hover:bg-[#0088cc]/20"
              >
                <Send className="w-3 h-3" />
                <span>Open {order.customer.telegramHandle}</span>
              </a>
            )}
            {order.customer.instagramAccount && (
              <a
                href={`https://instagram.com/${order.customer.instagramAccount.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logCommunication('Instagram', 'Sent')}
                className="inline-flex items-center gap-1 bg-[#E1306C]/10 text-[#E1306C] px-2.5 py-1 rounded-lg border border-[#E1306C]/20 font-semibold hover:bg-[#E1306C]/20"
              >
                <InstagramIcon className="w-3 h-3" />
                <span>Open {order.customer.instagramAccount}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Communication History Log Timeline */}
      <div className="pt-6 border-t border-[#DED7CE] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#9E2328]" />
            <span>Communication History ({logs.length})</span>
          </h3>
          <span className="text-[11px] text-[#6F6A65]">
            Automatic records of customer outreach
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-center text-xs text-[#6F6A65]">
            No customer communication recorded yet for this order.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#222222]">
                      {log.templateType.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[10px] bg-white border border-[#DED7CE] px-2 py-0.5 rounded-md text-[#6F6A65]">
                      via {log.channel}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      {log.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6F6A65]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.adminUser}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleDateString('en-SG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6F6A65] line-clamp-2 bg-white/80 p-2 rounded-xl border border-[#DED7CE]/70 font-mono">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
