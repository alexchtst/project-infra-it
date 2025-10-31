import { mapdataproperty } from "@/context-provider/data-flow-provider";
import DataNetwork2GJSON from "@/data/data_2g.json";
import DataNetwork4GJSON from "@/data/data_4g.json";
import DataSebaranKebutuhanListrikJSON from "@/data/data-listrik.json";
import DataDemoGrafiJSON from "@/data/data-demografi.json";
import DataSekolahJson from "@/data/data-sekolah.json";

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

export interface DataKebutuhanListrikInterface {
  village: string;
  district: string;
  citizens: number;
  info: string;
}

export interface DataDemografiInterface {
  district: string;
  male: number;
  female: number;
  citizens: number;
}

export interface DataSekolahInterface {
  name: string;
  district: string;
  longitude: number;
  latitude: number;
}

export function NetworkDataSelector(
  district?: string,
  type: mapdataproperty.g2 | mapdataproperty.g4 = mapdataproperty.g2
): DataNetworkInterface[] {
  const data =
    type === mapdataproperty.g2
      ? (DataNetwork2GJSON as DataNetworkJSONInterface[])
      : (DataNetwork4GJSON as DataNetworkJSONInterface[]);

  const filtered = district ? data.filter((item) => {
    const matchDistrict = district ? item.KEC === district : true;
    return matchDistrict;
  }) : data;

  return filtered.map((item) => ({
    village: item["DES/KEL"],
    district: item.KEC,
    kdepum: item.KDEPUM,
    long: item.LONGITUDE,
    lat: item.LATITUDE,
  }));
}

export function KebutuhanListrikDataSelector(
  district?: string,
): DataKebutuhanListrikInterface[] {
  const data =
    DataSebaranKebutuhanListrikJSON as DataKebutuhanListrikInterface[];

  const filtered = district ? data.filter((item) => {
    const matchDistrict = district ? item.district === district : true;
    return matchDistrict;
  }) : data;

  return filtered.map((item) => ({
    village: item.village,
    district: item.district,
    citizens: item.citizens,
    info: item.info,
  }));
}

export function DemografiDataSelector(
  district?: string,
): DataDemografiInterface[] {
  const data = DataDemoGrafiJSON as DataDemografiInterface[];

  const filtered = data.filter((item) => {
    const matchDistrict = district ? item.district === district : true;
    return matchDistrict;
  });

  return filtered.map((item) => ({
    district: item.district,
    citizens: item.citizens,
    female: item.female,
    male: item.male,
  }));
}

export function SekolahDataSelector(
  district?: string,
): DataSekolahInterface[] {
  const data = DataSekolahJson as DataSekolahInterface[];

  const filtered = district ? data.filter((item) => {
    const matchDistrict = district ? item.district === district : true;
    return matchDistrict;
  }) : data;

  return filtered.map((item) => ({
    name: item.name,
    district: item.district,
    latitude: item.latitude,
    longitude: item.longitude,
  }));
}