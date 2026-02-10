import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Lightweight Markdown-to-HTML pipe for content section bodies.
 *
 * Supported syntax:
 *  - **bold**
 *  - `inline code`
 *  - Unordered lists (lines starting with - or •)
 *  - Numbered lists (lines starting with 1. 2. etc.)
 *  - Newlines → <br> (for non-list text)
 *  - Indented tree lines preserved with <pre>-like spacing
 */
@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    // First, replace literal \n sequences (two chars) with actual newlines
    let text = value.replace(/\\n/g, '\n');

    // Escape HTML entities
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // **bold** → <strong>
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // `inline code` → <code>
    text = text.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

    // Process line by line for lists and structure
    const lines = text.split('\n');
    const result: string[] = [];
    let inUl = false;
    let inOl = false;
    let inCodeBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();
      const isTreeLine = /^[\s]+/.test(line) || /[└├│─┌┐┘┤┬┴┼]/.test(line);

      // Unordered list: starts with - or •
      const ulMatch = trimmed.match(/^[-•]\s+(.*)/);
      if (ulMatch) {
        if (inCodeBlock) { result.push('</code></div>'); inCodeBlock = false; }
        if (inOl) { result.push('</ol>'); inOl = false; }
        if (!inUl) { result.push('<ul class="md-list">'); inUl = true; }
        result.push(`<li>${ulMatch[1]}</li>`);
        continue;
      }

      // Ordered list: starts with number.
      const olMatch = trimmed.match(/^\d+[.)]\s+(.*)/);
      if (olMatch) {
        if (inCodeBlock) { result.push('</code></div>'); inCodeBlock = false; }
        if (inUl) { result.push('</ul>'); inUl = false; }
        if (!inOl) { result.push('<ol class="md-list">'); inOl = true; }
        result.push(`<li>${olMatch[1]}</li>`);
        continue;
      }

      // Close any open list
      if (inUl) { result.push('</ul>'); inUl = false; }
      if (inOl) { result.push('</ol>'); inOl = false; }

      // Tree/diagram/indented lines → group into a code block
      if (isTreeLine) {
        if (!inCodeBlock) {
          result.push('<div class="md-codeblock"><code>');
          inCodeBlock = true;
        }
        result.push(line + '\n');
        continue;
      }

      // Close code block if we left tree lines
      if (inCodeBlock) { result.push('</code></div>'); inCodeBlock = false; }

      if (trimmed === '') {
        result.push('<br>');
      } else {
        result.push(trimmed);
      }
    }

    // Close any remaining open tags
    if (inCodeBlock) result.push('</code></div>');
    if (inUl) result.push('</ul>');
    if (inOl) result.push('</ol>');

    // Join: list items and code blocks shouldn't add <br> between them
    let html = '';
    for (let i = 0; i < result.length; i++) {
      const segment = result[i];
      html += segment;
      if (i < result.length - 1) {
        const next = result[i + 1];
        const isStructural = /^<\/?[ou]l|^<li|^<\/?div|^<\/?code/.test(segment)
          || /^<\/?[ou]l|^<li|^<\/?div|^<\/?code/.test(next);
        if (!isStructural && segment !== '<br>' && next !== '<br>'
            && !segment.endsWith('\n')) {
          html += '<br>';
        }
      }
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
