import { Component, inject } from '@angular/core';
import { TaskService } from '../../data-access/task.service';
import { RoutineService } from '../../../routine/data-access/routine.service';
import { TableComponent } from '../../ui/table/table.component';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TableComponent, RouterLink, NgIf, NgFor],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [TaskService, RoutineService],
})
export default class TaskListComponent {
  tasksService = inject(TaskService);
  routineService = inject(RoutineService);
}
