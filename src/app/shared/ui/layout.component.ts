import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  selector: 'app-layout',
    styleUrl: './layout.component.scss',
  template: `
    <header class="h-[80px] mb-8 w-full max-w-screen-lg mx-auto px-4 grid grid-cols-3 items-center">
      <!-- 1) Logo / home -->
      <div class="flex items-center">
        <a class="text-2xl font-bold" routerLink="/tasks">FitTrack</a>
      </div>

      <!-- 2) Nav central -->
      <nav class="flex justify-center space-x-6">
       <a
          routerLink="/home"
          routerLinkActive="text-blue-600 border-b-2 border-blue-600"
          class="px-2 py-1 font-medium hover:text-blue-500"
        >
          Home
        </a>
        <a
          routerLink="/tasks"
          routerLinkActive="text-blue-600 border-b-2 border-blue-600"
          class="px-2 py-1 font-medium hover:text-blue-500"
        >
          Tasks
        </a>
        <a
          routerLink="/calendar"
          routerLinkActive="text-blue-600 border-b-2 border-blue-600"
          class="px-2 py-1 font-medium hover:text-blue-500"
        >
          Calendario
        </a>
      </nav>

      <!-- 3) Avatar / menú -->
      <div class="flex justify-end relative">
        <img
          src="perfil.jpeg"
          alt="Avatar"
          class="h-10 w-10 rounded-full cursor-pointer"
          (click)="toggleMenu()"
        />
        <ul
          *ngIf="isMenuOpen"
          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50"
        >
          <li class="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" (click)="goToProfile()">
            Perfil
          </li>
          <li class="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer" (click)="logOut()">
            Cerrar sesión
          </li>
        </ul>
      </div>
    </header>

    <router-outlet />
  `,
})
export default class LayoutComponent {
  private authState = inject(AuthStateService);
  private router = inject(Router);
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToProfile() {
    this.isMenuOpen = false;
    this.router.navigateByUrl('/profile');
  }

  async logOut() {
    this.isMenuOpen = false;
    await this.authState.logOut();
    this.router.navigateByUrl('/auth/sign-in');
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!target.closest('app-layout header')) {
      this.isMenuOpen = false;
    }
  }
}
