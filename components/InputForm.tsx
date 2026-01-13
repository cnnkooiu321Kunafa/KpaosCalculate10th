import React, { useState } from 'react';
import { BambuType, ForestType, IndicesInput, MainType, MangroveSpecies } from '../types';

interface InputFormProps {
  onAdd: (data: any) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onAdd }) => {
  const [d, setD] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [mainType, setMainType] = useState<MainType>(MainType.Tree);
  const [bambuType, setBambuType] = useState<BambuType>(BambuType.BongPa);
  const [forestType, setForestType] = useState<ForestType>(ForestType.Rainforest);
  const [mangroveSpecies, setMangroveSpecies] = useState<MangroveSpecies>(MangroveSpecies.SamaeKhao);
  
  const [calcIndices, setCalcIndices] = useState(false);
  const [indicesData, setIndicesData] = useState<IndicesInput>({
    plotTreeSpecies: 0,
    plots: 0,
    crossTreeSpecie: 0,
    cross: 0,
    plantSpecies: 0,
    area: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d || !height) return;

    onAdd({
      d: parseFloat(d),
      height: parseFloat(height),
      mainType,
      bambuType: mainType === MainType.Bambu ? bambuType : undefined,
      forestType: mainType === MainType.Tree ? forestType : undefined,
      mangroveSpecies: (mainType === MainType.Tree && forestType === ForestType.Mangrove) ? mangroveSpecies : undefined,
      indices: calcIndices ? indicesData : undefined
    });

    // Reset basics
    setD('');
    setHeight('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">กรอกข้อมูลต้นไม้</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">D: เส้นรอบวง 1.30 ม. (ซม.)</label>
          <input
            type="number"
            step="0.01"
            required
            value={d}
            onChange={(e) => setD(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hight: ความสูง (เมตร)</label>
          <input
            type="number"
            step="0.01"
            required
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ประเภท (Type)</label>
        <div className="flex space-x-4">
          {Object.values(MainType).map((type) => (
            <label key={type} className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                name="mainType"
                value={type}
                checked={mainType === type}
                onChange={() => setMainType(type)}
                className="text-green-600 focus:ring-green-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {mainType === MainType.Bambu && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชนิดไผ่</label>
          <select
            value={bambuType}
            onChange={(e) => setBambuType(e.target.value as BambuType)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.values(BambuType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {mainType === MainType.Tree && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชนิดป่า</label>
          <select
            value={forestType}
            onChange={(e) => setForestType(e.target.value as ForestType)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.values(ForestType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {mainType === MainType.Tree && forestType === ForestType.Mangrove && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">พันธุ์ไม้ป่าชายเลน</label>
          <select
            value={mangroveSpecies}
            onChange={(e) => setMangroveSpecies(e.target.value as MangroveSpecies)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.values(MangroveSpecies).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4 border-t dark:border-gray-700 pt-4">
        <label className="flex items-center space-x-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={calcIndices}
            onChange={(e) => setCalcIndices(e.target.checked)}
            className="rounded text-green-600 focus:ring-green-500"
          />
          <span className="font-medium text-gray-700 dark:text-gray-300">คำนวณค่าดัชนี (Indices)</span>
        </label>

        {calcIndices && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border dark:border-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="dark:text-gray-200">จำนวนแปลงที่พบพันธุ์ไม้ (Plot_treeSpecies)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.plotTreeSpecies} onChange={e => setIndicesData({...indicesData, plotTreeSpecies: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="dark:text-gray-200">จำนวนแปลงทั้งหมด (Plots)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.plots} onChange={e => setIndicesData({...indicesData, plots: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="dark:text-gray-200">พื้นที่หน้าตัดพันธุ์ไม้ที่เลือก (Cross_treespecie)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.crossTreeSpecie} onChange={e => setIndicesData({...indicesData, crossTreeSpecie: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="dark:text-gray-200">พื้นที่หน้าตัดรวม (Cross)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.cross} onChange={e => setIndicesData({...indicesData, cross: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="dark:text-gray-200">ความหนาแน่นพันธุ์ไม้ (Plant_species)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.plantSpecies} onChange={e => setIndicesData({...indicesData, plantSpecies: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="dark:text-gray-200">พื้นที่แปลงสำรวจ (Area)</label>
              <input type="number" className="w-full border p-1 rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" 
                value={indicesData.area} onChange={e => setIndicesData({...indicesData, area: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition duration-150"
      >
        คำนวณและบันทึก
      </button>
    </form>
  );
};