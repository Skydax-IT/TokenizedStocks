'use client';

import { useState } from 'react';
import { TokenRow } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  PlusIcon, 
  TrashIcon, 
  BellIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export default function PriceAlerts({ tokens }: { tokens: TokenRow[] }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      targetPrice: 250.00,
      condition: 'below',
      isActive: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      targetPrice: 150.00,
      condition: 'above',
      isActive: true,
      createdAt: new Date('2024-01-10'),
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  });

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return;

    const token = tokens.find(t => t.symbol === newAlert.symbol);
    if (!token) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      name: token.name,
      targetPrice: parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      isActive: true,
      createdAt: new Date(),
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ symbol: '', targetPrice: '', condition: 'above' });
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertStatus = (alert: PriceAlert, currentPrice: number) => {
    if (!alert.isActive) return 'inactive';
    
    if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
      return 'triggered';
    }
    
    if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
      return 'triggered';
    }
    
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
      case 'triggered':
        return <Badge variant="destructive">Triggered</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConditionIcon = (condition: 'above' | 'below') => {
    return condition === 'above' ? 
      <TrendingUpIcon className="h-4 w-4 text-green-600" /> : 
      <TrendingDownIcon className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Price Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Set price alerts to stay informed about market movements
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {alerts.filter(a => a.isActive).length} Active Alerts
        </Badge>
      </div>

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Create New Alert
          </CardTitle>
          <CardDescription>
            Set a price alert for any token in your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert({ ...newAlert, symbol: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newAlert.condition} onValueChange={(value: 'above' | 'below') => setNewAlert({ ...newAlert, condition: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Target Price"
              value={newAlert.targetPrice}
              onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
              step="0.01"
              min="0"
            />

            <Button onClick={addAlert} disabled={!newAlert.symbol || !newAlert.targetPrice}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Your Alerts
          </CardTitle>
          <CardDescription>
            Manage your active and inactive price alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Alerts Set</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first price alert to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const token = tokens.find(t => t.symbol === alert.symbol);
                const currentPrice = token?.priceUsd || 0;
                const status = getAlertStatus(alert, currentPrice);
                
                return (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getConditionIcon(alert.condition)}
                        <div>
                          <div className="font-medium">{alert.symbol}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{alert.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Target Price</div>
                        <div className="font-medium">${alert.targetPrice.toFixed(2)}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                        <div className="font-medium">${currentPrice.toFixed(2)}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                        {getStatusBadge(status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAlert(alert.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5" />
            Alert History
          </CardTitle>
          <CardDescription>
            Track when your alerts were triggered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">History Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Alert history and notification logs will be available in the next update
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
