import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { FullCalendarModule } from '@fullcalendar/angular'; // ✅ AÑADIDO

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyBvOA0-7CSlUD1teIB3lz-H2IUB2xqjuyg",
        authDomain: "pruebapi-9e145.firebaseapp.com",
        projectId: "pruebapi-9e145",
        storageBucket: "pruebapi-9e145.firebasestorage.app",
        messagingSenderId: "931235972037",
        appId: "1:931235972037:web:56d5f27eb2e6472fdb01ac"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(FullCalendarModule), // ✅ AÑADIDO
  ],
};
