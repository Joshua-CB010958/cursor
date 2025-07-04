import Stripe from 'stripe';
import { logger } from '../utils/logger';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      logger.warn('Stripe secret key not found. Stripe service will be disabled.');
      this.stripe = {} as Stripe;
    } else {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  // Get payment details
  async getPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      logger.error('Failed to retrieve payment:', error);
      return null;
    }
  }

  // Get customer details
  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      return await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
    } catch (error) {
      logger.error('Failed to retrieve customer:', error);
      return null;
    }
  }

  // Create a test payment (for development)
  async createTestPayment(amount: number, currency: string = 'usd'): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        confirm: true,
        payment_method: 'pm_card_visa',
      });
    } catch (error) {
      logger.error('Failed to create test payment:', error);
      throw error;
    }
  }
} 