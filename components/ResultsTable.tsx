import React from 'react';
import { CalculationRecord } from '../types';

interface ResultsTableProps {
  records: CalculationRecord[];
  onClear: () => void;
  forestArea: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ records, onClear, forestArea }) => {
  // Group by "type" to calculate averages correctly as per requirements
  const getRecordKey = (r: CalculationRecord) => {
    return [r.mainType, r.bambuType, r.forestType, r.mangroveSpecies].filter(Boolean).join(' - ');
  };

  const groupedStats = records.reduce((acc, curr) => {
    const key = getRecordKey(curr);
    if (!acc[key]) {
      acc[key] = { sumCn: 0, count: 0 };
    }
    acc[key].sumCn += curr.cn;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { sumCn: number; count: number }>);

  let totalCm = 0;
  let typeCount = 0;

  (Object.values(groupedStats) as { sumCn: number; count: number }[]).forEach(stat => {
    const Cm = stat.sumCn / stat.count; // Average carbon for this type
    totalCm += Cm;
    typeCount += 1;
  });

  const C_all = typeCount > 0 ? (totalCm / typeCount) * forestArea : 0;
  const C_total_absorbed = C_all * 3.66;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 no-print gap-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">ตารางสรุปผลการคำนวณ</h3>
        <div className="flex space-x-3">
          <button onClick={onClear} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40 transition font-medium">
            ล้างข้อมูล
          </button>
          <button onClick={handlePrint} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md transition font-medium">
            ดาวน์โหลด PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-300 border-collapse">
          <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-100 dark:bg-gray-700 tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">Type</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">Detail</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">D (cm)</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">H (m)</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">Size Class</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">W_t (kg)</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">C_n (kgC)</th>
              <th className="px-6 py-4 font-semibold border-b dark:border-gray-600">Indices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((r) => (
              <tr key={r.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors even:bg-gray-50 dark:even:bg-gray-900/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.mainType}</td>
                <td className="px-6 py-4">{r.bambuType || r.mangroveSpecies || r.forestType || '-'}</td>
                <td className="px-6 py-4">{r.d}</td>
                <td className="px-6 py-4">{r.height}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${r.treeSize === 'Big_tree' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      r.treeSize === 'Young_tree' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {r.treeSize}
                  </span>
                </td>
                <td className="px-6 py-4">{r.wt.toFixed(4)}</td>
                <td className="px-6 py-4 font-bold text-green-700 dark:text-green-400">{r.cn.toFixed(4)}</td>
                <td className="px-6 py-4 text-xs">
                  {r.indices 
                    ? (
                      <div className="flex flex-col space-y-1">
                        <span>rf: {r.indices.rf.toFixed(2)}</span>
                        <span>rdo: {r.indices.rdo.toFixed(2)}</span>
                        <span>rp: {r.indices.rp.toFixed(2)}</span>
                      </div>
                    )
                    : <span className="text-gray-400">-</span>
                  }
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-lg">
                  ยังไม่มีข้อมูลในตาราง <br/>
                  <span className="text-sm mt-2 block opacity-75">กรุณากรอกข้อมูลและกดปุ่มคำนวณด้านบน</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50 break-inside-avoid shadow-inner">
          <h4 className="text-xl font-bold text-green-900 dark:text-green-300 mb-6 border-b border-green-200 dark:border-green-800 pb-2">
            สรุปผลการคำนวณ (Summary)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">จำนวนกลุ่มพันธุ์ไม้</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{typeCount} <span className="text-sm font-normal text-gray-500">ชนิด</span></p>
             </div>
             
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">พื้นที่ป่าทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{forestArea} <span className="text-sm font-normal text-gray-500">ไร่</span></p>
             </div>

             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ปริมาณการกักเก็บคาร์บอน (C_all)</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {C_all.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">kgC</span>
                </p>
             </div>
             
             <div className="bg-green-600 dark:bg-green-800 p-5 rounded-lg shadow-md md:col-span-4 text-white">
                <p className="text-green-100 text-sm font-medium mb-1">การดูดซับคาร์บอนไดออกไซด์สุทธิ (Net CO₂ Absorption)</p>
                <p className="text-4xl font-extrabold tracking-tight">
                  {C_total_absorbed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                  <span className="text-xl font-normal ml-2 opacity-90">kgCO₂e</span>
                </p>
                <p className="text-xs mt-2 text-green-200 opacity-80">สูตรคำนวณ: C_all × 3.66</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};