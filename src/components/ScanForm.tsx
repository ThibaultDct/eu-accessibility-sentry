import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ScanFormProps {
  onScan: (url: string) => void;
  isScanning: boolean;
  className?: string;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScan, isScanning, className }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  const validateUrl = (value: string): boolean => {
    try {
      // Check if URL is valid format
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (value === '') {
      setIsValid(true);
    } else {
      setIsValid(validateUrl(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid website URL to scan.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValid) {
      toast({
        title: "Invalid URL format",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure URL has protocol
    let normalizedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`;
      setUrl(normalizedUrl);
    }
    
    toast({
      title: "Scanning started",
      description: `Scanning ${normalizedUrl} for accessibility issues. This may take a moment...`,
    });
    
    onScan(normalizedUrl);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">Scan Your Website</h2>
            <p className="text-muted-foreground text-sm">Enter a URL to check for accessibility compliance with EU standards</p>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={handleChange}
                className={cn(
                  "h-12 text-base px-4",
                  !isValid && url !== "" && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isScanning}
                aria-label="Website URL"
              />
              {!isValid && url !== "" && (
                <p className="text-destructive text-xs mt-1">Please enter a valid URL (e.g., https://example.com)</p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isScanning || !url.trim() || !isValid}
              className="h-12 px-6 scan-button"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scan Website
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScanForm;
