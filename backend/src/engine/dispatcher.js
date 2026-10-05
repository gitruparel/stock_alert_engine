// Simulated Notification Dispatcher for Telegram, WhatsApp, and Webhook

export class NotificationDispatcher {
  constructor() {
    this.dispatchLogs = [];
    this.recipients = {
      telegram: {
        channel: "@NSE_Fundamental_Watch",
        bot_handle: "@LongTermAlertBot",
        subscriber_count: 1420
      },
      whatsapp: {
        group_name: "Long-Term Value Investors India (NIFTY Core)",
        phone_preview: "+91 98200 XXXXX"
      },
      webhook: {
        endpoint: "https://api.portfolio-ops.internal/v1/alerts/ingest"
      }
    };
  }

  /**
   * Dispatches an evaluated alert to simulated channels
   */
  dispatch(alert) {
    if (!alert.passed_filter) {
      return null;
    }

    const timestamp = new Date().toISOString();
    const dispatchEntry = {
      dispatch_id: `DISP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      alert_id: alert.id,
      ticker: alert.ticker,
      company_name: alert.company_name,
      event_type: alert.event_type,
      severity: alert.severity,
      dispatched_at: timestamp,
      channels: [
        {
          type: "TELEGRAM",
          target: this.recipients.telegram.channel,
          status: "DELIVERED",
          latency_ms: Math.floor(80 + Math.random() * 120),
          payload: alert.telegram_dispatch
        },
        {
          type: "WHATSAPP",
          target: this.recipients.whatsapp.group_name,
          status: "DELIVERED",
          latency_ms: Math.floor(150 + Math.random() * 180),
          payload: alert.whatsapp_dispatch
        },
        {
          type: "INTERNAL_WEBHOOK",
          target: this.recipients.webhook.endpoint,
          status: "ACKNOWLEDGED_200",
          latency_ms: Math.floor(40 + Math.random() * 50),
          payload: {
            ticker: alert.ticker,
            severity: alert.severity,
            event_type: alert.event_type,
            signal_code: alert.signal_code
          }
        }
      ]
    };

    this.dispatchLogs.unshift(dispatchEntry);
    // Keep max 100 logs
    if (this.dispatchLogs.length > 100) {
      this.dispatchLogs.pop();
    }

    return dispatchEntry;
  }

  getDispatchLogs() {
    return this.dispatchLogs;
  }

  getChannelsInfo() {
    return this.recipients;
  }
}
