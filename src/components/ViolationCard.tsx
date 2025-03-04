import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Bell, MapPin } from 'lucide-react';

export interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate';
  description: string;
  element: string;
  help: string;
  helpUrl: string;
  remediation: string;
  location?: string; // Adding location to track what part of the website is affected
}

interface ViolationCardProps {
  violation: Violation;
  className?: string;
}

const ImpactIcon = {
  critical: AlertCircle,
  serious: Bell,  // Replacing Alert with Bell since Alert doesn't exist
  moderate: AlertTriangle
};

const ImpactColor = {
  critical: "bg-critical text-critical-foreground",
  serious: "bg-serious text-serious-foreground",
  moderate: "bg-moderate text-moderate-foreground"
};

const ImpactLabel = {
  critical: "Critical",
  serious: "Serious",
  moderate: "Moderate"
};

const ViolationCard: React.FC<ViolationCardProps> = ({ violation, className }) => {
  const Icon = ImpactIcon[violation.impact];
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Badge className={cn("font-medium", ImpactColor[violation.impact])}>
              <Icon className="h-3 w-3 mr-1" />
              {ImpactLabel[violation.impact]}
            </Badge>
            <h3 className="text-lg font-medium mt-2">{violation.description}</h3>
          </div>
        </div>
        
        {violation.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
            <span>Location: {violation.location}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="bg-muted p-3 rounded-md overflow-x-auto">
            <pre className="text-xs whitespace-pre-wrap break-all">{violation.element}</pre>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Recommended Fix:</h4>
            <p className="text-sm text-muted-foreground">{violation.remediation}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-secondary/50 px-6 py-3">
        <a 
          href={violation.helpUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          Learn more about this issue
        </a>
      </CardFooter>
    </Card>
  );
};

export default ViolationCard;
