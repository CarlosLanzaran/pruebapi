import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [TaskService],
})
export default class TaskFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);

  idTask = input.required<string>();

  form = this._formBuilder.group({
    name: this._formBuilder.control('', Validators.required),
    description: this._formBuilder.control('', Validators.required),
  });

  constructor() {
    effect(() => {
      const id = this.idTask();
      if (id) {
        this.getTask(id);
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { name, description } = this.form.value;
      const task: TaskCreate = {
        name: name || '',
        description: description || '',
      };

      const id = this.idTask();

      if (id) {
        await this._taskService.update(task, id);
      } else {
        await this._taskService.create(task);
      }

      toast.success(`Ejercicio ${id ? 'actualizado' : 'creado'} correctamente.`);
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrió un problema.');
    } finally {
      this.loading.set(false);
    }
  }
  async delete() {
    const id = this.idTask();
    if (!id) return;
  
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este ejercicio?');
    if (!confirmDelete) return;
  
    try {
      this.loading.set(true);
      await this._taskService.delete(id);
      toast.success('Ejercicio eliminado correctamente.');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrió un problema al eliminar.');
    } finally {
      this.loading.set(false);
    }
  }
  
  async getTask(id: string) {
    const taskSnapshot = await this._taskService.getTask(id);

    if (!taskSnapshot.exists()) return;

    const task = taskSnapshot.data() as Task;

    this.form.patchValue(task);
  }
}
