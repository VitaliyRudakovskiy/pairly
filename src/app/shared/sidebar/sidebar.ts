import { Component } from '@angular/core';
import { SIDEBAR_ITEMS } from './constants';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterLink, RouterModule],
})
export class Sidebar {
  sidebarItems = SIDEBAR_ITEMS;
}
