import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

const connectors = {
  'ERP and Accounting Systems': [
    'Campfire', 'Dynamics 365 Business Central', 'Light', 'Netsuite', 'Odoo',
    'Quickbooks', 'Rillet', 'Sage Intacct', 'SAP S4/Hana', 'Xero'
  ],
  'Spreadsheets': [
    'Google Sheets', 'Microsoft Excel'
  ],
  'CRM': [
    'Hubspot', 'Salesforce'
  ],
  'Billing & Invoicing': [
    'Chargebee', 'Maxio', 'Stripe'
  ],
  'BI Solutions': [
    'Amazon Quicksight', 'Domo', 'Looker', 'Tableau', 'Trevor'
  ],
  'HRIS': [
    'ADP Run', 'ADP Workforce Now', 'AlphaStaff', 'BambooHR', 'Deel',
    'Factorial HR', 'Gusto', 'HiBob', 'Horizon Payroll', 'Humaans',
    'Insperity', 'Justworks', 'Kallidus (Sapling)', 'MV Saude', 'Namely',
    'Oyster HR', 'Paychex Flex', 'Paycom', 'Paycor', 'Paylocity',
    'Personio', 'Quickbooks Online Payroll', 'Rippling', 'Sage HR',
    'Sequoia One', 'Square Payroll', 'Superset', 'TriNet', 'UKG Pro',
    'UKG Ready', 'UltiPro', 'Visma', 'Wave', 'Workday', 'Zenefits'
  ]
};

export function ConnectorList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const filteredConnectors = Object.entries(connectors).reduce((acc, [category, items]) => {
    const filtered = items.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search connectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(filteredConnectors).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3">{category}</h3>
              <div className="space-y-1">
                {items.map((connector) => (
                  <button
                    key={connector}
                    onClick={() => setSelectedConnector(connector)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedConnector === connector
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    {connector}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button 
          className="w-full" 
          disabled={!selectedConnector}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
