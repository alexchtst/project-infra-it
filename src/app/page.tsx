"use client";

import React from "react";
import data2g from "../data/data_2g.json"
import data4g from "../data/data_4g.json"
import { BaseMap } from "@/component/BaseMap";

enum JenisJaringanEnum {
  j2g = 'j2g',
  j4g = 'j4g',
  all = 'all'
}

export default function Home() {
  const [jenisJaringan, setJenisJaringan] = React.useState<JenisJaringanEnum>(JenisJaringanEnum.j2g)
  const [dataMap, setDataMap] = React.useState(data2g);

  React.useEffect(() => {
    if (jenisJaringan === JenisJaringanEnum.j2g) {
      setDataMap(data2g.map((d) => ({ ...d, networkType: "2G" })));
    } else if (jenisJaringan === JenisJaringanEnum.j4g) {
      setDataMap(data4g.map((d) => ({ ...d, networkType: "4G" })));
    } else {
      const merged = [
        ...data2g.map((d) => ({...d, networkType: '2G'})),
        ...data4g.map((d) => ({...d, networkType: '4G'})),
      ];
      setDataMap(merged);
    }
  }, [jenisJaringan])

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="w-full flex flex-col justify-center items-start my-10 px-5">
        <h1 className="w-full font-semibold text-3xl text-center pt-5 pb-10">Pin Lokasi Sebaran 2G dan 4G</h1>
        {/* selector */}
        <div className="flex items-center space-x-4 py-5">
          <label htmlFor="infratype" className="text-xl">Jenis Jaringan</label>
          <select
            name="infratype" 
            id="infratype"
            className="p-2 border border-gray-300 rounded-md"
            value={jenisJaringan}
            onChange={(e) => setJenisJaringan(e.target.value as JenisJaringanEnum)}
          >
            <option value={JenisJaringanEnum.j2g}>Data 2G</option>
            <option value={JenisJaringanEnum.j4g}>Data 4G</option>
            <option value={JenisJaringanEnum.all}>Data 2G + 4G</option>
          </select>
        </div>
        {/* pin map previewer */}
        <BaseMap data={dataMap} />
      </div>
    </div>
  );
}
