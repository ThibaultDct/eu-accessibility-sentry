import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import ViolationCard, { Violation } from './ViolationCard';
import { generatePDFReport, generateHTMLReport } from '@/utils/reportGenerator';

interface ReportViewerProps {
  url: string;
  violations: Violation[];
  scanDate: Date;
  className?: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ url, violations, scanDate, className }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const criticalCount = violations.filter(v => v.impact === 'critical').length;
  const seriousCount = violations.filter(v => v.impact === 'serious').length;
  const moderateCount = violations.filter(v => v.impact === 'moderate').length;
  
  const filteredViolations = violations.filter(violation => {
    if (activeTab === 'all') return true;
    return violation.impact === activeTab;
  });

  const handleDownloadPDF = () => {
    generatePDFReport(url, violations, scanDate);
  };

  const handleDownloadHTML = () => {
    generateHTMLReport(url, violations, scanDate);
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-secondary/30 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Accessibility Report</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Scanned on {scanDate.toLocaleDateString()} at {scanDate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="text-xs">
              <FileDown className="mr-1 h-3 w-3" />
              PDF Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="text-xs">
              <FileDown className="mr-1 h-3 w-3" />
              HTML Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">URL Scanned</h3>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline text-sm mt-1 break-all"
            >
              {url}
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="bg-critical/10 border-critical/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </CardContent>
            </Card>
            <Card className="bg-serious/10 border-serious/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{seriousCount}</p>
                <p className="text-xs text-muted-foreground">Serious</p>
              </CardContent>
            </Card>
            <Card className="bg-moderate/10 border-moderate/20">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{moderateCount}</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All Issues ({violations.length})
              </TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({criticalCount})
              </TabsTrigger>
              <TabsTrigger value="serious">
                Serious ({seriousCount})
              </TabsTrigger>
              <TabsTrigger value="moderate">
                Moderate ({moderateCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4 space-y-4">
              {filteredViolations.length > 0 ? (
                filteredViolations.map((violation) => (
                  <ViolationCard key={violation.id} violation={violation} className="animate-fade-in" />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} issues found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
