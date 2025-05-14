import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { AuthStateService } from '../../app/shared/data-access/auth-state.service';
import { Observable } from 'rxjs';

export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  completed: boolean;
  userId?: string;
}

export type CalendarEventCreate = Omit<CalendarEvent, 'id'>;

@Injectable({ providedIn: 'root' })
export class CalendarEventService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);
  private _collection = collection(this._firestore, 'calendar-events');

  async add(event: CalendarEventCreate): Promise<{ id: string }> {
    const docRef = await addDoc(this._collection, {
      ...event,
      userId: this._authState.currentUser?.uid,
    });
    return { id: docRef.id };
  }

  async getEvents(): Promise<CalendarEvent[]> {
    const snapshot = await getDocs(this._collection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CalendarEvent));
  }

  async updateDate(eventId: string, newDate: string) {
    const eventRef = doc(this._firestore, 'calendar-events', eventId);
    return updateDoc(eventRef, { date: newDate });
  }

  async deleteEvent(eventId: string) {
    const eventRef = doc(this._firestore, 'calendar-events', eventId);
    return deleteDoc(eventRef);
  }

  async deleteEventsByRoutineTitle(title: string) {
    const snapshot = await getDocs(query(this._collection, where('title', '==', title)));
    const deletes = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletes);
  }

  async deleteRoutineFromDate(title: string, date: string, userId: string) {
    const snapshot = await getDocs(
      query(this._collection, where('date', '==', date), where('title', '==', title), where('userId', '==', userId))
    );
    const deletes = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletes);
  }

  getUserId(): string {
    return this._authState.currentUser?.uid || '';
  }
async toggleCompleted(eventId: string, newState: boolean) {
  const docRef = doc(this._firestore, 'calendar-events', eventId);
  await updateDoc(docRef, { completed: newState });
}
  async getCompletedRoutinesByMonth(year: number, month: number) {
  const userId = this.getUserId();
  const all = await this.getEvents();

  return all.filter(event => {
    const date = new Date(event.date);
    return (
      event.userId === userId &&
      event.completed &&
      date.getFullYear() === year &&
      date.getMonth() === month
    );
  });
}

async getCompletedRoutinesByYear(year: number) {
  const userId = this.getUserId();
  const all = await this.getEvents();

  return all.filter(event => {
    const date = new Date(event.date);
    return (
      event.userId === userId &&
      event.completed &&
      date.getFullYear() === year
    );
  });
}
}
