import React, { useState } from 'react';
import Header from '@/components/Header';
import ScanForm from '@/components/ScanForm';
import ReportViewer from '@/components/ReportViewer';
import { Violation } from '@/components/ViolationCard';
import { scanWebsite } from '@/utils/accessibilityChecker';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<{
    url: string;
    violations: Violation[];
    scanDate: Date;
  } | null>(null);
  const { toast } = useToast();

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const results = await scanWebsite(url);
      setScanResults({
        url,
        violations: results.violations,
        scanDate: results.scanDate
      });
      
      if (results.violations.length === 0) {
        toast({
          title: "No issues found",
          description: "Great job! No accessibility issues were detected on this page.",
        });
      } else {
        toast({
          title: "Scan completed",
          description: `Found ${results.violations.length} accessibility ${results.violations.length === 1 ? 'issue' : 'issues'}.`,
        });
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning the website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">EU Accessibility Sentry</h1>
            <p className="text-xl text-muted-foreground">
              Ensure your website complies with WCAG 2.1 and EN 301 549 standards
            </p>
          </div>
          
          <ScanForm 
            onScan={handleScan} 
            isScanning={isScanning} 
            className="animate-slide-up"
          />
        </div>
        
        {scanResults && (
          <div className="animate-slide-up">
            <ReportViewer
              url={scanResults.url}
              violations={scanResults.violations}
              scanDate={scanResults.scanDate}
            />
          </div>
        )}
      </main>
      
      <footer className="border-t py-6 bg-white/50">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>EU Accessibility Sentry — Compliance checker for WCAG 2.1 and EN 301 549 standards</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
