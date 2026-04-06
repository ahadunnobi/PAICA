from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..db.models import User, Subscription, UsageStats, PlanTier, SubscriptionStatus
from datetime import datetime

class BillingService:
    TIER_LIMITS = {
        PlanTier.free: 20,
        PlanTier.pro: 1000,
        PlanTier.elite: 1000000, # Large enough to be "unlimited"
    }

    @staticmethod
    async def get_user_usage(db: AsyncSession, user_id: int):
        today = datetime.now()
        month_year = today.strftime("%Y-%m")
        
        result = await db.execute(
            select(UsageStats).where(
                UsageStats.user_id == user_id, 
                UsageStats.month_year == month_year
            )
        )
        usage = result.scalar_one_or_none()
        
        if not usage:
            usage = UsageStats(user_id=user_id, month_year=month_year)
            db.add(usage)
            await db.commit()
            await db.refresh(usage)
            
        return usage

    @staticmethod
    async def can_generate_reply(db: AsyncSession, user_id: int):
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        sub = result.scalar_one_or_none()
        
        tier = sub.plan_tier if sub else PlanTier.free
        status = sub.status if sub else SubscriptionStatus.active # Default active for free users
        
        if status not in [SubscriptionStatus.active, SubscriptionStatus.trialing]:
            return False, "Your subscription is not active."

        usage = await BillingService.get_user_usage(db, user_id)
        limit = BillingService.TIER_LIMITS.get(tier, 20)
        
        # Check if they have enough regular or extra credits
        total_available = limit + (usage.extra_credits or 0)
        if usage.ai_replies_count >= total_available:
            return False, f"Monthly limit reached ({usage.ai_replies_count}/{total_available}). Please upgrade or buy more credits."
            
        return True, ""

    @staticmethod
    async def increment_usage(db: AsyncSession, user_id: int):
        usage = await BillingService.get_user_usage(db, user_id)
        usage.ai_replies_count += 1
        await db.commit()
