/**
 * @brief Device model that uses a SoC.
 */
export interface SocDevice {
  name: string;
  brand: string;
  imageUrl?: string;
  releaseDate: string;
}

/**
 * @brief SoC specification contract for dashboard modules.
 */
export interface SocSpec {
  id: string;
  name: string;
  manufacturer: string;
  releaseYear: number;
  processNode: string;
  cpuConfig: string;
  gpuName: string;
  npuName: string;
  antutuScore: number;
  geekbenchSingle: number;
  geekbenchMulti: number;
  gpuScore: number;
  powerEfficiency: number;
  thermalRating: number;
  category: 'flagship' | 'mid-range' | 'entry';
  highlights: string[];
  warnings: string[];
  devices: SocDevice[];
}
