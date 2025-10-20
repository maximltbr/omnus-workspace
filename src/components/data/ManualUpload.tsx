import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseFile } from '@/lib/fileParser';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';
import type { DatasetType, Environment } from '@/types';

interface ManualUploadProps {
  onClose: () => void;
}

export function ManualUpload({ onClose }: ManualUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [type, setType] = useState<DatasetType>('snapshot');
  const [environment, setEnvironment] = useState<Environment>('BI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const { addDataset } = useDataStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(extension || '')) {
      toast.error('Please select a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setDatasetName(selectedFile.name.replace(/\.(csv|xlsx|xls)$/i, ''));
    
    setIsProcessing(true);
    try {
      const data = await parseFile(selectedFile);
      setParsedData(data);
      toast.success('File parsed successfully');
    } catch (error) {
      toast.error('Failed to parse file');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = () => {
    if (!file || !parsedData || !datasetName) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const source = extension === 'csv' ? 'CSV' : 'XLSX';

    addDataset({
      name: datasetName,
      source: source as any,
      type,
      environment,
      automation: {
        enabled: false,
        status: 'ok',
      },
      restricted: false,
      data: parsedData, // Store the parsed data
    });

    toast.success('Dataset uploaded successfully');
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Upload File</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">File</Label>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="text-center">
                    {file ? (
                      <>
                        <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          CSV or XLSX files only
                        </p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {parsedData && (
              <>
                <div>
                  <Label htmlFor="dataset-name">Dataset Name</Label>
                  <Input
                    id="dataset-name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="Enter dataset name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as DatasetType)}>
                    <SelectTrigger id="type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="snapshot">Snapshot</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                    <SelectTrigger id="environment" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRM">CRM</SelectItem>
                      <SelectItem value="ERP">ERP</SelectItem>
                      <SelectItem value="Headcount">Headcount</SelectItem>
                      <SelectItem value="BI">BI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Parsed {parsedData.rowCount} rows with {parsedData.headers.length} columns
                  </AlertDescription>
                </Alert>

                <div>
                  <Label>Preview (first 3 rows)</Label>
                  <div className="mt-2 border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            {parsedData.headers.map((header: string, i: number) => (
                              <th key={i} className="px-4 py-2 text-left font-medium">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.rows.slice(0, 3).map((row: any[], i: number) => (
                            <tr key={i} className="border-b border-border last:border-0">
                              {row.map((cell: any, j: number) => (
                                <td key={j} className="px-4 py-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!parsedData || !datasetName || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : 'Upload Dataset'}
        </Button>
      </div>
    </div>
  );
}
