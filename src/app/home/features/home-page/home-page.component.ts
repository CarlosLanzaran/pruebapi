import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarEventService } from '../../../calendar/calendar-event.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private _eventService = inject(CalendarEventService);

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  currentYear = new Date().getFullYear();
  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(this.currentYear);

  completedThisMonth = signal<any[]>([]);
  completedThisYear = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  onChangeMonth(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedMonth.set(+value);
    this.loadData();
  }

  onChangeYear(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYear.set(+value);
    this.loadData();
  }

  async loadData() {
    const month = this.selectedMonth();
    const year = this.selectedYear();

    const [monthData, yearData] = await Promise.all([
      this._eventService.getCompletedRoutinesByMonth(year, month),
      this._eventService.getCompletedRoutinesByYear(year),
    ]);

    this.completedThisMonth.set(monthData);
    this.completedThisYear.set(yearData);
  }
}
