import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Referrer redirect component.
 *
 * Handles URLs like /from/linkedin, /from/cv, /from/github etc.
 * Stores the referrer source in a cookie + sessionStorage and immediately
 * redirects to the portfolio root (/). This is more reliable than query
 * parameters (?ref=) because platforms like LinkedIn strip query strings
 * but cannot strip URL path segments.
 *
 * Usage: share https://stevsant.vercel.app/from/linkedin
 */
@Component({
  selector: 'app-referrer-redirect',
  standalone: true,
  template: '',
})
export class ReferrerRedirectComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    const source = this.route.snapshot.paramMap.get('source');

    if (source && isPlatformBrowser(this.platformId)) {
      // Map short aliases to full referrer source strings
      const sourceMap: Record<string, string> = {
        linkedin: 'linkedin.com',
        github: 'github.com',
        indeed: 'indeed.com',
        glassdoor: 'glassdoor.com',
        twitter: 'x.com',
        x: 'x.com',
        instagram: 'instagram.com',
        facebook: 'facebook.com',
        cv: 'cv',
        resume: 'resume',
        curriculum: 'curriculum',
        // Redirect/tracker domain aliases
        'lnkd.in': 'linkedin.com',
        'l.linkedin.com': 'linkedin.com',
        't.co': 'x.com',
        'l.facebook.com': 'facebook.com',
        'l.instagram.com': 'instagram.com',
      };

      const resolvedSource = sourceMap[source.toLowerCase()] || source;

      try {
        // Store in cookie (survives the redirect, read by analytics service)
        document.cookie = `analytics_ref=${encodeURIComponent(resolvedSource)};path=/;max-age=300;SameSite=Lax`;
        // Store in sessionStorage as backup
        sessionStorage.setItem('analytics_ref', resolvedSource);
      } catch {
        // Ignore storage errors
      }
    }

    // Redirect to portfolio home
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
