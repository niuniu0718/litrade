import { create } from 'zustand';
import type { Company, FinancialReport, IndustryCycle } from '../types/company';
import * as api from '../services/apiCompany';

interface CompanyState {
  companies: Company[];
  financialReports: FinancialReport[];
  cycle: IndustryCycle | null;
  selectedCompany: string;
  loading: boolean;
  fetchAll: () => Promise<void>;
  selectCompany: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  financialReports: [],
  cycle: null,
  selectedCompany: 'catl',
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [companies, cycle] = await Promise.all([
      api.fetchCompanies(),
      api.fetchIndustryCycle(),
    ]);
    const reports = await api.fetchFinancialReports('catl');
    set({ companies, cycle, financialReports: reports, loading: false });
  },

  selectCompany: async (id: string) => {
    set({ selectedCompany: id });
    const reports = await api.fetchFinancialReports(id);
    set({ financialReports: reports });
  },
}));
