import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
type SortDirection = 'asc' | 'desc';
type SortableField = keyof Pick<Patient, 'firstName' | 'lastName' | 'email' | 'bloodGroup' | 'phoneNumber'>;

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  readonly Math = Math; // Pour l'utilisation dans le template
  loading = false;
  error = '';
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  searchTerm = '';
  selectedBloodGroup: BloodGroup | '' = '';
  readonly bloodGroups: readonly BloodGroup[] = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ] as const;
  
  sortField: SortableField = 'lastName';
  sortDirection: SortDirection = 'asc';

  constructor(
    private readonly patientService: PatientService,
    private readonly router: Router,
    private readonly modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPatients();
  }

  private async loadPatients(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      
      const patients = await firstValueFrom(this.patientService.getAllPatients());
      this.patients = patients ?? [];
      this.applyFilters();
    } catch (error) {
      this.error = `Error loading patients: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  private applyFilters(): void {
    let filtered = [...this.patients];

    // Apply search
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(patient => {
        const firstName = patient.firstName?.toLowerCase() ?? '';
        const lastName = patient.lastName?.toLowerCase() ?? '';
        const email = patient.email?.toLowerCase() ?? '';
        return firstName.includes(search) || lastName.includes(search) || email.includes(search);
      });
    }

    // Apply blood group filter
    if (this.selectedBloodGroup) {
      filtered = filtered.filter(patient => 
        patient.bloodGroup === this.selectedBloodGroup
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = String(a[this.sortField] ?? '');
      const bValue = String(b[this.sortField] ?? '');
      return this.sortDirection === 'asc' ? 
        aValue.localeCompare(bValue) : 
        bValue.localeCompare(aValue);
    });

    this.filteredPatients = filtered;
    this.totalItems = filtered.length;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onBloodGroupChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(field: SortableField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedPatients(): Patient[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPatients.slice(startIndex, startIndex + this.pageSize);
  }

  async viewPatient(id: number): Promise<void> {
    await this.router.navigate(['/patients', id]);
  }

  async editPatient(id: number): Promise<void> {
    await this.router.navigate(['/patients', id, 'edit']);
  }

  async deletePatient(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      
      await firstValueFrom(this.patientService.deletePatient(id));
      await this.loadPatients();
    } catch (error) {
      this.error = `Error deleting patient: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }
}
