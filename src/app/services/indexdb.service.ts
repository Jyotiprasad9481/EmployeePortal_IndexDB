import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class IndexDBService {
  private readonly DB_NAME = 'employeeDB';
  private readonly STORE_NAME = 'employees';
  private db!: IDBDatabase;
  
  employees = signal<Employee[]>([]);
  
  constructor() {
    this.initDB();
  }

  private initDB(): void {
    const request = indexedDB.open(this.DB_NAME, 1);

    request.onerror = (event) => {
      console.error('Error opening DB', event);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.loadEmployees();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
      
      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('role', 'role', { unique: false });
      objectStore.createIndex('startDate', 'startDate', { unique: false });
      objectStore.createIndex('endDate', 'endDate', { unique: false });
    };
  }

  private loadEmployees(): void {
    const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(this.STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      this.employees.set(request.result);
    };
  }

  addEmployee(employee: Employee): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(this.STORE_NAME);
      const request = objectStore.add(employee);

      request.onsuccess = () => {
        this.loadEmployees();
        resolve();
      };

      request.onerror = () => {
        reject('Error adding employee');
      };
    });
  }

  updateEmployee(employee: Employee): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(this.STORE_NAME);
      const request = objectStore.put(employee);

      request.onsuccess = () => {
        this.loadEmployees();
        resolve();
      };

      request.onerror = () => {
        reject('Error updating employee');
      };
    });
  }

  deleteEmployee(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(this.STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        this.loadEmployees();
        resolve();
      };

      request.onerror = () => {
        reject('Error deleting employee');
      };
    });
  }
}
