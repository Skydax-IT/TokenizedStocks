'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import LogoMark from '@/components/Brand/LogoMark'
import Wordmark from '@/components/Brand/Wordmark'
import TrendUpMini from '@/components/icons/TrendUpMini'
import TrendDownMini from '@/components/icons/TrendDownMini'
import CandleMini from '@/components/icons/CandleMini'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription, AlertIcon } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { getRechartsTheme } from '@/lib/chartTheme'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
]

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState('colors')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('compact') // Default to compact
  const [progressValue, setProgressValue] = useState(65)
  const [sliderValue, setSliderValue] = useState([50])
  const [switchChecked, setSwitchChecked] = useState(false)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Wordmark className="text-4xl" />
        </motion.div>
        <h1 className="text-4xl font-display font-bold text-fg">
          Sage Pine Design System
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Complete design system for the Tokenized Stocks Dashboard. 
          Built with the elegant Sage Pine palette, accessibility, dark-mode-first design, and premium fintech aesthetics.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {['colors', 'typography', 'components', 'icons', 'charts', 'motion'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="min-h-[600px]">
        {/* Colors Section */}
        {activeTab === 'colors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">Sage Pine Color Palette</h2>
              
              {/* Accent Scale */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Accent Scale (Sage Pine)</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`w-16 h-16 rounded-lg border border-border mb-2`}
                        style={{ backgroundColor: `var(--accent-${shade})` }}
                      ></div>
                      <div className="text-xs text-muted">{shade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Semantic Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Accent</div>
                    <div className="text-sm text-muted">--accent</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Success</div>
                    <div className="text-sm text-muted">--success</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-danger rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Danger</div>
                    <div className="text-sm text-muted">--danger</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warning rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Warning</div>
                    <div className="text-sm text-muted">--warning</div>
                  </div>
                </div>
              </div>

              {/* Neutral Colors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-fg">Neutral Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-card rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Card</div>
                    <div className="text-sm text-muted">--card</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-border rounded-lg border border-border mb-2 mx-auto"></div>
                    <div className="font-medium text-fg">Border</div>
                    <div className="text-sm text-muted">--border</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typography Section */}
        {activeTab === 'typography' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">Typography Scale</h2>
              
              {/* Display Font */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Display Font (Space Grotesk)</h3>
                <div className="space-y-2">
                  <div className="text-4xl font-display font-bold text-fg">Display 4xl - Bold</div>
                  <div className="text-3xl font-display font-semibold text-fg">Display 3xl - Semibold</div>
                  <div className="text-2xl font-display font-medium text-fg">Display 2xl - Medium</div>
                  <div className="text-xl font-display font-normal text-fg">Display xl - Normal</div>
                </div>
              </div>

              {/* Body Font */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Body Font (Inter)</h3>
                <div className="space-y-2">
                  <div className="text-lg font-sans font-medium text-fg">Body Large - Medium</div>
                  <div className="text-base font-sans font-normal text-fg">Body Base - Normal</div>
                  <div className="text-sm font-sans font-normal text-fg">Body Small - Normal</div>
                  <div className="text-xs font-sans font-medium text-fg">Body XS - Medium</div>
                </div>
              </div>

              {/* Numeric Examples */}
              <div className="space-y-4">
                <h3 className="font-semibold text-fg">Numeric Typography</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-fg mb-2">Without Tabular Nums</h4>
                    <div className="space-y-1 text-2xl font-mono">
                      <div>1,234.56</div>
                      <div>9,876.54</div>
                      <div>123.45</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-fg mb-2">With Tabular Nums (.text-num)</h4>
                    <div className="space-y-1 text-2xl font-mono">
                      <div className="text-num">1,234.56</div>
                      <div className="text-num">9,876.54</div>
                      <div className="text-num">123.45</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Components Section */}
        {activeTab === 'components' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">UI Components</h2>
              
              {/* Buttons */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Buttons (Sage Pine Styling)</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Primary (Default)</Button>
                    <Button variant="outline">Secondary (Outline)</Button>
                    <Button variant="secondary">Subtle</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="premium">Premium</Button>
                    <Button variant="gradient">Gradient</Button>
                    <Button variant="subtle">Subtle</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                    <Button size="icon"><DollarSign className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Badges & Chips</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Premium</Badge>
                    <Badge variant="secondary">Neutral</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="success">+2.5%</Badge>
                    <Badge variant="destructive">-1.2%</Badge>
                    <Badge variant="warning">Pending</Badge>
                    <Badge variant="premium">VIP</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="info">Info</Badge>
                    <Badge variant="gradient">Gradient</Badge>
                    <Badge variant="status">Active</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Alert Components</h3>
                <div className="space-y-4">
                  <Alert>
                    <AlertIcon variant="info" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is an informational alert with the new Sage Pine design system.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="success">
                    <AlertIcon variant="success" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Your transaction has been completed successfully.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="warning">
                    <AlertIcon variant="warning" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Please review your settings before proceeding.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="destructive">
                    <AlertIcon variant="destructive" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      An error occurred while processing your request.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              {/* Form Components */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Form Components</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress Bar</Label>
                      <Progress value={progressValue} className="w-full" />
                      <div className="text-sm text-muted">{progressValue}% complete</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slider">Slider Control</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-sm text-muted">Value: {sliderValue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Switch
                      id="airplane-mode"
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                    <Label htmlFor="airplane-mode">Enable notifications</Label>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h4 className="font-semibold text-fg mb-2">Card Title</h4>
                    <p className="text-muted">This is a sample card component with the new Sage Pine design system.</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accentFg" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fg">Interactive Card</h4>
                        <p className="text-sm text-muted">With icon and hover states</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-fg">Table Component (Compact Default)</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted">Density:</span>
                    <button
                      onClick={() => setDensity('comfortable')}
                      className={`px-2 py-1 text-xs rounded ${
                        density === 'comfortable' 
                          ? 'bg-accent text-accentFg' 
                          : 'bg-muted/20 text-muted hover:text-fg'
                      }`}
                    >
                      Comfortable
                    </button>
                    <button
                      onClick={() => setDensity('compact')}
                      className={`px-2 py-1 text-xs rounded ${
                        density === 'compact' 
                          ? 'bg-accent text-accentFg' 
                          : 'bg-muted/20 text-muted hover:text-fg'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className={`text-left font-medium text-fg ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          Symbol
                        </th>
                        <th className={`text-left font-medium text-fg ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          Price
                        </th>
                        <th className={`text-left font-medium text-fg ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-t border-border hover:bg-accent/5 transition-colors ${
                        density === 'comfortable' ? 'py-4' : 'py-2'
                      }`}>
                        <td className={`font-medium text-fg ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          AAPL
                        </td>
                        <td className={`text-num ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          $150.25
                        </td>
                        <td className={`text-success ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          +2.5%
                        </td>
                      </tr>
                      <tr className={`border-t border-border hover:bg-accent/5 transition-colors ${
                        density === 'comfortable' ? 'py-4' : 'py-2'
                      }`}>
                        <td className={`font-medium text-fg ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          TSLA
                        </td>
                        <td className={`text-num ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          $245.80
                        </td>
                        <td className={`text-danger ${
                          density === 'comfortable' ? 'px-6 py-4' : 'px-4 py-2'
                        }`}>
                          -1.2%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Icons Section */}
        {activeTab === 'icons' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">Icon System</h2>
              
              {/* Brand Icons */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Brand Icons</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <LogoMark size={48} className="text-fg" />
                    </div>
                    <div className="text-sm text-muted">LogoMark</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <Wordmark />
                    </div>
                    <div className="text-sm text-muted">Wordmark</div>
                  </div>
                </div>
              </div>

              {/* Custom Icons */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-fg">Custom Icons</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <TrendUpMini size={32} className="text-success" />
                    </div>
                    <div className="text-sm text-muted">TrendUpMini</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <TrendDownMini size={32} className="text-danger" />
                    </div>
                    <div className="text-sm text-muted">TrendDownMini</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <CandleMini size={32} className="text-fg" />
                    </div>
                    <div className="text-sm text-muted">CandleMini</div>
                  </div>
                </div>
              </div>

              {/* Lucide Icons */}
              <div className="space-y-4">
                <h3 className="font-semibold text-fg">Lucide Icons</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[
                    { icon: TrendingUp, name: 'TrendingUp', color: 'text-success' },
                    { icon: TrendingDown, name: 'TrendingDown', color: 'text-danger' },
                    { icon: BarChart3, name: 'BarChart3', color: 'text-accent' },
                    { icon: DollarSign, name: 'DollarSign', color: 'text-accent' },
                    { icon: ArrowUpRight, name: 'ArrowUpRight', color: 'text-success' },
                    { icon: ArrowDownRight, name: 'ArrowDownRight', color: 'text-danger' },
                  ].map(({ icon: Icon, name, color }) => (
                    <div key={name} className="text-center space-y-2">
                      <div className="flex justify-center">
                        <Icon size={24} className={color} />
                      </div>
                      <div className="text-xs text-muted">{name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        {activeTab === 'charts' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">Chart System (Sage Pine)</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-fg mb-4">Theme-Aware Charts</h3>
                  <p className="text-muted mb-4">
                    Charts automatically adapt to the current theme using CSS variables. 
                    Colors are read at runtime for immediate theme switching with the new Sage Pine palette.
                  </p>
                  
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h4 className="font-medium text-fg mb-4">Sample Line Chart</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sampleData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="var(--muted)"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="var(--muted)"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'var(--card)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              color: 'var(--fg)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="var(--accent-600)" 
                            strokeWidth={2}
                            dot={{ fill: 'var(--accent-600)', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h4 className="font-medium text-fg mb-4">Chart Colors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent-600)' }}></div>
                        <span className="text-sm text-fg">Primary Line (accent-600)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-success rounded"></div>
                        <span className="text-sm text-fg">Success (Up)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-danger rounded"></div>
                        <span className="text-sm text-fg">Danger (Down)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-border rounded"></div>
                        <span className="text-sm text-fg">Grid Lines</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h4 className="font-medium text-fg mb-4">Theme Variables</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">--accent-600:</span>
                        <span className="text-fg font-mono">#2A7F6F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">--success:</span>
                        <span className="text-fg font-mono">#2E7D6E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">--danger:</span>
                        <span className="text-fg font-mono">#C64745</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">--border:</span>
                        <span className="text-fg font-mono">rgba(255,255,255,0.08)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Motion Section */}
        {activeTab === 'motion' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display font-semibold text-fg mb-6">Motion & Interactions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-fg mb-4">Page Transitions</h3>
                  <p className="text-muted mb-4">
                    Smooth fade + slide transitions (12px, 140ms, ease-out) for page navigation.
                  </p>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className="text-center py-8"
                    >
                      <div className="text-2xl font-display font-semibold text-fg mb-2">
                        Fade + Slide Animation
                      </div>
                      <p className="text-muted">This content animates in with the page transition</p>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-fg mb-4">Value Change Animations</h3>
                  <p className="text-muted mb-4">
                    Numeric values flash green/red for 300ms when they change, then settle.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-medium text-fg mb-4">Price Changes</h4>
                      <div className="space-y-3">
                        <motion.div
                          key="price1"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl font-mono text-num text-success"
                        >
                          $150.25
                        </motion.div>
                        <motion.div
                          key="price2"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                          className="text-2xl font-mono text-num text-danger"
                        >
                          $148.80
                        </motion.div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                      <h4 className="font-medium text-fg mb-4">Percentage Changes</h4>
                      <div className="space-y-3">
                        <motion.div
                          key="change1"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3, delay: 1 }}
                          className="text-xl font-mono text-num text-success"
                        >
                          +2.5%
                        </motion.div>
                        <motion.div
                          key="change2"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 0.3, delay: 1.5 }}
                          className="text-xl font-mono text-num text-danger"
                        >
                          -1.2%
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-fg mb-4">Interactive States</h3>
                  <p className="text-muted mb-4">
                    Hover effects, focus states, and micro-interactions throughout the interface.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-accent text-accentFg px-6 py-3 rounded-lg font-medium"
                    >
                      Hover & Tap
                    </motion.button>
                    
                    <motion.div
                      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                      className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer"
                    >
                      <div className="text-lg font-semibold text-fg">Hover Lift</div>
                      <div className="text-sm text-muted">Subtle elevation</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer"
                    >
                      <div className="text-lg font-semibold text-fg">Hover Rotate</div>
                      <div className="text-sm text-muted">Playful interaction</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
