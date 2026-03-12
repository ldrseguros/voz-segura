import { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ReportFlow } from './components/ReportFlow';
import { TrackReport } from './components/TrackReport';
import { useSessionStorage } from './hooks/useSessionStorage';
import { Report } from './types';
import { AnimatePresence } from 'motion/react';

type View = 'home' | 'report' | 'track';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [reports, setReports] = useSessionStorage<Report[]>('voz_segura_reports', []);

  const handleCompleteReport = (report: Report) => {
    setReports([...reports, report]);
  };

  const handleUpdateReport = (updatedReport: Report) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <Home 
            key="home"
            onStartReport={() => setView('report')} 
            onTrackReport={() => setView('track')} 
          />
        )}
        
        {view === 'report' && (
          <ReportFlow 
            key="report"
            onComplete={handleCompleteReport} 
            onCancel={() => setView('home')} 
          />
        )}
        
        {view === 'track' && (
          <TrackReport 
            key="track"
            onBack={() => setView('home')}
            reports={reports}
            updateReport={handleUpdateReport}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
