import { useStore } from './state/store';
import { AppNavbar } from './components/AppNavbar';
import { ProfileList } from './components/ProfileList';
import { ProfileEditor } from './components/ProfileEditor';
import { PlayScreen } from './components/PlayScreen';

const REPO_URL = 'https://github.com/gwalbran/my-chance';

function AppFooter() {
  return (
    <footer style={{
      marginTop: 48,
      padding: '16px',
      borderTop: '1px solid #394b59',
      textAlign: 'center',
      color: '#5c7080',
      fontSize: 13,
    }}>
      <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#8a9ba8', textDecoration: 'none' }}>
        View source on GitHub
      </a>
    </footer>
  );
}

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
    <div className="bp5-dark" style={{ minHeight: '100vh', background: '#1c2127', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar />
      <main style={{ flex: 1 }}>{renderView()}</main>
      <AppFooter />
    </div>
  );
}
