import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  imports: [Sidebar, RouterOutlet],
})
export class MainLayout {}
