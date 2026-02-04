import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

/**
 * Auth guard to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  // Wait for initial auth check to complete
  while (supabase.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const session = supabase.session();

  if (!session) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

/**
 * Guard to redirect authenticated users away from login page
 */
export const noAuthGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  // Wait for initial auth check to complete
  while (supabase.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const session = supabase.session();

  if (session) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
