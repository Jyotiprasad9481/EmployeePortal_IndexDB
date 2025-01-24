export interface Employee {
    id?: number;
    name: string;
    role: typeof EMPLOYEE_ROLES[number];
    startDate: Date;
    endDate?: Date | null;
}

export const EMPLOYEE_ROLES = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner'
] as const;

export type EmployeeRole = typeof EMPLOYEE_ROLES[number];
