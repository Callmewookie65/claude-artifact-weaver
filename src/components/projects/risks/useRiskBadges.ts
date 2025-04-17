
import { Badge } from '@/components/ui/badge';
import { RiskItem } from './types';

export const useRiskBadges = (getRiskScore: (risk: RiskItem) => number) => {
  // Get risk level badge
  const getRiskLevelBadge = (impact: string, probability: string) => {
    const score = getRiskScore({ impact, probability } as RiskItem);
    
    if (score >= 6) {
      return <Badge variant="destructive">Wysoki</Badge>;
    } else if (score >= 3) {
      return <Badge variant="secondary" className="bg-yellow-500">Średni</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500 text-white">Niski</Badge>;
    }
  };
  
  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Niski</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Średni</Badge>;
      case 'high':
        return <Badge variant="destructive">Wysoki</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };
  
  // Get probability badge
  const getProbabilityBadge = (probability: string) => {
    switch(probability) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Niskie</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Średnie</Badge>;
      case 'high':
        return <Badge variant="destructive">Wysokie</Badge>;
      default:
        return <Badge variant="outline">{probability}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'identified':
        return <Badge className="bg-blue-500 text-white">Zidentyfikowane</Badge>;
      case 'mitigated':
        return <Badge variant="outline" className="bg-green-500 text-white">Zminimalizowane</Badge>;
      case 'occurred':
        return <Badge variant="destructive">Wystąpiło</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return {
    getRiskLevelBadge,
    getImpactBadge,
    getProbabilityBadge,
    getStatusBadge
  };
};
