import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

/**
 * Guard to redirect authenticated users away from login page
 */
export const noAuthGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  // Skip auth check on server - client will handle it
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

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
