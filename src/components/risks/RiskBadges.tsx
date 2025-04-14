
import { Badge } from '@/components/ui/badge';
import { Risk } from '@/types/risk';

interface RiskBadgesProps {
  getRiskScore: (risk: Risk) => number;
}

export const RiskBadges = ({ getRiskScore }: RiskBadgesProps) => {
  const getRiskLevelBadge = (impact: string, probability: string) => {
    const score = getRiskScore({ impact, probability } as Risk);
    
    if (score >= 6) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
    } else if (score >= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
    }
  };
  
  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{impact}</Badge>;
    }
  };
  
  const getProbabilityBadge = (probability: string) => {
    switch(probability) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{probability}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'identified':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Identified</Badge>;
      case 'mitigated':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Mitigated</Badge>;
      case 'occurred':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Occurred</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  return {
    getRiskLevelBadge,
    getImpactBadge,
    getProbabilityBadge,
    getStatusBadge
  };
};
