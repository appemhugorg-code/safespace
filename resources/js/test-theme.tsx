import { ThemeProvider, useTheme } from './contexts/theme-context';

function ThemeTest() {
  const { theme, effectiveMode, syncStatus, toggleMode } = useTheme();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enhanced Theme System Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Current Mode:</strong> {theme.mode} (effective: {effectiveMode})
        </div>
        
        <div>
          <strong>Sync Status:</strong>
          <ul className="ml-4">
            <li>Online: {syncStatus.isOnline ? 'Yes' : 'No'}</li>
            <li>Loading: {syncStatus.isLoading ? 'Yes' : 'No'}</li>
            <li>Sync in Progress: {syncStatus.syncInProgress ? 'Yes' : 'No'}</li>
            <li>Queue Length: {syncStatus.queueLength}</li>
          </ul>
        </div>
        
        <div>
          <strong>Therapeutic Colors:</strong>
          <div className="flex gap-2 mt-2">
            <div 
              className="w-8 h-8 rounded" 
              style={{ backgroundColor: theme.colors.therapeutic.trust[500] }}
              title="Trust"
            />
            <div 
              className="w-8 h-8 rounded" 
              style={{ backgroundColor: theme.colors.therapeutic.growth[500] }}
              title="Growth"
            />
            <div 
              className="w-8 h-8 rounded" 
              style={{ backgroundColor: theme.colors.therapeutic.comfort[500] }}
              title="Comfort"
            />
            <div 
              className="w-8 h-8 rounded" 
              style={{ backgroundColor: theme.colors.therapeutic.warmth[500] }}
              title="Warmth"
            />
          </div>
        </div>
        
        <button 
          onClick={toggleMode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme Mode
        </button>
      </div>
    </div>
  );
}

export function TestThemeApp() {
  return (
    <ThemeProvider>
      <ThemeTest />
    </ThemeProvider>
  );
}