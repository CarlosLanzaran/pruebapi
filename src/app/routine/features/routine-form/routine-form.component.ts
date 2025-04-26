import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../task/data-access/task.service';
import { RoutineCreate, RoutineService } from '../../data-access/routine.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
  providers: [RoutineService, TaskService],
})
export class RoutineFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _routineService = inject(RoutineService);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);
  selectedExercises = signal<string[]>([]);
  exercises = this._taskService.getTasks;

  idRoutine = input.required<string>(); // Saber si es edición o nueva rutina

  form = this._formBuilder.group({
    name: this._formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.idRoutine();
      if (id) {
        this.getRoutine(id);
      }
    });
  }

  async getRoutine(id: string) {
    const routineSnapshot = await this._routineService.getRoutine(id);
    if (!routineSnapshot.exists()) return;

    const routine = routineSnapshot.data();
    this.form.patchValue({ name: routine?.['name'] || '' });
    this.selectedExercises.set(routine?.['exerciseIds'] || []);
  }

  toggleExercise(id: string) {
    const current = this.selectedExercises();
    if (current.includes(id)) {
      this.selectedExercises.set(current.filter((x) => x !== id));
    } else {
      this.selectedExercises.set([...current, id]);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedExercises().includes(id);
  }

  async submit() {
    if (this.form.invalid || this.selectedExercises().length === 0) return;
  
    try {
      this.loading.set(true);
  
      const routine: RoutineCreate = {
        name: this.form.get('name')?.value || '',
        exerciseIds: this.selectedExercises(),
      };
  
      const id = this.idRoutine();
  
      if (id) {
        await this._routineService.update(routine, id);
        toast.success('Rutina actualizada correctamente.');
      } else {
        await this._routineService.create(routine);
        toast.success('Rutina creada correctamente.');
      }
  
      this._router.navigateByUrl('/tasks'); // <<< CAMBIADO A /tasks
    } catch (error) {
      toast.error('Ocurrió un problema.');
    } finally {
      this.loading.set(false);
    }
  }
  async delete() {
    const id = this.idRoutine();
    if (!id) return;
  
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta rutina?');
    if (!confirmDelete) return;
  
    try {
      this.loading.set(true);
      await this._routineService.delete(id);
      toast.success('Rutina eliminada correctamente.');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrió un problema al eliminar.');
    } finally {
      this.loading.set(false);
    }
  }
  
}
