import * as XLSX from 'xlsx';
import type { Customer, Part, ServiceAppointment } from '../types';

export type ExportFormat = 'xlsx' | 'csv';

/**
 * Export customers data to file
 */
export function exportCustomers(customers: Customer[], format: ExportFormat = 'xlsx') {
  const data = customers.flatMap(customer => 
    customer.vehicles.map(vehicle => ({
      'Customer ID': customer.id,
      'Customer Name': `${customer.firstName} ${customer.lastName}`,
      'Email': customer.email,
      'Phone': customer.phone,
      'Address': customer.address,
      'Vehicle ID': vehicle.id,
      'Make': vehicle.make,
      'Model': vehicle.model,
      'Year': vehicle.year,
      'VIN': vehicle.vin,
      'License Plate': vehicle.licensePlate,
      'Current Mileage': vehicle.mileage,
    }))
  );

  exportToFile(data, `customers_${getTimestamp()}`, format);
}

/**
 * Export parts data to file
 */
export function exportParts(parts: Part[], format: ExportFormat = 'xlsx') {
  const data = parts.map(part => ({
    'Part ID': part.id,
    'Name': part.name,
    'Part Number': part.partNumber,
    'Category': part.category,
    'Manufacturer': part.manufacturer,
    'Quantity': part.quantityInStock,
    'Reorder Level': part.reorderLevel,
    'Reorder Quantity': part.reorderQuantity,
    'Cost': part.cost,
    'Retail Price': part.retailPrice,
    'Supplier': part.supplier,
    'Location': part.location,
  }));

  exportToFile(data, `parts_${getTimestamp()}`, format);
}

/**
 * Export appointments data to file
 */
export function exportAppointments(appointments: ServiceAppointment[], format: ExportFormat = 'xlsx') {
  const data = appointments.map(appointment => ({
    'Appointment ID': appointment.id,
    'Customer ID': appointment.customerId,
    'Customer Name': appointment.customerName,
    'Vehicle ID': appointment.vehicleId,
    'Vehicle Info': appointment.vehicleInfo,
    'Service Type': appointment.serviceType,
    'Date': appointment.appointmentDate,
    'Status': appointment.status,
    'Estimated Cost': appointment.estimatedCost,
    'Actual Cost': appointment.actualCost || '',
    'Assigned Technician': appointment.assignedTechnician || '',
    'Description': appointment.description,
    'Notes': appointment.notes || '',
  }));

  exportToFile(data, `appointments_${getTimestamp()}`, format);
}

/**
 * Export all data to a single file with multiple sheets (XLSX only)
 */
export function exportAllData(
  customers: Customer[],
  parts: Part[],
  appointments: ServiceAppointment[],
  format: ExportFormat = 'xlsx'
) {
  if (format === 'csv') {
    // For CSV, export separate files
    exportCustomers(customers, 'csv');
    exportParts(parts, 'csv');
    exportAppointments(appointments, 'csv');
    return;
  }

  // For XLSX, create a workbook with multiple sheets
  const wb = XLSX.utils.book_new();

  // Customers sheet
  const customersData = customers.flatMap(customer => 
    customer.vehicles.map(vehicle => ({
      'Customer ID': customer.id,
      'Customer Name': `${customer.firstName} ${customer.lastName}`,
      'Email': customer.email,
      'Phone': customer.phone,
      'Address': customer.address,
      'Vehicle ID': vehicle.id,
      'Make': vehicle.make,
      'Model': vehicle.model,
      'Year': vehicle.year,
      'VIN': vehicle.vin,
      'License Plate': vehicle.licensePlate,
      'Current Mileage': vehicle.mileage,
    }))
  );
  const customersWS = XLSX.utils.json_to_sheet(customersData);
  XLSX.utils.book_append_sheet(wb, customersWS, 'Customers');

  // Parts sheet
  const partsData = parts.map(part => ({
    'Part ID': part.id,
    'Name': part.name,
    'Part Number': part.partNumber,
    'Category': part.category,
    'Manufacturer': part.manufacturer,
    'Quantity': part.quantityInStock,
    'Reorder Level': part.reorderLevel,
    'Reorder Quantity': part.reorderQuantity,
    'Cost': part.cost,
    'Retail Price': part.retailPrice,
    'Supplier': part.supplier,
    'Location': part.location,
  }));
  const partsWS = XLSX.utils.json_to_sheet(partsData);
  XLSX.utils.book_append_sheet(wb, partsWS, 'Parts');

  // Appointments sheet
  const appointmentsData = appointments.map(appointment => ({
    'Appointment ID': appointment.id,
    'Customer ID': appointment.customerId,
    'Customer Name': appointment.customerName,
    'Vehicle ID': appointment.vehicleId,
    'Vehicle Info': appointment.vehicleInfo,
    'Service Type': appointment.serviceType,
    'Date': appointment.appointmentDate,
    'Status': appointment.status,
    'Estimated Cost': appointment.estimatedCost,
    'Actual Cost': appointment.actualCost || '',
    'Assigned Technician': appointment.assignedTechnician || '',
    'Description': appointment.description,
    'Notes': appointment.notes || '',
  }));
  const appointmentsWS = XLSX.utils.json_to_sheet(appointmentsData);
  XLSX.utils.book_append_sheet(wb, appointmentsWS, 'Appointments');

  // Service Intervals sheet
  const serviceIntervalsData = customers.flatMap(customer =>
    customer.vehicles.flatMap(vehicle =>
      vehicle.serviceIntervals.map(interval => ({
        'Customer ID': customer.id,
        'Customer Name': `${customer.firstName} ${customer.lastName}`,
        'Vehicle ID': vehicle.id,
        'Vehicle': `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        'Service Name': interval.name,
        'Description': interval.description,
        'Last Performed Date': interval.lastPerformedDate || '',
        'Last Performed Mileage': interval.lastPerformedMileage || '',
        'Next Due Date': interval.nextDueDate || '',
        'Next Due Mileage': interval.nextDueMileage || '',
        'Interval Months': interval.intervalMonths,
        'Interval Miles': interval.intervalMiles,
        'Is Overdue': interval.isOverdue ? 'Yes' : 'No',
        'Has Scheduled Appointment': interval.hasScheduledAppointment ? 'Yes' : 'No',
      }))
    )
  );
  const serviceIntervalsWS = XLSX.utils.json_to_sheet(serviceIntervalsData);
  XLSX.utils.book_append_sheet(wb, serviceIntervalsWS, 'Service Intervals');

  // Write file
  XLSX.writeFile(wb, `garage_data_${getTimestamp()}.xlsx`);
}

/**
 * Helper function to export data to file
 */
function exportToFile(data: any[], filename: string, format: ExportFormat) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  if (format === 'xlsx') {
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } else {
    XLSX.writeFile(wb, `${filename}.csv`);
  }
}

/**
 * Get timestamp for filenames
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
}
