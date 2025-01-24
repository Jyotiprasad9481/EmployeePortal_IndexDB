import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle = 'Employee List';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/') {
        this.pageTitle = 'Employee List';
      } else if (event.url === '/add') {
        this.pageTitle = 'Add Employee Details';
      } else if (event.url.includes('/edit')) {
        this.pageTitle = 'Edit Employee Details';
      }
    });
  }
}
