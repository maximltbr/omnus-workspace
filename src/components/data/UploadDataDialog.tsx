import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataStore } from '@/stores/useDataStore';
import { parseFile } from '@/lib/fileParser';
import { toast } from 'sonner';
import type { DatasetType, Environment } from '@/types';

interface ParsedData {
  headers: string[];
  rows: any[][];
  rowCount: number;
}

export function UploadDataDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<DatasetType>('snapshot');
  const [environment, setEnvironment] = useState<Environment>('CRM');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDataset } = useDataStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(extension || '')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name.replace(/\.(csv|xlsx|xls)$/i, ''));
    setIsProcessing(true);

    try {
      const data = await parseFile(selectedFile);
      setParsedData(data);
      toast.success(`Parsed ${data.rowCount} rows with ${data.headers.length} columns`);
    } catch (error) {
      toast.error('Failed to parse file');
      console.error(error);
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = () => {
    if (!file || !parsedData || !name.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    const source = file.name.endsWith('.csv') ? 'CSV' : 'XLSX';

    addDataset({
      name: name.trim(),
      source,
      type,
      environment,
      automation: { enabled: false, status: 'ok' },
      restricted: false,
    });

    toast.success(`Dataset "${name}" uploaded successfully`);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setParsedData(null);
    setName('');
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create a new dataset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">File (.csv, .xlsx)</Label>
            <div className="flex gap-2">
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
              {file && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setParsedData(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          {parsedData && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                <strong>Preview:</strong> {parsedData.rowCount} rows, {parsedData.headers.length} columns
                <div className="mt-2 text-xs text-muted-foreground">
                  Columns: {parsedData.headers.slice(0, 5).join(', ')}
                  {parsedData.headers.length > 5 && '...'}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Dataset Details */}
          {parsedData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dataset-name">Dataset Name</Label>
                <Input
                  id="dataset-name"
                  placeholder="e.g., Q1 Sales Data"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-type">Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as DatasetType)}>
                    <SelectTrigger id="upload-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="snapshot">Snapshot</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-environment">Environment</Label>
                  <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                    <SelectTrigger id="upload-environment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="CRM">CRM</SelectItem>
                      <SelectItem value="ERP">ERP</SelectItem>
                      <SelectItem value="Headcount">Headcount</SelectItem>
                      <SelectItem value="BI">BI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Info */}
          {!file && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload CSV or Excel files up to 20MB. Schema will be automatically detected.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!parsedData || !name.trim()}>
            Upload Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
