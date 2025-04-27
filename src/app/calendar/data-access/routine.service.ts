import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { Observable } from 'rxjs';

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

@Injectable()
export class RoutineService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);

  private _collection = collection(this._firestore, 'routines');

  get getRoutines() {
    const userId = this._authState.currentUser?.uid;
    if (!userId) {
      console.warn('No user logged in');
      return toSignal(new Observable<Routine[]>(), { initialValue: [] });
    }

    const userQuery = query(this._collection, where('userId', '==', userId));
    return toSignal(
      collectionData(userQuery, { idField: 'id' }) as Observable<Routine[]>,
      { initialValue: [] }
    );
  }
}
