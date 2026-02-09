import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  input,
  viewChild,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { isLand } from './world-map-data';

interface Dot3D {
  x: number;
  y: number;
  z: number;
}

@Component({
  selector: 'app-globe',
  standalone: true,
  template: `<canvas #globeCanvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class GlobeComponent implements AfterViewInit, OnDestroy {
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('globeCanvas');

  latitude = input(0);
  longitude = input(0);
  markerColor = input('#22c55e');
  autoRotate = input(true);

  private platformId = inject(PLATFORM_ID);
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private landDots: Dot3D[] = [];
  private gridDots: Dot3D[] = [];
  private rotation = 0;
  private globeRadius = 0;
  private centerX = 0;
  private centerY = 0;
  private dpr = 1;
  private resizeObserver?: ResizeObserver;
  private isInitialized = false;
  private markerPulse = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.dpr = window.devicePixelRatio || 1;

    this.setupCanvas();
    this.generateDots();
    this.setInitialRotation();
    this.isInitialized = true;
    this.animate();

    this.resizeObserver = new ResizeObserver(() => this.setupCanvas());
    this.resizeObserver.observe(canvas.parentElement || canvas);
  }

  private latLngEffect = effect(() => {
    // Track the signals
    this.latitude();
    this.longitude();
    if (this.isInitialized) {
      this.setInitialRotation();
    }
  });

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.resizeObserver?.disconnect();
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    const { width: w, height: h } = canvas.getBoundingClientRect();
    if (w === 0 || h === 0) return;

    canvas.width = w * this.dpr;
    canvas.height = h * this.dpr;

    const minDim = Math.min(w, h);
    this.globeRadius = minDim * 0.44 * this.dpr;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
  }

  /**
   * Correct rotation to place the marker's longitude at front-center.
   * Formula: R = π/2 − longitude(rad) places the point at (cos θ, 0, sin θ)
   * exactly at rx = 0, rz = 1 (front center).
   */
  private setInitialRotation(): void {
    const lngRad = (this.longitude() * Math.PI) / 180;
    this.rotation = Math.PI / 2 - lngRad;
  }

  private generateDots(): void {
    this.gridDots = [];
    this.landDots = [];

    // 1) Sparse grid dots — give the sphere its shape (ocean wireframe)
    const gridStep = 8;
    for (let lat = -80; lat <= 80; lat += gridStep) {
      const latRad = (lat * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      const lngStep = gridStep / Math.max(cosLat, 0.3);
      for (let lng = -180; lng < 180; lng += lngStep) {
        if (isLand(lat, lng)) continue; // skip; land gets its own brighter dots
        const lngRad = (lng * Math.PI) / 180;
        this.gridDots.push({
          x: cosLat * Math.cos(lngRad),
          y: Math.sin(latRad),
          z: cosLat * Math.sin(lngRad),
        });
      }
    }

    // 2) Dense land dots — continent shapes
    const landStep = 2;
    for (let lat = -85; lat <= 85; lat += landStep) {
      const latRad = (lat * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      const lngStep = landStep / Math.max(cosLat, 0.25);
      for (let lng = -180; lng < 180; lng += lngStep) {
        if (!isLand(lat, lng)) continue;
        const lngRad = (lng * Math.PI) / 180;
        this.landDots.push({
          x: cosLat * Math.cos(lngRad),
          y: Math.sin(latRad),
          z: cosLat * Math.sin(lngRad),
        });
      }
    }
  }

  private project(
    x: number,
    y: number,
    z: number,
    rotY: number,
  ): { px: number; py: number; visible: boolean; depth: number } {
    const cosR = Math.cos(rotY);
    const sinR = Math.sin(rotY);
    const rx = x * cosR - z * sinR;
    const rz = x * sinR + z * cosR;

    // Slight tilt for perspective
    const tilt = -0.25;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const ry = y * cosT - rz * sinT;
    const fz = y * sinT + rz * cosT;

    return {
      px: this.centerX - rx * this.globeRadius,
      py: this.centerY - ry * this.globeRadius,
      visible: fz > -0.05,
      depth: fz,
    };
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    if (this.autoRotate()) this.rotation += 0.001;
    this.markerPulse += 0.03;
    this.draw();
  };

  private draw(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = this.centerX;
    const cy = this.centerY;
    const r = this.globeRadius;
    const s = this.dpr;

    // ── Subtle atmosphere ────────────────────────────────────────
    const atmo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.12);
    atmo.addColorStop(0, 'rgba(100, 200, 255, 0.02)');
    atmo.addColorStop(1, 'transparent');
    ctx.fillStyle = atmo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // ── Globe outline ────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1 * s;
    ctx.stroke();

    // ── Ocean grid dots (very faint, define sphere shape) ────────
    for (const d of this.gridDots) {
      const p = this.project(d.x, d.y, d.z, this.rotation);
      if (!p.visible) continue;
      const dn = (p.depth + 1) / 2;
      ctx.beginPath();
      ctx.arc(p.px, p.py, 0.4 * s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + dn * 0.05})`;
      ctx.fill();
    }

    // ── Land dots (brighter, denser — form continent shapes) ────
    for (const d of this.landDots) {
      const p = this.project(d.x, d.y, d.z, this.rotation);
      if (!p.visible) continue;
      const dn = (p.depth + 1) / 2;
      const alpha = 0.12 + dn * 0.5;
      const size = (0.5 + dn * 0.9) * s;
      ctx.beginPath();
      ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // ── Marker ───────────────────────────────────────────────────
    this.drawMarker();
  }

  private drawMarker(): void {
    const latRad = (this.latitude() * Math.PI) / 180;
    const lngRad = (this.longitude() * Math.PI) / 180;
    const cosLat = Math.cos(latRad);

    const p = this.project(
      cosLat * Math.cos(lngRad),
      Math.sin(latRad),
      cosLat * Math.sin(lngRad),
      this.rotation,
    );
    if (!p.visible) return;

    const ctx = this.ctx;
    const s = this.dpr;
    const pulse = Math.sin(this.markerPulse);
    const pn = 0.5 + pulse * 0.5;

    // Glow
    const gr = (16 + pulse * 5) * s;
    const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, gr);
    grad.addColorStop(0, `rgba(34, 197, 94, ${0.3 * pn})`);
    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.beginPath();
    ctx.arc(p.px, p.py, gr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Pulse ring
    const rr = (8 + pulse * 3) * s;
    ctx.beginPath();
    ctx.arc(p.px, p.py, rr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(34, 197, 94, ${0.35 * pn})`;
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // Core dot
    const cr = 3.5 * s;
    ctx.beginPath();
    ctx.arc(p.px, p.py, cr, 0, Math.PI * 2);
    ctx.fillStyle = this.markerColor();
    ctx.shadowColor = this.markerColor();
    ctx.shadowBlur = 12 * s;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner highlight
    ctx.beginPath();
    ctx.arc(p.px, p.py, cr * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
  }
}
