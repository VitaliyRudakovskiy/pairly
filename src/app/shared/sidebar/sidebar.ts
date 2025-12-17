import { Component } from '@angular/core';
import { SIDEBAR_ITEMS } from './constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterLink],
})
export class Sidebar {
  sidebarItems = SIDEBAR_ITEMS;
}
