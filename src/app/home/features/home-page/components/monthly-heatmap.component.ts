import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 p-6 rounded-xl shadow-xl mt-10 text-white">
      <h2 class="text-2xl font-semibold mb-4">🔥 Días activos este mes</h2>
      <div class="grid grid-cols-7 gap-2 text-center text-sm">
        <div *ngFor="let day of daysInMonth" class="w-8 h-8 rounded flex items-center justify-center"
             [ngClass]="{
               'bg-green-400 text-black font-bold': activeDays.includes(day),
               'bg-gray-600 text-gray-300': !activeDays.includes(day)
             }">
          {{ day }}
        </div>
      </div>
    </div>
  `,
})
export class MonthlyHeatmapComponent {
  @Input() activeDates: string[] = [];

  get daysInMonth(): number[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  get activeDays(): number[] {
    return this.activeDates.map(dateStr => new Date(dateStr).getDate());
  }
}
