import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.interface';
import { IndexDBService } from '../../services/indexdb.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  selectedEmployeeId = signal<number | null>(null);

  currentEmployees = computed(() => 
    this.dbService.employees().filter(emp => !emp.endDate || new Date(emp.endDate) >= new Date())
  );

  previousEmployees = computed(() => 
    this.dbService.employees().filter(emp => emp.endDate && new Date(emp.endDate) < new Date())
  );

  constructor(
    private dbService: IndexDBService,
    private router: Router
  ) {}

  addEmployee(): void {
    this.router.navigate(['/add']);
  }

  selectEmployee(id: number): void {
    this.selectedEmployeeId.set(this.selectedEmployeeId() === id ? null : id);
  }

  editEmployee(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/edit', id]);
  }

  async deleteEmployee(event: Event, id: number): Promise<void> {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await this.dbService.deleteEmployee(id);
        this.selectedEmployeeId.set(null);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }
}
