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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 border-b pb-2 dark:border-gray-700">
        กรอกข้อมูลต้นไม้
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            D: เส้นรอบวง 1.30 ม. (ซม.)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={d}
            onChange={(e) => setD(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-lg"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Hight: ความสูง (เมตร)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all text-lg"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ประเภท (Type)
        </label>
        <div className="flex flex-wrap gap-4">
          {Object.values(MainType).map((type) => (
            <label key={type} className={`
              flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all
              ${mainType === type 
                ? 'bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-500' 
                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
            `}>
              <input
                type="radio"
                name="mainType"
                value={type}
                checked={mainType === type}
                onChange={() => setMainType(type)}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <span className="font-medium text-gray-800 dark:text-gray-200">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-6 border border-gray-100 dark:border-gray-700">
        {mainType === MainType.Bambu && (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ชนิดไผ่ (Bamboo Type)</label>
            <select
              value={bambuType}
              onChange={(e) => setBambuType(e.target.value as BambuType)}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              {Object.values(BambuType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {mainType === MainType.Tree && (
          <div className="animate-fade-in space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ชนิดป่า (Forest Type)</label>
              <select
                value={forestType}
                onChange={(e) => setForestType(e.target.value as ForestType)}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                {Object.values(ForestType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {forestType === ForestType.Mangrove && (
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">พันธุ์ไม้ป่าชายเลน (Mangrove Species)</label>
                <select
                  value={mangroveSpecies}
                  onChange={(e) => setMangroveSpecies(e.target.value as MangroveSpecies)}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  {Object.values(MangroveSpecies).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        
        {mainType === MainType.Vine && (
           <p className="text-gray-500 dark:text-gray-400 italic">คำนวณแบบเถาวัลย์ (Vine)</p>
        )}
      </div>

      <div className="mb-6 border-t dark:border-gray-700 pt-6">
        <label className="flex items-center space-x-3 mb-4 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={calcIndices}
              onChange={(e) => setCalcIndices(e.target.checked)}
              className="w-5 h-5 rounded text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500"
            />
          </div>
          <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            คำนวณค่าดัชนี (Calculate Indices)
          </span>
        </label>

        {calcIndices && (
          <div className="bg-blue-50 dark:bg-gray-700/50 p-5 rounded-lg border border-blue-100 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm animate-fade-in">
            {[
              { label: 'จำนวนแปลงที่พบพันธุ์ไม้ (Plot_treeSpecies)', key: 'plotTreeSpecies' },
              { label: 'จำนวนแปลงทั้งหมด (Plots)', key: 'plots' },
              { label: 'พื้นที่หน้าตัดพันธุ์ไม้ที่เลือก (Cross_treespecie)', key: 'crossTreeSpecie' },
              { label: 'พื้นที่หน้าตัดรวม (Cross)', key: 'cross' },
              { label: 'ความหนาแน่นพันธุ์ไม้ (Plant_species)', key: 'plantSpecies' },
              { label: 'พื้นที่แปลงสำรวจ (Area)', key: 'area' }
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">{field.label}</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 dark:border-gray-500 p-2 rounded dark:bg-gray-600 dark:text-white focus:ring-1 focus:ring-blue-500" 
                  value={(indicesData as any)[field.key]} 
                  onChange={e => setIndicesData({...indicesData, [field.key]: parseFloat(e.target.value) || 0})}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold text-lg py-3 px-6 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
      >
        คำนวณและบันทึกข้อมูล (Calculate & Save)
      </button>
    </form>
  );
};