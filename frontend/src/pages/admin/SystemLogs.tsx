import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  category: string;
  message: string;
  details?: string;
}

// Generate mock logs for demonstration
const generateMockLogs = (): LogEntry[] => {
  const categories = ["Auth", "API", "Database", "System", "Security"];
  const levels: LogEntry["level"][] = ["info", "warning", "error", "success"];
  
  const logTemplates = [
    { level: "success" as const, category: "Auth", message: "User login successful", details: "User authenticated via JWT" },
    { level: "info" as const, category: "API", message: "GET /api/appointments - 200", details: "Response time: 45ms" },
    { level: "warning" as const, category: "Security", message: "Multiple failed login attempts", details: "IP: 192.168.1.100" },
    { level: "error" as const, category: "Database", message: "Connection timeout", details: "Retrying in 5 seconds..." },
    { level: "info" as const, category: "System", message: "Server health check passed", details: "All services operational" },
    { level: "success" as const, category: "Auth", message: "New user registered", details: "Role: patient" },
    { level: "info" as const, category: "API", message: "POST /api/appointments - 201", details: "New appointment created" },
    { level: "warning" as const, category: "System", message: "High memory usage detected", details: "Usage: 85%" },
    { level: "success" as const, category: "Database", message: "Backup completed successfully", details: "Size: 2.3GB" },
    { level: "info" as const, category: "Security", message: "Session refreshed", details: "Token renewed" },
  ];

  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const timestamp = new Date(now.getTime() - i * 60000 * Math.random() * 10);
    
    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      ...template,
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const levelIcons = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
  success: <CheckCircle className="h-4 w-4 text-success" />,
};

const levelColors = {
  info: "bg-blue-500/10 text-blue-500",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const SystemLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLogs(generateMockLogs());
      setIsLoading(false);
    }, 500);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const categories = [...new Set(logs.map(log => log.category))];

  return (
    <DashboardLayout role="admin">
      <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">System Logs</h1>
          <p className="page-description">
            Monitor system activity and troubleshoot issues
          </p>
        </div>
        <Button onClick={loadLogs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-foreground">{logs.length}</p>
          <p className="text-sm text-muted-foreground">Total Logs</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-destructive">{logs.filter(l => l.level === "error").length}</p>
          <p className="text-sm text-muted-foreground">Errors</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-warning">{logs.filter(l => l.level === "warning").length}</p>
          <p className="text-sm text-muted-foreground">Warnings</p>
        </div>
        <div className="healthcare-card text-center">
          <p className="text-2xl font-bold text-success">{logs.filter(l => l.level === "success").length}</p>
          <p className="text-sm text-muted-foreground">Success</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[150px] h-11">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] h-11">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="table-container">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No logs found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice(0, 30).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${levelColors[log.level]}`}>
                      {levelIcons[log.level]}
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{log.category}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-foreground">{log.message}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(30, filteredLogs.length)} of {filteredLogs.length} logs
        </p>
      </div>
    </DashboardLayout>
  );
};

export default SystemLogs;
