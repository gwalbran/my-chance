import { useStore } from './state/store';
import { AppNavbar } from './components/AppNavbar';
import { ProfileList } from './components/ProfileList';
import { ProfileEditor } from './components/ProfileEditor';
import { PlayScreen } from './components/PlayScreen';

export function App() {
  const { state } = useStore();

  const renderView = () => {
    switch (state.view.name) {
      case 'list':    return <ProfileList />;
      case 'editor':  return <ProfileEditor />;
      case 'play':    return <PlayScreen />;
    }
  };

  return (
    <div className="bp5-dark" style={{ minHeight: '100vh', background: '#1c2127' }}>
      <AppNavbar />
      <main>{renderView()}</main>
    </div>
  );
}
