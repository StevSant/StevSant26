import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard to redirect authenticated users away from login page
 */
export const noAuthGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  // Skip auth check on server - client will handle it
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for initial auth check to complete
  while (authService.loading()) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const session = authService.session();

  if (session) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
