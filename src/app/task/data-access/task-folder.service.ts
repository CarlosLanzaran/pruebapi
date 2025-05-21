import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskFolderService {
  private collectionName = 'carpetas';

  constructor(private firestore: AngularFirestore) {}

  getFolders(): Observable<string[]> {
    return this.firestore.collection<{ nombre: string }>(this.collectionName)
      .valueChanges()
      .pipe(map(folders => folders.map(f => f.nombre)));
  }

  addFolder(nombre: string): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ nombre });
  }
}
