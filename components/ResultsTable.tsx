import React from 'react';
import { CalculationRecord } from '../types';

interface ResultsTableProps {
  records: CalculationRecord[];
  onClear: () => void;
  forestArea: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ records, onClear, forestArea }) => {
  // Group by "type" to calculate averages correctly as per requirements
  // "เมื่อนำค่าคาร์บอนของไม้นั้นๆ (C_n)รวมกัน หารด้วยจำนวนต้นไม้ของไม้ชนิดนั้นๆ... จะได้ ค่าคาร์บอนเฉลี่ย"
  // We assume "type" refers to unique combination of MainType + SubType
  
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

  // "(ค่าคาร์บอนเฉลี่ยของไม้ชนิดนั้นๆ (C_m)รวมกันทั้งหมด แล้วหารด้วยจำนวนพันธุ์ไม้ชนิดที่ต่างกัน)*พื้นที่ป่าทั้งหมด"
  const C_all = typeCount > 0 ? (totalCm / typeCount) * forestArea : 0;
  const C_total_absorbed = C_all * 3.66;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4 no-print">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">ตารางสรุปผลการคำนวณ</h3>
        <div className="space-x-2">
          <button onClick={onClear} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800">
            ล้างข้อมูล
          </button>
          <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
            ดาวน์โหลด PDF (พิมพ์)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-gray-500 dark:text-gray-300 border-collapse">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 border dark:border-gray-600">Type</th>
              <th className="px-3 py-2 border dark:border-gray-600">Detail</th>
              <th className="px-3 py-2 border dark:border-gray-600">D (cm)</th>
              <th className="px-3 py-2 border dark:border-gray-600">H (m)</th>
              <th className="px-3 py-2 border dark:border-gray-600">Size Class</th>
              <th className="px-3 py-2 border dark:border-gray-600">W_t (kg)</th>
              <th className="px-3 py-2 border dark:border-gray-600">C_n (kgC)</th>
              <th className="px-3 py-2 border dark:border-gray-600">Indices (rf, rdo, rp)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-3 py-2 border dark:border-gray-600 font-medium dark:text-white">{r.mainType}</td>
                <td className="px-3 py-2 border dark:border-gray-600">
                  {r.bambuType || r.mangroveSpecies || r.forestType || '-'}
                </td>
                <td className="px-3 py-2 border dark:border-gray-600">{r.d}</td>
                <td className="px-3 py-2 border dark:border-gray-600">{r.height}</td>
                <td className="px-3 py-2 border dark:border-gray-600">{r.treeSize}</td>
                <td className="px-3 py-2 border dark:border-gray-600">{r.wt.toFixed(4)}</td>
                <td className="px-3 py-2 border dark:border-gray-600 font-bold text-green-700 dark:text-green-400">{r.cn.toFixed(4)}</td>
                <td className="px-3 py-2 border dark:border-gray-600">
                  {r.indices 
                    ? `rf:${r.indices.rf.toFixed(2)}, rdo:${r.indices.rdo.toFixed(2)}, rp:${r.indices.rp.toFixed(2)}`
                    : '-'
                  }
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  ยังไม่มีข้อมูล กรุณาเพิ่มข้อมูลด้านบน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800 break-inside-avoid">
          <h4 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">สรุปปริมาณการกักเก็บคาร์บอน (Carbon Sequestration Summary)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">จำนวนกลุ่มพันธุ์ไม้ (Types Count):</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{typeCount}</p>
             </div>
             <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">พื้นที่ป่าทั้งหมด (Forest Area):</p>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{forestArea} ไร่/หน่วย</p>
             </div>
             <div className="md:col-span-2 border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">ปริมาณการกักเก็บคาร์บอนทั้งหมด (C_all):</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{C_all.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} kgC</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">* คิดจาก (ผลรวม C_m / จำนวนชนิด) × พื้นที่ป่า</p>
             </div>
             <div className="md:col-span-2 bg-green-100 dark:bg-green-900 p-3 rounded">
                <p className="text-sm text-green-900 dark:text-green-200 font-bold">การดูดซับคาร์บอนไดออกไซด์สุทธิ (C_total = C_all * 3.66):</p>
                <p className="text-3xl font-extrabold text-green-800 dark:text-green-100">{C_total_absorbed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} kgCO₂e</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};