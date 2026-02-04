import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '../../core/services/supabase.service';
import { Event } from '../../core/models';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Eventos</h1>
          <p class="text-gray-400 mt-1">Gestiona los eventos a los que has asistido</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="toggleShowArchived()"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
            {{ showArchived() ? 'Ocultar archivados' : 'Ver archivados' }}
          </button>
          <a
            routerLink="new"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Evento
          </a>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="bg-gray-800 rounded-xl p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-white">No hay eventos</h3>
          <p class="mt-2 text-gray-400">Comienza agregando un evento</p>
          <a routerLink="new" class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Crear evento
          </a>
        </div>
      } @else {
        <div cdkDropList (cdkDropListDropped)="drop($event)" class="space-y-2">
          @for (item of filteredItems(); track item.id) {
            <div
              cdkDrag
              [cdkDragDisabled]="showArchived()"
              class="bg-gray-800 rounded-lg p-4 flex items-center gap-4 group hover:bg-gray-750 transition-colors"
              [class.opacity-60]="item.is_archived"
            >
              @if (!showArchived()) {
                <div cdkDragHandle class="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                  </svg>
                </div>
              }

              @if (item.is_pinned) {
                <div class="text-yellow-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              }

              <div class="flex-1 min-w-0">
                <h3 class="text-white font-medium truncate">{{ item.name }}</h3>
                @if (item.description) {
                  <p class="text-gray-400 text-sm truncate mt-1">{{ item.description }}</p>
                }
                @if (item.assisted_at) {
                  <p class="text-gray-500 text-xs mt-1">{{ item.assisted_at | date:'mediumDate' }}</p>
                }
              </div>

              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="togglePin(item)" class="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5" [attr.fill]="item.is_pinned ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
                <a [routerLink]="[item.id]" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </a>
                <button (click)="toggleArchive(item)" class="p-2 text-gray-400 hover:text-orange-500 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (item.is_archived) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    }
                  </svg>
                </button>
                <button (click)="confirmDelete(item)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <app-confirm-dialog
        #confirmDialog
        title="Eliminar evento"
        message="¿Estás seguro de que deseas eliminar este evento?"
        confirmText="Eliminar"
        (confirmed)="deleteItem()"
      />
    </div>
  `,
})
export class EventsComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  loading = signal(true);
  showArchived = signal(false);
  items = signal<Event[]>([]);
  itemToDelete: Event | null = null;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAll<Event>('event', 'position', true);
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      this.loading.set(false);
    }
  }

  filteredItems(): Event[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<Event[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try {
      await this.supabase.updatePositions('event', updates);
      await this.loadItems();
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  }

  async togglePin(item: Event): Promise<void> {
    try {
      await this.supabase.togglePin('event', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Event): Promise<void> {
    try {
      if (item.is_archived) {
        await this.supabase.unarchive('event', item.id);
      } else {
        await this.supabase.archive('event', item.id);
      }
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Event): void {
    this.itemToDelete = item;
    this.confirmDialog.open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.supabase.delete('event', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
