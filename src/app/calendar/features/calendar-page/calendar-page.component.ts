import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // ✅
import dayGridPlugin from '@fullcalendar/daygrid';           // ✅
import timeGridPlugin from '@fullcalendar/timegrid';         // ✅
import { CalendarOptions } from '@fullcalendar/core';        // ✅

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss',
})
export class CalendarPageComponent {
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    selectable: true,
    editable: true,
    weekends: true,
  };
}
