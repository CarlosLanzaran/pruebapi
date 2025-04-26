import { Component, inject } from '@angular/core';
import { RoutineService } from '../../data-access/routine.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './routine-list.component.html',
  styleUrl: './routine-list.component.scss',
  providers: [RoutineService],
})
export class RoutineListComponent {
  routineService = inject(RoutineService);
}
