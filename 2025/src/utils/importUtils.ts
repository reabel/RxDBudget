import * as XLSX from 'xlsx';
import type { Customer, Part, ServiceAppointment, Vehicle } from '../types';

/**
 * Import customers from uploaded file
 */
export async function importCustomers(file: File): Promise<Customer[]> {
  const data = await readFile(file);
  const customers = new Map<string, Customer>();

  data.forEach((row: any) => {
    const customerId = String(row['Customer ID'] || '').trim();
    const vehicleId = String(row['Vehicle ID'] || '').trim();

    if (!customerId || !vehicleId) return;

    // Get or create customer
    if (!customers.has(customerId)) {
      const nameParts = String(row['Customer Name'] || '').trim().split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || '';

      customers.set(customerId, {
        id: customerId,
        firstName,
        lastName,
        email: String(row['Email'] || '').trim(),
        phone: String(row['Phone'] || '').trim(),
        address: String(row['Address'] || '').trim(),
        vehicles: [],
        createdAt: new Date(),
      });
    }

    // Add vehicle to customer
    const customer = customers.get(customerId)!;
    const vehicle: Vehicle = {
      id: vehicleId,
      make: String(row['Make'] || '').trim(),
      model: String(row['Model'] || '').trim(),
      year: Number(row['Year']) || new Date().getFullYear(),
      vin: String(row['VIN'] || '').trim(),
      licensePlate: String(row['License Plate'] || '').trim(),
      mileage: Number(row['Current Mileage']) || 0,
      serviceIntervals: [],
    };

    // Avoid duplicate vehicles
    if (!customer.vehicles.find(v => v.id === vehicleId)) {
      customer.vehicles.push(vehicle);
    }
  });

  return Array.from(customers.values());
}

/**
 * Import parts from uploaded file
 */
export async function importParts(file: File): Promise<Part[]> {
  const data = await readFile(file);
  const parts: Part[] = [];

  data.forEach((row: any) => {
    const partId = String(row['Part ID'] || '').trim();
    if (!partId) return;

    // Avoid duplicates
    if (parts.find(p => p.id === partId)) return;

    parts.push({
      id: partId,
      partNumber: String(row['Part Number'] || '').trim(),
      name: String(row['Name'] || '').trim(),
      description: String(row['Description'] || '').trim() || '',
      category: String(row['Category'] || '').trim(),
      manufacturer: String(row['Manufacturer'] || '').trim(),
      cost: Number(row['Cost']) || 0,
      retailPrice: Number(row['Retail Price']) || 0,
      quantityInStock: Number(row['Quantity']) || 0,
      reorderLevel: Number(row['Reorder Level']) || 0,
      reorderQuantity: Number(row['Reorder Quantity']) || 0,
      supplier: String(row['Supplier'] || '').trim(),
      location: String(row['Location'] || '').trim(),
    });
  });

  return parts;
}

/**
 * Import appointments from uploaded file
 */
export async function importAppointments(file: File): Promise<ServiceAppointment[]> {
  const data = await readFile(file);
  const appointments: ServiceAppointment[] = [];

  data.forEach((row: any) => {
    const appointmentId = String(row['Appointment ID'] || '').trim();
    if (!appointmentId) return;

    // Avoid duplicates
    if (appointments.find(a => a.id === appointmentId)) return;

    const appointmentDate = parseDate(row['Date']);

    appointments.push({
      id: appointmentId,
      customerId: String(row['Customer ID'] || '').trim(),
      customerName: String(row['Customer Name'] || '').trim(),
      vehicleId: String(row['Vehicle ID'] || '').trim(),
      vehicleInfo: String(row['Vehicle Info'] || '').trim(),
      appointmentDate,
      estimatedDuration: 60, // Default
      status: parseStatus(row['Status']),
      serviceType: String(row['Service Type'] || '').trim(),
      description: String(row['Description'] || '').trim(),
      assignedTechnician: String(row['Assigned Technician'] || '').trim() || undefined,
      estimatedCost: Number(row['Estimated Cost']) || 0,
      actualCost: Number(row['Actual Cost']) || undefined,
      parts: [],
      labor: [],
      notes: String(row['Notes'] || '').trim(),
      createdAt: new Date(),
    });
  });

  return appointments;
}

/**
 * Read and parse Excel or CSV file
 */
async function readFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error('No sheets found in file'));
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject(new Error('Failed to read worksheet'));
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse date from various formats
 */
function parseDate(value: any): Date {
  if (!value) return new Date();
  
  if (value instanceof Date) return value;
  
  // Try parsing as string
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed;
  
  // Default to current date
  return new Date();
}

/**
 * Parse appointment status
 */
function parseStatus(value: any): ServiceAppointment['status'] {
  const status = String(value || '').toLowerCase().trim();
  
  switch (status) {
    case 'scheduled':
      return 'scheduled';
    case 'in-progress':
    case 'in progress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'no-show':
    case 'no show':
      return 'no-show';
    default:
      return 'scheduled';
  }
}

/**
 * Validate imported data
 */
export function validateImportData(data: any[], type: 'customers' | 'parts' | 'appointments'): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push('No data found in file');
    return { valid: false, errors };
  }

  switch (type) {
    case 'customers':
      validateCustomersData(data, errors);
      break;
    case 'parts':
      validatePartsData(data, errors);
      break;
    case 'appointments':
      validateAppointmentsData(data, errors);
      break;
  }

  return { valid: errors.length === 0, errors };
}

function validateCustomersData(data: any[], errors: string[]) {
  const requiredFields = ['Customer ID', 'Customer Name', 'Vehicle ID', 'Make', 'Model', 'Year'];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
}

function validatePartsData(data: any[], errors: string[]) {
  const requiredFields = ['Part ID', 'Name', 'Part Number', 'Category'];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
}

function validateAppointmentsData(data: any[], errors: string[]) {
  const requiredFields = ['Appointment ID', 'Customer ID', 'Vehicle ID', 'Service Type', 'Date'];
  
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });
}
