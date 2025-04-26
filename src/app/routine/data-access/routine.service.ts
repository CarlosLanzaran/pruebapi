import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineCreate = Omit<Routine, 'id'>;

const PATH = 'routines';

@Injectable()
export class RoutineService {
  private _firestore = inject(Firestore);
  private _authState = inject(AuthStateService);

  private _collection = collection(this._firestore, PATH);
  private _query = query(
    this._collection,
    where('userId', '==', this._authState.currentUser?.uid)
  );

  loading = signal<boolean>(true);

  getRoutines = toSignal(
    (collectionData(this._query, { idField: 'id' }) as Observable<Routine[]>).pipe(
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    {
      initialValue: [],
    }
  );

  getRoutine(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(routine: RoutineCreate) {
    return addDoc(this._collection, {
      ...routine,
      userId: this._authState.currentUser?.uid,
    });
  }

  update(routine: RoutineCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {
      ...routine,
      userId: this._authState.currentUser?.uid,
    });
  }
  delete(id: string) {
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }
  
}
