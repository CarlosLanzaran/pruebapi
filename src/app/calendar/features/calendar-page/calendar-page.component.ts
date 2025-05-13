import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RoutineService, Routine } from '../../data-access/routine.service';
import { CalendarEventService } from '../../calendar-event.service';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [FullCalendarModule, NgIf, NgFor, NgClass],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss',
  providers: [RoutineService, CalendarEventService],
})
export class CalendarPageComponent {
  private _routineService = inject(RoutineService);
  private _calendarEventService = inject(CalendarEventService);

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  routines = this._routineService.getRoutines;
  selectedDate = signal<string>('');
  showModal = signal(false);
  eventsList = signal<any[]>([]);
  selectedEvent = signal<any | null>(null);

  filteredEvents = computed(() => {
    const fecha = this.selectedDate();
    return this.eventsList().filter(e => e.start === fecha);
  });

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
    eventClick: (arg) => this.onEventClick(arg),
    eventDidMount: (info) => {
      if (info.event.extendedProps['completed']) {
        info.el.style.backgroundColor = '#9AE6B4';
        info.el.style.textDecoration = 'line-through';
      }
    },
    events: this.eventsList(),
  };

  constructor() {
    this.loadCalendarEvents();
  }

  onDateClick(arg: any) {
    this.selectedDate.set(arg.dateStr);
    this.showModal.set(true);
  }

  onEventClick(arg: any) {
    this.selectedEvent.set(arg.event);
  }

  async addRoutineToCalendar(routine: Routine) {
    const fecha = this.selectedDate();
    if (!fecha) return;

    try {
      const yaExiste = this.eventsList().some(ev => ev.title === routine.name && ev.start === fecha);
      if (yaExiste) {
        alert('Esa rutina ya está añadida para este día');
        return;
      }

      const added = await this._calendarEventService.add({
        title: routine.name,
        date: fecha,
        completed: false,
        userId: this._calendarEventService.getUserId()
      });

      this.eventsList.update(events => [
        ...events,
        {
          id: added.id,
          title: routine.name,
          start: fecha,
          allDay: true,
          extendedProps: {
            completed: false
          }
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

  async toggleCompleted(eventId: string) {
    try {
      const current = this.eventsList().find(e => e.id === eventId);
      if (!current) return;

      const newState = !current.extendedProps?.['completed'];

      await this._calendarEventService.toggleCompleted(eventId, newState);

      // Actualizar estado en lista local
      const updatedEvents = this.eventsList().map(ev =>
        ev.id === eventId
          ? {
              ...ev,
              extendedProps: {
                ...ev.extendedProps,
                completed: newState
              }
            }
          : ev
      );
      this.eventsList.set(updatedEvents);

      // Reemplazar el evento visualmente en FullCalendar
      const calendarApi = this.calendarComponent.getApi();
      const oldEvent = calendarApi.getEventById(eventId);
      if (oldEvent) {
        oldEvent.remove(); // quitar el viejo
        const updated = updatedEvents.find(e => e.id === eventId);
        if (updated) {
          calendarApi.addEvent(updated); // agregar nuevo con el nuevo estado
        }
      }

      this.selectedEvent.set(null);
    } catch (error) {
      console.error('Error al marcar rutina como completada:', error);
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
          extendedProps: {
            completed: event.completed ?? false,
          }
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
