import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Task } from './task/task.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard, Task],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
