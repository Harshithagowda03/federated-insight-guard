import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { validateFiles, formatFileSize, MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from "@/lib/fileValidation";

interface UploadedFile {
  name: string;
  size: number;
  status: "processing" | "completed" | "failed";
  records?: number;
}

const DataUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Validate files before processing
    const { validFiles, errors } = validateFiles(selectedFiles);

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length === 0) {
      return;
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      status: "processing" as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast.info(`Validating and uploading ${validFiles.length} file(s)...`);

    // Simulate server-side processing (in production, this would call an Edge Function)
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.name === file.name
            ? { 
                ...f, 
                status: Math.random() > 0.1 ? "completed" : "failed",
                records: Math.random() > 0.1 ? Math.floor(Math.random() * 10000) + 1000 : undefined
              }
            : f
        ));
        
        if (Math.random() > 0.1) {
          toast.success(`${file.name} processed successfully`);
        } else {
          toast.error(`Failed to process ${file.name}`);
        }
      }, 1500 * (index + 1));
    });

    // Reset input to allow re-uploading the same file
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Data Upload</h2>
        <p className="text-muted-foreground">Upload test data for model training and evaluation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Training Data</CardTitle>
          <CardDescription>
            Supported formats: CSV, JSON, PCAP, LOG files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12">
            <div className="text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4 flex flex-col items-center gap-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:underline">
                    Click to upload
                  </span>
                  <span className="text-sm text-muted-foreground"> or drag and drop</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv,.json,.pcap,.log"
                />
                <p className="text-xs text-muted-foreground">
                  {ALLOWED_EXTENSIONS.join(', ').toUpperCase()} files up to {MAX_FILE_SIZE / (1024 * 1024)}MB
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Uploaded Files</h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    {file.status === "completed" && <Check className="h-5 w-5 text-accent" />}
                    {file.status === "failed" && <X className="h-5 w-5 text-destructive" />}
                    {file.status === "processing" && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                        {file.records && ` • ${file.records.toLocaleString()} records`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium capitalize">{file.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Processing Statistics</CardTitle>
          <CardDescription>Overview of uploaded training data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processed</p>
              <p className="text-2xl font-bold">
                {files.filter(f => f.status === "completed").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">
                {files
                  .filter(f => f.records)
                  .reduce((sum, f) => sum + (f.records || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUpload;
