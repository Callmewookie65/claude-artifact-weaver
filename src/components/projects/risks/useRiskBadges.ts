
import { Badge } from '@/components/ui/badge';
import { RiskItem } from './types';
import React from 'react';

export const useRiskBadges = (getRiskScore: (risk: RiskItem) => number) => {
  // Get risk level badge
  const getRiskLevelBadge = (impact: string, probability: string) => {
    const score = getRiskScore({ impact, probability } as RiskItem);
    
    if (score >= 6) {
      return React.createElement(Badge, { variant: "destructive" }, "Wysoki");
    } else if (score >= 3) {
      return React.createElement(Badge, { variant: "secondary", className: "bg-yellow-500" }, "Średni");
    } else {
      return React.createElement(Badge, { variant: "outline", className: "bg-green-500 text-white" }, "Niski");
    }
  };
  
  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'low':
        return React.createElement(Badge, { variant: "outline", className: "bg-green-500 text-white" }, "Niski");
      case 'medium':
        return React.createElement(Badge, { variant: "secondary", className: "bg-yellow-500" }, "Średni");
      case 'high':
        return React.createElement(Badge, { variant: "destructive" }, "Wysoki");
      default:
        return React.createElement(Badge, { variant: "outline" }, impact);
    }
  };
  
  // Get probability badge
  const getProbabilityBadge = (probability: string) => {
    switch(probability) {
      case 'low':
        return React.createElement(Badge, { variant: "outline", className: "bg-green-500 text-white" }, "Niskie");
      case 'medium':
        return React.createElement(Badge, { variant: "secondary", className: "bg-yellow-500" }, "Średnie");
      case 'high':
        return React.createElement(Badge, { variant: "destructive" }, "Wysokie");
      default:
        return React.createElement(Badge, { variant: "outline" }, probability);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'identified':
        return React.createElement(Badge, { className: "bg-blue-500 text-white" }, "Zidentyfikowane");
      case 'mitigated':
        return React.createElement(Badge, { variant: "outline", className: "bg-green-500 text-white" }, "Zminimalizowane");
      case 'occurred':
        return React.createElement(Badge, { variant: "destructive" }, "Wystąpiło");
      default:
        return React.createElement(Badge, { variant: "outline" }, status);
    }
  };

  return {
    getRiskLevelBadge,
    getImpactBadge,
    getProbabilityBadge,
    getStatusBadge
  };
};
