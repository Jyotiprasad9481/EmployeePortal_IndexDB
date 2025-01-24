import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IndexDBService } from '../../services/indexdb.service';
import { Employee, EMPLOYEE_ROLES } from '../../models/employee.interface';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  roles = EMPLOYEE_ROLES;
  showStartDatePicker = false;
  showEndDatePicker = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: IndexDBService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number) {
    const employee = this.dbService.employees().find(emp => emp.id === id);
    if (employee) {
      this.employeeForm.patchValue({
        name: employee.name,
        role: employee.role,
        startDate: new Date(employee.startDate),
        endDate: employee.endDate ? new Date(employee.endDate) : null
      });
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  openStartDatePicker(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showStartDatePicker = true;
    this.showEndDatePicker = false;
  }

  openEndDatePicker(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showEndDatePicker = true;
    this.showStartDatePicker = false;
  }

  onStartDateSelected(date: Date) {
    this.employeeForm.patchValue({ startDate: date });
    this.showStartDatePicker = false;
  }

  onEndDateSelected(date: Date) {
    this.employeeForm.patchValue({ endDate: date });
    this.showEndDatePicker = false;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employee: Employee = {
        name: formValue.name,
        role: formValue.role,
        startDate: new Date(formValue.startDate),
        endDate: formValue.endDate ? new Date(formValue.endDate) : null
      };

      if (this.isEditMode && this.employeeId) {
        employee.id = this.employeeId;
        this.dbService.updateEmployee(employee).then(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.dbService.addEmployee(employee).then(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
