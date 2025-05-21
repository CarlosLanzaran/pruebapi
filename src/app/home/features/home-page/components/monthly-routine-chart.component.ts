// src/app/home/features/home-page/components/monthly-routine-chart.component.ts
import { Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-monthly-routine-chart',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class="bg-gray-800 p-6 rounded-xl shadow-xl mt-10">
      <h2 class="text-2xl font-semibold mb-4 text-white">📊 Frecuencia de rutinas este mes</h2>
      <canvas baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [type]="barChartType">
      </canvas>
    </div>
  `,
})
export class MonthlyRoutineChartComponent {
  @Input() data: { title: string; count: number }[] = [];

  barChartType: ChartType = 'bar';

  get barChartData(): ChartData<'bar'> {
    return {
      labels: this.data.map(d => d.title),
      datasets: [
        {
          data: this.data.map(d => d.count),
          label: 'Veces completada',
          backgroundColor: '#4ade80',
        },
      ],
    };
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#444' },
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#444' },
      },
    },
  };
}
