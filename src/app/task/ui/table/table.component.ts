import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterLink], // 👈 Aquí añadimos RouterLink
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() data: any[] = [];
}
