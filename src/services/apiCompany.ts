import {
  generateCompanies,
  generateFinancialReports,
  generateIndustryCycle,
} from '../data/mockCompany';
import type { Company, FinancialReport, IndustryCycle } from '../types/company';

export async function fetchCompanies(): Promise<Company[]> {
  return generateCompanies();
}

export async function fetchFinancialReports(companyId: string): Promise<FinancialReport[]> {
  return generateFinancialReports(companyId);
}

export async function fetchIndustryCycle(): Promise<IndustryCycle> {
  return generateIndustryCycle();
}
