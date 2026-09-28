import { clerkMiddleware } from "@clerk/astro/server";

export const onRequest = (context, next) => {
  const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = import.meta.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY;
  
  if (!publishableKey && !secretKey) {
    return next();
  }
  
  return clerkMiddleware()(context, next);
};