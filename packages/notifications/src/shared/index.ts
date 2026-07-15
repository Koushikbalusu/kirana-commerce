export interface NotificationSnapshot {
  readonly recipient: string;
  readonly channel: string;
  readonly subject: string;
  readonly body: string;
  readonly templateVersionId: string;
  readonly metadata: any;
}

export interface NotificationRecipient {
  readonly userId: string;
  readonly contactPoint: string;
}

export interface NotificationChannel {
  readonly name: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
}

export interface NotificationPriority {
  readonly level: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
}

export interface QuietHours {
  readonly start: string;
  readonly end: string;
  readonly timezone: string;
  readonly bypassCritical: boolean;
}

export interface RenderedTemplate {
  readonly subject: string;
  readonly body: string;
}

export interface DeliveryResult {
  readonly success: boolean;
  readonly providerReference?: string;
  readonly error?: any;
}

export interface DeliveryRoute {
  readonly primaryChannel: string;
  readonly fallbackChannels: string[];
}

export interface NotificationProviderAdapter {
  send(payload: any): Promise<DeliveryResult>;
  validate(payload: any): boolean;
  healthCheck(): Promise<boolean>;
  cancel(providerReferenceId: string): Promise<boolean>;
}

export class EmailAdapter implements NotificationProviderAdapter {
  async send(p: any) {
    return { success: true };
  }
  validate(p: any) {
    return true;
  }
  async healthCheck() {
    return true;
  }
  async cancel(r: string) {
    return true;
  }
}

export class SmsAdapter implements NotificationProviderAdapter {
  async send(p: any) {
    return { success: true };
  }
  validate(p: any) {
    return true;
  }
  async healthCheck() {
    return true;
  }
  async cancel(r: string) {
    return true;
  }
}

export class PushAdapter implements NotificationProviderAdapter {
  async send(p: any) {
    return { success: true };
  }
  validate(p: any) {
    return true;
  }
  async healthCheck() {
    return true;
  }
  async cancel(r: string) {
    return true;
  }
}

export class WhatsAppAdapter implements NotificationProviderAdapter {
  async send(p: any) {
    return { success: true };
  }
  validate(p: any) {
    return true;
  }
  async healthCheck() {
    return true;
  }
  async cancel(r: string) {
    return true;
  }
}

// Events
export interface ShippingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}
export type NotificationQueued = ShippingEvent;
export type NotificationScheduled = ShippingEvent;
export type NotificationSent = ShippingEvent;
export type NotificationDelivered = ShippingEvent;
export type NotificationOpened = ShippingEvent;
export type NotificationClicked = ShippingEvent;
export type NotificationFailed = ShippingEvent;
export type NotificationRetried = ShippingEvent;
export type NotificationCanceled = ShippingEvent;
export type TemplateRendered = ShippingEvent;
export type PreferenceUpdated = ShippingEvent;
export type ProviderUnavailable = ShippingEvent;
