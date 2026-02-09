import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  PLATFORM_ID,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface DotPoint {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-globe',
  standalone: true,
  template: `<canvas #globeCanvas class="w-full h-full"></canvas>`,
})
export class GlobeComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Latitude of the marker location */
  @Input() latitude = 10.39;
  /** Longitude of the marker location */
  @Input() longitude = -75.51;
  /** Color for globe dots (CSS color) */
  @Input() dotColor = 'rgba(255, 255, 255, 0.35)';
  /** Color for the marker dot */
  @Input() markerColor = '#ffffff';
  /** Whether the globe auto-rotates */
  @Input() autoRotate = true;

  private platformId = inject(PLATFORM_ID);
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private dots: DotPoint[] = [];
  private rotation = 0;
  private targetRotation = 0;
  private globeRadius = 0;
  private centerX = 0;
  private centerY = 0;
  private dpr = 1;
  private resizeObserver?: ResizeObserver;
  private isInitialized = false;

  // Marker animation
  private markerPulse = 0;
  private markerGlowIntensity = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.dpr = window.devicePixelRatio || 1;

    this.setupCanvas();
    this.generateDots();
    this.setInitialRotation();
    this.isInitialized = true;
    this.animate();

    this.resizeObserver = new ResizeObserver(() => {
      this.setupCanvas();
      this.generateDots();
    });
    this.resizeObserver.observe(canvas.parentElement || canvas);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized && (changes['latitude'] || changes['longitude'])) {
      this.setInitialRotation();
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.resizeObserver?.disconnect();
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const size = Math.min(parent.clientWidth, parent.clientHeight);
    canvas.width = size * this.dpr;
    canvas.height = size * this.dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    this.globeRadius = (size * 0.38) * this.dpr;
    this.centerX = (canvas.width) / 2;
    this.centerY = (canvas.height) / 2;
  }

  private setInitialRotation(): void {
    // Rotate so that the marker's longitude faces front
    this.targetRotation = (-this.longitude * Math.PI) / 180;
    this.rotation = this.targetRotation;
  }

  private generateDots(): void {
    this.dots = [];
    const numRows = 60;

    for (let lat = -90; lat <= 90; lat += 180 / numRows) {
      const latRad = (lat * Math.PI) / 180;
      const circumference = Math.cos(latRad);
      const numDotsInRow = Math.max(1, Math.floor(circumference * numRows * 2));

      for (let i = 0; i < numDotsInRow; i++) {
        const lng = (i / numDotsInRow) * 360 - 180;
        const lngRad = (lng * Math.PI) / 180;

        this.dots.push({
          x: Math.cos(latRad) * Math.cos(lngRad),
          y: Math.sin(latRad),
          z: Math.cos(latRad) * Math.sin(lngRad),
          lat,
          lng,
        });
      }
    }
  }

  private projectPoint(
    x: number,
    y: number,
    z: number,
    rotY: number
  ): { px: number; py: number; visible: boolean; depth: number } {
    // Apply Y-axis rotation
    const cosR = Math.cos(rotY);
    const sinR = Math.sin(rotY);
    const rx = x * cosR - z * sinR;
    const rz = x * sinR + z * cosR;

    // Apply slight tilt (15 degrees) for visual depth
    const tilt = -0.25;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const ry = y * cosT - rz * sinT;
    const fz = y * sinT + rz * cosT;

    // Only render front-facing dots
    const visible = fz > -0.15;

    return {
      px: this.centerX + rx * this.globeRadius,
      py: this.centerY - ry * this.globeRadius,
      visible,
      depth: fz,
    };
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.autoRotate) {
      this.rotation += 0.002;
    }

    this.markerPulse += 0.04;
    this.markerGlowIntensity = 0.5 + Math.sin(this.markerPulse) * 0.5;

    this.draw();
  };

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort dots by depth for proper rendering
    const projected = this.dots.map((dot) => ({
      ...this.projectPoint(dot.x, dot.y, dot.z, this.rotation),
      dot,
    }));

    projected.sort((a, b) => a.depth - b.depth);

    // Draw dots
    for (const p of projected) {
      if (!p.visible) continue;

      const alpha = 0.1 + (p.depth + 1) * 0.35;
      const size = (0.8 + (p.depth + 1) * 0.6) * this.dpr;

      ctx.beginPath();
      ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
      ctx.fillStyle = this.dotColor.replace(
        /[\d.]+\)$/,
        `${Math.min(alpha, 0.6)})`
      );
      ctx.fill();
    }

    // Draw marker
    this.drawMarker();
  }

  private drawMarker(): void {
    const latRad = (this.latitude * Math.PI) / 180;
    const lngRad = (this.longitude * Math.PI) / 180;

    const mx = Math.cos(latRad) * Math.cos(lngRad);
    const my = Math.sin(latRad);
    const mz = Math.cos(latRad) * Math.sin(lngRad);

    const p = this.projectPoint(mx, my, mz, this.rotation);
    if (!p.visible) return;

    const ctx = this.ctx;
    const baseSize = 3.5 * this.dpr;
    const pulseSize = baseSize + Math.sin(this.markerPulse) * 1.5 * this.dpr;

    // Outer glow ring
    const glowRadius = pulseSize * 3;
    const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, glowRadius);
    glow.addColorStop(0, `rgba(255, 255, 255, ${0.15 * this.markerGlowIntensity})`);
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(p.px, p.py, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Pulse ring
    const ringSize = pulseSize * 2;
    ctx.beginPath();
    ctx.arc(p.px, p.py, ringSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * this.markerGlowIntensity})`;
    ctx.lineWidth = 1 * this.dpr;
    ctx.stroke();

    // Core marker dot
    ctx.beginPath();
    ctx.arc(p.px, p.py, baseSize, 0, Math.PI * 2);
    ctx.fillStyle = this.markerColor;
    ctx.fill();

    // Inner highlight
    ctx.beginPath();
    ctx.arc(p.px, p.py, baseSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
  }
}
