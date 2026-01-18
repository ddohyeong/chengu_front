import { useState, useEffect } from 'react';
import { Plus, Home, Package } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import * as Storage from '@/shared/services/storageService';
import { NavTab } from '@/shared/components/NavTab';
import { DashboardView } from '../components/views/DashboardView';
import { LocationsView } from '../components/views/LocationsView';
import { SalesView } from '../components/views/SalesView';
import { ExpiringView } from '../components/views/ExpiringView';
import { ItemModal } from '../components/modals/ItemModal';
import { LocationModal } from '../components/modals/LocationModal';
import { SalesModal } from '../components/modals/SalesModal';
import { ReceiptModal } from '../components/modals/ReceiptModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'locations' | 'sales' | 'expiring'>('dashboard');
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>('');
  
  // Modals
  const [modalType, setModalType] = useState<'item' | 'location' | 'sales' | 'receipt' | null>(null);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(undefined);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadedLocations = Storage.getLocations();
    setLocations(loadedLocations);
    setItems(Storage.getItems());
    
    // Initialize active location if not set
    if (loadedLocations.length > 0 && !activeLocId) {
      setActiveLocId(loadedLocations[0].id);
    }
  }, []); // Run once on mount

  const refreshData = () => {
    const locs = Storage.getLocations();
    setLocations(locs);
    setItems(Storage.getItems());
    if (locs.length > 0 && !activeLocId) {
      setActiveLocId(locs[0].id);
    }
  };

  const handleSaveItem = (item: Item) => {
    Storage.saveItem(item);
    refreshData();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('정말로 이 물건을 삭제할까요?')) {
      Storage.deleteItem(id);
      refreshData();
    }
  };
  
  const handleSaveLocation = (loc: Location) => {
    Storage.saveLocation(loc);
    refreshData();
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm('장소를 삭제하면 안의 물건들도 함께 삭제됩니다. 계속할까요?')) {
       Storage.deleteLocation(id);
       refreshData();
       // Reset active location if the deleted one was active
       const remaining = Storage.getLocations();
       if (remaining.length > 0) setActiveLocId(remaining[0].id);
       else setActiveLocId('');
    }
  };

  const handleBulkAddItems = (newItems: Item[]) => {
    newItems.forEach(item => Storage.saveItem(item));
    refreshData();
  };

  const handleNavigateToLocation = (locId: string) => {
    setActiveLocId(locId);
    setCurrentView('locations');
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* View Content */}
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'dashboard' && (
          <DashboardView 
            items={items} 
            locations={locations} 
            onScanReceipt={() => setModalType('receipt')}
            onNavigateToLocation={handleNavigateToLocation}
            onNavigateToSales={() => setCurrentView('sales')}
            onNavigateToExpiring={() => setCurrentView('expiring')}
            onAddItem={() => {
              setEditingItem(undefined);
              setPreSelectedLocationId(activeLocId || undefined);
              setModalType('item');
            }}
          />
        )}
        {currentView === 'locations' && (
          <LocationsView 
            locations={locations} 
            items={items} 
            activeLocId={activeLocId}
            onSelectLocation={setActiveLocId}
            onAddItem={(locId) => {
              setEditingItem(undefined);
              setPreSelectedLocationId(locId);
              setModalType('item');
            }}
            onEditItem={(item) => {
              setEditingItem(item);
              setModalType('item');
            }}
            onDeleteItem={handleDeleteItem}
            onAddLocation={() => {
              setEditingLocation(undefined);
              setModalType('location');
            }}
            onEditLocation={(loc) => {
               setEditingLocation(loc);
               setModalType('location');
            }}
            onDeleteLocation={handleDeleteLocation}
            onSellItem={(item) => {
              setEditingItem(item);
              setModalType('sales');
            }}
          />
        )}
        {currentView === 'sales' && (
          <SalesView 
            items={items}
            onBack={() => setCurrentView('dashboard')}
            onSellItem={(item) => {
              setEditingItem(item);
              setModalType('sales');
            }}
          />
        )}
        {currentView === 'expiring' && (
          <ExpiringView 
            items={items}
            locations={locations}
            onBack={() => setCurrentView('dashboard')}
            onEditItem={(item) => {
              setEditingItem(item);
              setModalType('item');
            }}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-t border-slate-100 pb-safe px-6 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.03)] z-30">
        <div className="flex justify-around items-center h-[70px]">
          <NavTab 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={Home} 
            label="홈" 
          />
          <div className="-mt-8">
             <button 
                onClick={() => {
                   setEditingItem(undefined);
                   setPreSelectedLocationId(activeLocId || undefined);
                   setModalType('item');
                }}
                className="bg-slate-900 text-white p-4 rounded-full shadow-lg shadow-slate-300 hover:scale-105 transition-transform"
             >
                <Plus size={28} />
             </button>
          </div>
          <NavTab 
            active={currentView === 'locations'} 
            onClick={() => setCurrentView('locations')} 
            icon={Package} 
            label="보관함" 
          />
        </div>
      </nav>

      {/* Modals */}
      <ItemModal 
        isOpen={modalType === 'item'} 
        onClose={() => setModalType(null)} 
        onSave={handleSaveItem}
        locations={locations}
        initialData={editingItem}
        preSelectedLocationId={preSelectedLocationId}
      />

      <LocationModal
         isOpen={modalType === 'location'}
         onClose={() => setModalType(null)}
         onSave={handleSaveLocation}
         initialData={editingLocation}
      />
      
      {editingItem && (
        <SalesModal 
          isOpen={modalType === 'sales'}
          onClose={() => setModalType(null)}
          item={editingItem}
        />
      )}

      <ReceiptModal
         isOpen={modalType === 'receipt'}
         onClose={() => setModalType(null)}
         onSaveItems={handleBulkAddItems}
         locations={locations}
      />
    </div>
  );
}
