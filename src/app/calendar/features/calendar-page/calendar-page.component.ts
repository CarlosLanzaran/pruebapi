import { Component, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RoutineService, Routine } from '../../data-access/routine.service';
import { CalendarEventService } from '../../calendar-event.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [FullCalendarModule, NgIf, NgFor],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss',
  providers: [RoutineService, CalendarEventService],
})
export class CalendarPageComponent {
  private _routineService = inject(RoutineService);
  private _calendarEventService = inject(CalendarEventService);

  routines = this._routineService.getRoutines;
  selectedDate = signal<string>('');
  showModal = signal(false);

  eventsList = signal<any[]>([]);  // 👈 Aquí llevamos todos los eventos cargados

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    selectable: true,
    editable: true,
    weekends: true,
    dateClick: (arg) => this.onDateClick(arg),
    events: this.eventsList(), // 👈 Aquí ponemos nuestro array controlado
  };

  constructor() {
    this.loadCalendarEvents();
  }

  onDateClick(arg: any) {
    this.selectedDate.set(arg.dateStr);
    this.showModal.set(true);
  }

  async addRoutineToCalendar(routine: Routine) {
    if (!this.selectedDate()) return;

    try {
      await this._calendarEventService.add({
        title: routine.name,
        date: this.selectedDate(),
        completed: false,
      });

      // 👇 Añadimos también en nuestro array local
      this.eventsList.update(events => [
        ...events,
        {
          title: routine.name,
          start: this.selectedDate(),
          allDay: true,
        }
      ]);

      // 👇 Actualizamos los eventos del calendario
      this.calendarOptions.events = this.eventsList();
    } catch (error) {
      console.error('Error añadiendo evento:', error);
    }

    this.showModal.set(false);
    this.selectedDate.set('');
  }

  async loadCalendarEvents() {
    try {
      const allEvents = await this._calendarEventService.getEvents();
      const userId = this._calendarEventService.getCurrentUserId();

      const userEvents = allEvents.filter(event => event.userId === userId);

      // 👇 Rellenamos nuestro array
      this.eventsList.set(
        userEvents.map(event => ({
          title: event.title,
          start: event.date,
          allDay: true,
        }))
      );

      // 👇 Y actualizamos lo que ve el calendario
      this.calendarOptions.events = this.eventsList();
    } catch (error) {
      console.error('Error cargando eventos:', error);
    }
  }

  cancelSelection() {
    this.showModal.set(false);
    this.selectedDate.set('');
  }
}
