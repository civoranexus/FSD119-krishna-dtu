import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Search,
  FlaskConical,
  Pill,
  Stethoscope,
  Image,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MedicalRecord {
  _id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  provider: string;
  content?: string;
}

const iconMap: Record<string, any> = {
  "Lab Results": FlaskConical,
  "Prescription": Pill,
  "Visit Summary": Stethoscope,
  "Imaging": Image,
};

const categories = [
  { label: "All Records", value: "all" },
  { label: "Lab Results", value: "Lab Results" },
  { label: "Prescriptions", value: "Prescription" },
  { label: "Visit Summaries", value: "Visit Summary" },
  { label: "Imaging", value: "Imaging" },
];

const PatientRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/ehr/patient');
      const data = Array.isArray(response) ? response : response?.data || [];
      setRecords(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading records",
        description: error instanceof Error ? error.message : "Failed to fetch records",
      });
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || record.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (categoryValue: string) => {
    if (categoryValue === "all") return records.length;
    return records.filter(r => r.type === categoryValue).length;
  };

  const handleView = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowViewDialog(true);
  };

  const handleDownload = (record: MedicalRecord) => {
    // Create a downloadable text file with record details
    const content = `
Medical Record: ${record.title}
Type: ${record.type}
Date: ${record.date}
Provider: ${record.provider}

Description:
${record.description}

${record.content || ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.title.replace(/\s+/g, '_')}_${record.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Downloading ${record.title}`,
    });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const getIcon = (type: string) => iconMap[type] || FileText;
  return (
    <DashboardLayout role="patient">
      <div className="page-header">
        <h1 className="page-title">Medical Records</h1>
        <p className="page-description">
          Access and download your health documents
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="healthcare-card">
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.value
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {getCategoryCount(category.value)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Records List */}
        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <div className="healthcare-card text-center py-8 text-muted-foreground">
              Loading records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="healthcare-card text-center py-8 text-muted-foreground">
              No medical records found
            </div>
          ) : (
            filteredRecords.slice(0, visibleCount).map((record) => {
              const IconComponent = getIcon(record.type);
              return (
                <div
                  key={record._id}
                  className="healthcare-card flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <IconComponent className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-primary bg-accent px-2 py-0.5 rounded">
                          {record.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{record.date}</span>
                      </div>
                      <h3 className="font-medium text-foreground mt-1">{record.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{record.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Provider: {record.provider}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-none"
                      onClick={() => handleView(record)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 sm:flex-none"
                      onClick={() => handleDownload(record)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              );
            })
          )}

          {/* Load More */}
          {filteredRecords.length > visibleCount && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={handleLoadMore}>
                Load More Records ({filteredRecords.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* View Record Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.title}</DialogTitle>
            <DialogDescription>
              {selectedRecord?.type} • {selectedRecord?.date}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedRecord.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedRecord.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Provider</p>
                <p className="font-medium">{selectedRecord.provider}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{selectedRecord.description}</p>
              </div>
              {selectedRecord.content && (
                <div>
                  <p className="text-sm text-muted-foreground">Details</p>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{selectedRecord.content}</pre>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(selectedRecord)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PatientRecords;
