import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Play, Loader2, CheckCircle, XCircle, Plus, Minus, Clock } from 'lucide-react';

interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
  version: string;
}

interface SchemaProperty {
  title?: string;
  description?: string;
  type: string;
  default?: any;
  example?: any;
  enum?: string[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

interface ActorSchema {
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

interface RunResult {
  status: string;
  data?: Record<string, unknown>;
  error?: string;
}

interface ActorRunnerProps {
  actor: Actor;
  schema: ActorSchema;
  onBack: () => void;
  onRun: (inputs: Record<string, any>) => Promise<RunResult>;
}

export function ActorRunner({ actor, schema, onBack, onRun }: ActorRunnerProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runStartTime, setRunStartTime] = useState<number | null>(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    Object.entries(schema.properties).forEach(([key, property]) => {
      if (property.default !== undefined) {
        defaultInputs[key] = property.default;
      } else if (property.example !== undefined) {
        defaultInputs[key] = property.example;
      } else if (property.type === 'array') {
        defaultInputs[key] = [];
      } else if (property.type === 'object') {
        defaultInputs[key] = {};
      }
    });
    

    
    setInputs(defaultInputs);
  }, [schema]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isRunning && runStartTime) {
      timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 240000);
    } else {
      setTimeoutWarning(false);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRunning, runStartTime]);

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayAdd = (key: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), '']
    }));
  };

  const handleArrayRemove = (key: string, index: number) => {
    setInputs(prev => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleArrayItemChange = (key: string, index: number, value: any) => {
    setInputs(prev => ({
      ...prev,
      [key]: prev[key].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const validateRequiredFields = (): { isValid: boolean; missingFields: string[]; allFields: string[] } => {
    const missingFields: string[] = [];
    const requiredFields = schema.required || [];
    const allFields = Object.keys(schema.properties || {});
    
    requiredFields.forEach(fieldName => {
      const value = inputs[fieldName];
      
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0)) {
        missingFields.push(fieldName);
      }
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      allFields
    };
  };

  const handleRun = async () => {
    const validation = validateRequiredFields();
    
    if (!validation.isValid) {
      setResult({
        status: 'failed',
        error: `Missing required fields: ${validation.missingFields.map(field => {
          const property = schema.properties[field];
          return property?.title || field;
        }).join(', ')}. Please fill in all required fields before running the actor.`
      });
      return;
    }

    setIsRunning(true);
    setResult(null);
    setRunStartTime(Date.now());
    setTimeoutWarning(false);
    try {
      const finalInputs = Object.keys(inputs).length === 0 ? { url: 'https://www.apify.com/' } : inputs;
      
      const runResult = await onRun(finalInputs);
      setResult(runResult);
    } catch (error) {
      setResult({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsRunning(false);
      setRunStartTime(null);
    }
  };

  const renderInput = (key: string, property: SchemaProperty, autoFocus: boolean = false) => {
    const isRequired = schema.required?.includes(key);
    
    if (property.enum) {
      return (
        <select
          value={inputs[key] || ''}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="flex h-11 sm:h-12 w-full rounded-lg glass-input px-4 py-3 text-sm sm:text-base bg-transparent"
          aria-label={`Select ${property.title || key}`}
          autoFocus={autoFocus}
        >
          <option value="">Select an option...</option>
          {property.enum.map((option) => (
            <option key={option} value={option} className="bg-gray-800">
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (property.type === 'boolean') {
      return (
        <select
          value={inputs[key]?.toString() || 'false'}
          onChange={(e) => handleInputChange(key, e.target.value === 'true')}
          className="flex h-11 sm:h-12 w-full rounded-lg glass-input px-4 py-3 text-sm sm:text-base bg-transparent"
          aria-label={`Select boolean value for ${property.title || key}`}
          autoFocus={autoFocus}
        >
          <option value="false" className="bg-gray-800">False</option>
          <option value="true" className="bg-gray-800">True</option>
        </select>
      );
    }

    if (property.type === 'array') {
      const arrayValue = inputs[key] || [];
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Array items ({arrayValue.length})</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(key)}
              className="h-8 px-3"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Item
            </Button>
          </div>
          {arrayValue.map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item || ''}
                onChange={(e) => handleArrayItemChange(key, index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="glass-input h-10 text-sm flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayRemove(key, index)}
                className="h-10 px-3 text-red-400 hover:text-red-300"
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {arrayValue.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No items added yet. Click "Add Item" to start.</p>
          )}
        </div>
      );
    }

    if (property.type === 'object') {
      const objectValue = inputs[key] || '{}';
      const displayValue = typeof objectValue === 'string' ? objectValue : JSON.stringify(objectValue, null, 2);
      return (
        <div className="space-y-2">
          <Textarea
            value={displayValue}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(key, parsed);
              } catch {
                // Keep as string while user is typing
                handleInputChange(key, e.target.value);
              }
            }}
            placeholder={property.example ? JSON.stringify(property.example, null, 2) : '{}'}
            className="glass-input text-sm font-mono min-h-[100px] resize-y"
            autoFocus={autoFocus}
          />
          <p className="text-xs text-muted-foreground">Enter valid JSON object</p>
        </div>
      );
    }

    if (property.type === 'number' || property.type === 'integer') {
      return (
        <Input
          type="number"
          value={inputs[key] || ''}
          onChange={(e) => handleInputChange(key, Number(e.target.value))}
          placeholder={property.example?.toString() || `Enter ${property.title || key}`}
          className="glass-input h-11 sm:h-12 text-sm sm:text-base"
          autoFocus={autoFocus}
        />
      );
    }

    return (
      <Input
        type="text"
        value={inputs[key] || ''}
        onChange={(e) => handleInputChange(key, e.target.value)}
        placeholder={property.example?.toString() || `Enter ${property.title || key}`}
        className="glass-input h-11 sm:h-12 text-sm sm:text-base"
        autoFocus={autoFocus}
      />
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Actors
          </Button>
          
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {actor.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">{actor.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <Card className="glass-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Actor Configuration</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configure the input parameters for your actor run
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {Object.entries(schema.properties).map(([key, property], index) => {
                const isRequired = schema.required?.includes(key);
                const hasValue = inputs[key] !== undefined && inputs[key] !== '' && inputs[key] !== null;
                const isFirstRequired = isRequired && index === 0;
                const showValidationError = isRequired && !hasValue && Object.keys(inputs).length > 0;
                
                return (
                  <div key={key} className={`space-y-2 ${isRequired ? 'required-field' : ''}`}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span className={isRequired ? 'text-foreground' : 'text-muted-foreground'}>
                        {property.title || key}
                      </span>
                      {isRequired && (
                        <span className="text-red-400 font-bold" title="Required field">*</span>
                      )}
                      {hasValue && isRequired && (
                        <span className="text-green-400 text-xs" title="Field completed">✓</span>
                      )}
                    </label>
                    {property.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{property.description}</p>
                    )}
                    <div className={`relative ${showValidationError ? 'validation-error' : ''}`}>
                      {renderInput(key, property, isFirstRequired)}
                      {showValidationError && (
                        <div className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                          This field is required
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <Button 
                onClick={handleRun} 
                disabled={isRunning || !validateRequiredFields().isValid}
                variant="glass"
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Actor...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Actor
                  </>
                )}
              </Button>
              
              {/* Show validation errors */}
              {!validateRequiredFields().isValid && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400 mb-2">Required fields missing:</p>
                  <ul className="text-xs text-red-300 space-y-1">
                    {validateRequiredFields().missingFields.map(field => {
                      const property = schema.properties[field];
                      return (
                        <li key={field} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                          {property?.title || field} (field: "{field}")
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-red-500/20">
                    <p className="text-xs text-red-300">Available fields: {validateRequiredFields().allFields.join(', ')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Execution Result</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                The output from your actor run will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {!result && !isRunning && (
                <div className="text-center py-8 sm:py-12 text-muted-foreground animate-in fade-in duration-500">
                  <Play className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50 animate-pulse" />
                  <p className="text-sm sm:text-base animate-in fade-in slide-in-from-bottom-2 duration-700">Click "Run Actor" to see results here</p>
                </div>
              )}
              
              {isRunning && (
                <div className="text-center py-8 sm:py-12 animate-in fade-in duration-300">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4 animate-spin text-primary" />
                    <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4 border-2 border-primary/20 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2 animate-pulse">Your actor is running...</p>
                  {timeoutWarning && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 text-sm animate-in slide-in-from-bottom-2 duration-300">
                      <Clock className="w-4 h-4 animate-bounce" />
                      <span className="animate-pulse">This is taking longer than expected. Timeout in ~1 minute.</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2 animate-in fade-in duration-500">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span>Maximum runtime: 5 minutes</span>
                  </div>
                </div>
              )}
              
              {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2">
                    {result.status === 'succeeded' ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    )}
                    <span className="text-sm sm:text-base font-medium capitalize">{result.status}</span>
                  </div>
                  
                  {/* Run Statistics */}
                  {result.data && typeof result.data === 'object' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-black/10 rounded-lg">
                      {result.data.runTime && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{Math.round(Number(result.data.runTime) / 1000)}s</div>
                          <div className="text-xs text-muted-foreground">Runtime</div>
                        </div>
                      )}
                      {result.data.itemsCount !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{String(result.data.itemsCount)}</div>
                          <div className="text-xs text-muted-foreground">Items</div>
                        </div>
                      )}
                      {result.data.requestsCount !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{String(result.data.requestsCount)}</div>
                          <div className="text-xs text-muted-foreground">Requests</div>
                        </div>
                      )}
                      {result.data.runId && (
                        <div className="text-center">
                          <div className="text-xs font-mono text-muted-foreground truncate">{String(result.data.runId).slice(-8)}</div>
                          <div className="text-xs text-muted-foreground">Run ID</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Results Data */}
                  {result.data && (
                    <div className="space-y-3">
                      {/* Show results if available */}
                      {result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <span>Results ({result.data.results.length} items)</span>
                            {result.data.results.length === 10 && (
                              <span className="text-xs text-muted-foreground">(showing first 10)</span>
                            )}
                          </h4>
                          <div className="bg-black/20 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-auto max-h-64 sm:max-h-96">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.data.results, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {/* Show message if results couldn't be retrieved */}
                      {result.data.message && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-400 text-sm">
                            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                            {String(result.data.message)}
                          </div>
                          {result.data.datasetId && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Dataset ID: <span className="font-mono">{String(result.data.datasetId)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Show error if present */}
                      {result.error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <div className="text-red-400 text-sm font-medium mb-2">Error Details</div>
                          <div className="bg-black/20 rounded p-2 font-mono text-xs overflow-auto">
                            <pre className="whitespace-pre-wrap">{result.error}</pre>
                          </div>
                        </div>
                      )}
                      
                      {/* Raw data toggle for debugging */}
                      {result.data && !result.error && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            Show raw response data
                          </summary>
                          <div className="mt-2 bg-black/20 rounded-lg p-3 font-mono overflow-auto max-h-48">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}