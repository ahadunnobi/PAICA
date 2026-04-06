import stripe
from ..config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    @staticmethod
    def create_checkout_session(user_id: int, user_email: str, plan_tier: str):
        """
        Creates a Stripe Checkout Session for a subscription.
        """
        price_id = settings.STRIPE_PRICE_ID_PRO if plan_tier == "pro" else settings.STRIPE_PRICE_ID_ELITE
        
        session = stripe.checkout.Session.create(
            customer_email=user_email,
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}/dashboard/billing?status=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/pricing?status=cancel",
            metadata={
                "user_id": str(user_id),
                "plan_tier": plan_tier
            }
        )
        return session

    @staticmethod
    def create_portal_session(customer_id: str):
        """
        Creates a Stripe Customer Portal session for managing subscriptions.
        """
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{settings.FRONTEND_URL}/dashboard/billing",
        )
        return session

    @staticmethod
    def get_subscription(subscription_id: str):
        return stripe.Subscription.retrieve(subscription_id)

    @staticmethod
    def construct_webhook_event(payload: bytes, sig_header: str):
        return stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
