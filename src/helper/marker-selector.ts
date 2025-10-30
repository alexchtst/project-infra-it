import { mapdataproperty } from "@/context-provider/data-flow-provider";
import DataNetwork2GJSON from "@/data/data_2g.json";
import DataNetwork4GJSON from "@/data/data_4g.json";

export interface DataNetworkJSONInterface {
  "DES/KEL": string;
  KEC: string;
  "KAB/KOT": string;
  PROV: string;
  KDEPUM: string;
  LONGITUDE: number;
  LATITUDE: number;
  kode_provinsi: string;
  kode_kabupaten: string;
  kode_kecamatan: string;
  kode_desa: string;
}

export interface DataNetworkInterface {
  village: string;
  district: string;
  kdepum: string;
  long: number;
  lat: number;
}

export function NetworkDataSelector(
  district?: string,
  village?: string,
  type: mapdataproperty.g2 | mapdataproperty.g4 = mapdataproperty.g2
): DataNetworkInterface[] {
  const data = type === mapdataproperty.g2 ? DataNetwork2GJSON as DataNetworkJSONInterface[] : DataNetwork4GJSON as DataNetworkJSONInterface[];

  const filtered = data.filter((item) => {
    const matchDistrict = district ? item.KEC === district : true;
    const matchVillage = village ? item["DES/KEL"] === village : true;
    return matchDistrict && matchVillage;
  });

  return filtered.map((item) => ({
    village: item["DES/KEL"],
    district: item.KEC,
    kdepum: item.KDEPUM,
    long: item.LONGITUDE,
    lat: item.LATITUDE,
  }));
}
