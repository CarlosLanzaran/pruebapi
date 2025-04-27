import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { AuthStateService } from '../../app/shared/data-access/auth-state.service';

export interface CalendarEventCreate {
  title: string;
  date: string;
  completed: boolean;
  userId?: string;
}

@Injectable()
export class CalendarEventService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);
  private _collection = collection(this._firestore, 'calendar-events');

  async add(event: CalendarEventCreate) {
    await addDoc(this._collection, {
      ...event,
      userId: this.getCurrentUserId(),
    });
  }

  async getEvents(): Promise<any[]> {
    const snapshot = await getDocs(this._collection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  getCurrentUserId(): string | undefined {
    return this._authState.currentUser?.uid;
  }
}
