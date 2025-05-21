import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarEventService } from '../../../calendar/calendar-event.service';
import { MonthlyRoutineChartComponent } from './components/monthly-routine-chart.component';
import { YearlyRoutineChartComponent } from './components/yearly-routine-chart.component';
import { RoutinePieChartComponent } from './components/routine-pie-chart.component';
import { MonthlyHeatmapComponent } from './components/monthly-heatmap.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MonthlyRoutineChartComponent, YearlyRoutineChartComponent, RoutinePieChartComponent, MonthlyHeatmapComponent],
  providers: [DatePipe],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  private _eventService = inject(CalendarEventService);
  totalCompletedThisMonth = signal<number>(0);
completedPerMonth = signal<number[]>([]);

  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  currentYear = new Date().getFullYear();
  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(this.currentYear);

  completedThisMonth = signal<any[]>([]);
  completedThisYear = signal<any[]>([]);
activeDatesThisMonth = signal<string[]>([]);

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

    const rutinaContada = monthData.reduce((acc, curr) => {
      acc[curr.title] = (acc[curr.title] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const resumenRutinas = Object.entries(rutinaContada).map(([title, count]) => ({ title, count }));

    this.completedThisMonth.set(resumenRutinas);
    this.completedThisYear.set(yearData);

    const total = resumenRutinas.reduce((sum, r) => sum + r.count, 0);
    await this.loadYearlyChartData();
    this.totalCompletedThisMonth.set(total);
    this.activeDatesThisMonth.set(monthData.map(r => r.date)); // Asegúrate de que r.date sea string o Date válido

  }

  async loadYearlyChartData() {
  const year = this.selectedYear();
  const monthlyCounts: number[] = [];

  for (let month = 0; month < 12; month++) {
    const routines = await this._eventService.getCompletedRoutinesByMonth(year, month);
    monthlyCounts.push(routines.length);
  }

  this.completedPerMonth.set(monthlyCounts);
}

getTop3RoutinesThisYear(): { title: string; count: number }[] {
  const grouped: Record<string, number> = this.completedThisYear().reduce((acc, curr) => {
    acc[curr.title] = (acc[curr.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([title, count]) => ({ title, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}


}
