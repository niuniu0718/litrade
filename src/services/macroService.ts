import {
  generateMacroRadar,
  generateMacroIndicators,
  generateMacroPriceCorrelation,
  generateMacroCalendar,
} from '../data/mockMacro';
import type { MacroRadarData, MacroIndicator, MacroPriceCorrelation, MacroCalendarEvent } from '../types/macro';

export async function fetchMacroRadar(): Promise<MacroRadarData[]> {
  return generateMacroRadar();
}

export async function fetchMacroIndicators(): Promise<MacroIndicator[]> {
  return generateMacroIndicators();
}

export async function fetchMacroPriceCorrelation(): Promise<MacroPriceCorrelation[]> {
  return generateMacroPriceCorrelation();
}

export async function fetchMacroCalendar(): Promise<MacroCalendarEvent[]> {
  return generateMacroCalendar();
}
