import { useState, useEffect } from 'react';
import { Plus, Home, Package } from 'lucide-react';
import { Item, Location } from '@/shared/types';
import { authStorage } from '@/shared/services/authStorage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NavTab } from '@/shared/components/NavTab';
import { DashboardView } from '../components/views/DashboardView';
import { LocationsView } from '../components/views/LocationsView';
import { SalesView } from '../components/views/SalesView';
import { ExpiringView } from '../components/views/ExpiringView';
import { ItemModal } from '../components/modals/ItemModal';
import { LocationModal } from '../components/modals/LocationModal';
import { SalesModal } from '../components/modals/SalesModal';
import { ReceiptModal } from '../components/modals/ReceiptModal';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { MyPage } from '@/features/auth/pages/MyPage';
import { SignupModal } from '@/features/auth/components/SignupModal';
import { useInventory } from '../hooks/useInventory';

type ViewType = 'dashboard' | 'locations' | 'sales' | 'expiring' | 'mypage';
type ModalType = 'item' | 'location' | 'sales' | 'receipt' | 'signup' | null;

export default function App() {
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [userNickname, setUserNickname] = useState('');

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(undefined);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState<string | undefined>(undefined);

  const {
    items,
    locations,
    activeLocId,
    setActiveLocId,
    saveItem,
    deleteItem,
    saveLocation,
    deleteLocation,
    bulkAddItems,
  } = useInventory({ isLoggedIn, userNickname });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    const savedNickname = authStorage.getNickname();
    if (savedNickname) setUserNickname(savedNickname);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const savedNickname = authStorage.getNickname();
    if (savedNickname) setUserNickname(savedNickname);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setUserNickname('');
  };

  const openItemModal = (locId?: string, item?: Item) => {
    setEditingItem(item);
    setPreSelectedLocationId(locId);
    setModalType('item');
  };

  const openLocationModal = (loc?: Location) => {
    setEditingLocation(loc);
    setModalType('location');
  };

  const handleNavigateToLocation = (locId: string) => {
    setActiveLocId(locId);
    setCurrentView('locations');
  };

  if (!isLoggedIn) {
    return (
      <div className="h-full bg-slate-50 flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onShowSignup={() => setModalType('signup')}
        />
        <SignupModal
          isOpen={modalType === 'signup'}
          onClose={() => setModalType(null)}
          onSignupSuccess={() => setModalType(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        {currentView === 'dashboard' && (
          <DashboardView
            items={items}
            locations={locations}
            onScanReceipt={() => setModalType('receipt')}
            onNavigateToLocation={handleNavigateToLocation}
            onNavigateToSales={() => setCurrentView('sales')}
            onNavigateToExpiring={() => setCurrentView('expiring')}
            onNavigateToMyPage={() => setCurrentView('mypage')}
            onAddItem={() => openItemModal(activeLocId || undefined)}
          />
        )}
        {currentView === 'locations' && (
          <LocationsView
            locations={locations}
            items={items}
            activeLocId={activeLocId}
            onSelectLocation={setActiveLocId}
            onAddItem={(locId) => openItemModal(locId)}
            onEditItem={(item) => openItemModal(undefined, item)}
            onDeleteItem={deleteItem}
            onAddLocation={() => openLocationModal()}
            onEditLocation={(loc) => openLocationModal(loc)}
            onDeleteLocation={deleteLocation}
            onSellItem={(item) => {
              setEditingItem(item);
              setModalType('sales');
            }}
            onBack={() => setCurrentView('dashboard')}
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
            onEditItem={(item) => openItemModal(undefined, item)}
            onDeleteItem={deleteItem}
          />
        )}
        {currentView === 'mypage' && (
          <MyPage
            onBack={() => setCurrentView('dashboard')}
            onLogout={handleLogout}
          />
        )}
      </div>

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
              onClick={() => openItemModal(activeLocId || undefined)}
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

      <ItemModal
        isOpen={modalType === 'item'}
        onClose={() => setModalType(null)}
        onSave={saveItem}
        locations={locations}
        initialData={editingItem}
        preSelectedLocationId={preSelectedLocationId}
      />
      <LocationModal
        isOpen={modalType === 'location'}
        onClose={() => setModalType(null)}
        onSave={saveLocation}
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
        onSaveItems={bulkAddItems}
        locations={locations}
      />
      <SignupModal
        isOpen={modalType === 'signup'}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
