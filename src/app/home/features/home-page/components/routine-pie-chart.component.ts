import { Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-routine-pie-chart',
  standalone: true,
  imports: [NgChartsModule],
  template: `
    <div class="bg-gray-800 p-6 rounded-xl shadow-xl mt-10">
      <h2 class="text-2xl font-semibold mb-4 text-white">🍩 Reparto de tipos de rutina</h2>
      <canvas baseChart
        [type]="pieChartType"
        [data]="pieChartData"
        [options]="pieChartOptions">
      </canvas>
    </div>
  `,
})
export class RoutinePieChartComponent {
  @Input() data: { title: string; count: number }[] = [];

  pieChartType: ChartType = 'doughnut';

  get pieChartData(): ChartData<'doughnut'> {
    return {
      labels: this.data.map(d => d.title),
      datasets: [
        {
          data: this.data.map(d => d.count),
          backgroundColor: ['#60a5fa', '#34d399', '#f472b6', '#facc15', '#fb923c', '#a78bfa'],
        },
      ],
    };
  }

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
  };
}
