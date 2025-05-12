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
  eventsList = signal<any[]>([]);

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
    eventDrop: (info) => this.onEventDrop(info),
    events: this.eventsList(),
  };

  constructor() {
    this.loadCalendarEvents();
  }

  onDateClick(arg: any) {
    this.selectedDate.set(arg.dateStr);
    this.showModal.set(true);
  }

  async addRoutineToCalendar(routine: Routine) {
    const fecha = this.selectedDate();
    if (!fecha) return;

    try {
      // Evitar duplicados si ya está esa rutina ese día
      const yaExiste = this.eventsList().some(ev => ev.title === routine.name && ev.start === fecha);
      if (yaExiste) {
        alert('Esa rutina ya está añadida para este día');
        return;
      }

      const added = await this._calendarEventService.add({
        title: routine.name,
        date: fecha,
        completed: false,
      });

      this.eventsList.update(events => [
        ...events,
        {
          id: added.id,
          title: routine.name,
          start: fecha,
          allDay: true,
        }
      ]);

      this.calendarOptions.events = [...this.eventsList()];
      this.showModal.set(false);
      this.selectedDate.set('');
    } catch (error) {
      console.error('Error añadiendo evento:', error);
    }
  }

  async quitarRutina(routineTitle: string) {
    try {
      const userId = this._calendarEventService.getUserId();
      const fecha = this.selectedDate();
      await this._calendarEventService.deleteRoutineFromDate(routineTitle, fecha, userId);

      this.eventsList.update(events =>
        events.filter(ev => !(ev.title === routineTitle && ev.start === fecha))
      );

      this.calendarOptions.events = [...this.eventsList()];
    } catch (error) {
      console.error('Error al eliminar rutina del calendario:', error);
    }
  }

  async onEventDrop(info: any) {
    const event = info.event;
    const newDate = event.startStr;

    try {
      await this._calendarEventService.updateDate(event.id, newDate);
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      info.revert();
    }
  }

  async loadCalendarEvents() {
    try {
      const allEvents = await this._calendarEventService.getEvents();
      const userId = this._calendarEventService.getUserId();

      const userEvents = allEvents.filter(event => event.userId === userId);

      this.eventsList.set(
        userEvents.map(event => ({
          id: event.id,
          title: event.title,
          start: event.date,
          allDay: true,
        }))
      );

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
