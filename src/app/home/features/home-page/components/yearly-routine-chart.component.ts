import { Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-yearly-routine-chart',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class="bg-gray-800 p-6 rounded-xl shadow-xl mt-10">
      <h2 class="text-2xl font-semibold mb-4 text-white">📈 Rutinas completadas por mes</h2>
      <canvas baseChart
        [type]="lineChartType"
        [data]="lineChartData"
        [options]="lineChartOptions">
      </canvas>
    </div>
  `,
})
export class YearlyRoutineChartComponent {
  @Input() data: number[] = [];

  lineChartType: ChartType = 'line';

  lineChartOptions: ChartOptions = {
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

  get lineChartData(): ChartData<'line'> {
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          data: this.data,
          label: 'Rutinas completadas',
          fill: false,
          borderColor: '#4ade80',
          tension: 0.3
        },
      ],
    };
  }
}
