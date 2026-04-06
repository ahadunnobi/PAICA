from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from ..db.database import get_db
from ..db.models import User, Subscription, UsageStats, SubscriptionStatus, PlanTier, Order
from ..services.stripe_service import StripeService
from ..config import settings
import stripe
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/create-checkout-session")
async def create_checkout_session(plan: str, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        session = StripeService.create_checkout_session(user.id, user.email, plan)
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/customer-portal")
async def customer_portal(user_id: int, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not sub or not sub.stripe_customer_id:
        raise HTTPException(status_code=404, detail="No billing info found")
    
    try:
        session = StripeService.create_portal_session(sub.stripe_customer_id)
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    if not stripe_signature:
        raise HTTPException(status_code=400, detail="Missing stripe-signature")
    
    payload = await request.body()
    try:
        event = StripeService.construct_webhook_event(payload, stripe_signature)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    db = next(get_db())
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session, db)
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        handle_subscription_updated(subscription, db)
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_deleted(subscription, db)

    return {"status": "success"}

def handle_checkout_completed(session, db: Session):
    user_id = int(session['metadata']['user_id'])
    plan_tier = session['metadata']['plan_tier']
    customer_id = session['customer']
    subscription_id = session['subscription']
    
    # Update or create subscription
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    if not sub:
        sub = Subscription(user_id=user_id)
        db.add(sub)
    
    sub.stripe_customer_id = customer_id
    sub.stripe_subscription_id = subscription_id
    sub.plan_tier = plan_tier
    sub.status = SubscriptionStatus.active
    
    # Initialize usage for current month
    today = datetime.now()
    month_year = today.strftime("%Y-%m")
    usage = db.query(UsageStats).filter(UsageStats.user_id == user_id, UsageStats.month_year == month_year).first()
    if not usage:
        usage = UsageStats(user_id=user_id, month_year=month_year)
        db.add(usage)
    
    db.commit()

def handle_subscription_updated(subscription, db: Session):
    sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == subscription['id']).first()
    if sub:
        sub.status = subscription['status']
        sub.current_period_end = datetime.fromtimestamp(subscription['current_period_end'])
        db.commit()

def handle_subscription_deleted(subscription, db: Session):
    sub = db.query(Subscription).filter(Subscription.stripe_subscription_id == subscription['id']).first()
    if sub:
        sub.status = SubscriptionStatus.canceled
        sub.plan_tier = PlanTier.free
        db.commit()
