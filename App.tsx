import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { Login } from './components/Login';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { calculateBiomass, determineTreeSize } from './utils/calculations';
import { CalculationRecord, IndicesInput, IndicesResult } from './types';

// Configure localforage
localforage.config({
  name: 'CarbonSequestrationApp',
  storeName: 'app_data' // Should be alphanumeric, with underscores.
});

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [forestArea, setForestArea] = useState<number>(1); // Default area 1 unit
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // New state to track initialization
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Load state from localforage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          storedUser,
          storedRecords,
          storedArea,
          storedDarkMode
        ] = await Promise.all([
          localforage.getItem<string>('carbon_app_user'),
          localforage.getItem<CalculationRecord[]>('carbon_app_records'),
          localforage.getItem<string>('carbon_app_area'),
          localforage.getItem<boolean>('carbon_app_dark_mode')
        ]);

        if (storedUser) setUser(storedUser);
        if (storedRecords) setRecords(storedRecords);
        if (storedArea) setForestArea(parseFloat(storedArea));
        if (storedDarkMode) {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        }
      } catch (err) {
        console.error("Error loading data from storage:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    loadData();
  }, []);

  // Persist state - Only save if initialized to avoid overwriting data with initial empty states
  useEffect(() => {
    if (!isInitializing) {
      if (user) {
        localforage.setItem('carbon_app_user', user);
      } else {
        localforage.removeItem('carbon_app_user');
      }
    }
  }, [user, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localforage.setItem('carbon_app_records', records);
    }
  }, [records, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      localforage.setItem('carbon_app_area', forestArea.toString());
    }
  }, [forestArea, isInitializing]);

  // Dark mode toggle logic
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Save immediately
    localforage.setItem('carbon_app_dark_mode', newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (email: string) => {
    setUser(email);
  };

  const handleLogout = async () => {
    setUser(null);
    setRecords([]);
    setForestArea(1);
    
    try {
      await Promise.all([
        localforage.removeItem('carbon_app_user'),
        localforage.removeItem('carbon_app_records'),
        localforage.removeItem('carbon_app_area')
      ]);
      // We purposefully do NOT remove 'carbon_app_dark_mode' so preference persists across sessions
    } catch (err) {
      console.error("Error clearing data on logout:", err);
    }
  };

  const handleAddRecord = (data: any) => {
    const { d, height, mainType, bambuType, forestType, mangroveSpecies, indices } = data;

    const wt = calculateBiomass(d, height, mainType, bambuType, forestType, mangroveSpecies);
    const cn = wt * 0.47;
    const treeSize = determineTreeSize(d, height);

    let calculatedIndices: IndicesResult | undefined = undefined;
    if (indices) {
      const i = indices as IndicesInput;
      calculatedIndices = {
        rf: i.plots > 0 ? (i.plotTreeSpecies / i.plots) * 100 : 0,
        rdo: i.cross > 0 ? (i.crossTreeSpecie / i.cross) * 100 : 0,
        rp: i.area > 0 ? (i.plantSpecies / i.area) * 100 : 0,
      };
    }

    const newRecord: CalculationRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      d,
      height,
      mainType,
      bambuType,
      forestType,
      mangroveSpecies,
      treeSize,
      wt,
      cn,
      indices: calculatedIndices
    };

    setRecords([...records, newRecord]);
  };

  const handleClearRecords = () => {
    if (window.confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
      setRecords([]);
    }
  };

  // Show loading screen while localforage is fetching data
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">กำลังโหลดข้อมูล... (Loading Data)</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 print:bg-white transition-colors duration-200">
      {/* Header */}
      <header className="bg-green-700 dark:bg-green-900 text-white shadow-md print:hidden transition-colors duration-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Carbon Sequestration Calculator</h1>
            <p className="text-sm opacity-90">ผู้ใช้งาน: {user}</p>
          </div>
          <div className="flex items-center space-x-4">
             <button
              onClick={toggleDarkMode}
              className="p-2 rounded hover:bg-green-800 dark:hover:bg-green-800 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-green-800 dark:bg-green-800 hover:bg-green-900 dark:hover:bg-green-700 px-4 py-2 rounded text-sm transition"
            >
              ออกจากระบบ (Logout)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 print:hidden">
            <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                 พื้นที่ป่าทั้งหมด (Forest Area) - ใช้สำหรับคำนวณสรุป
               </label>
               <input 
                  type="number" 
                  value={forestArea} 
                  onChange={(e) => setForestArea(parseFloat(e.target.value) || 0)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
               />
            </div>
            <InputForm onAdd={handleAddRecord} />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold">รายงานการคำนวณการกักเก็บคาร์บอน</h1>
              <p>จัดทำโดย: {user}</p>
              <p>วันที่: {new Date().toLocaleDateString('th-TH')}</p>
            </div>
            <ResultsTable records={records} onClear={handleClearRecords} forestArea={forestArea} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;