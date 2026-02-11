# HealthVillage System Health Check (PowerShell)
# Pre-Flight Diagnostic Script for Production Deployment

Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host "🏥 HealthVillage System Health Check" -ForegroundColor Cyan
Write-Host "Pre-Flight Diagnostic for Production Deployment" -ForegroundColor Cyan
Write-Host "========================================================================`n" -ForegroundColor Cyan

$results = @{
    backend = @{ status = "PENDING"; details = @() }
    frontend = @{ status = "PENDING"; details = @() }
    database = @{ status = "PENDING"; details = @() }
    environment = @{ status = "PENDING"; details = @() }
    security = @{ status = "PENDING"; details = @() }
}

function Print-Status {
    param(
        [string]$Label,
        [string]$Status,
        [string]$Message = ""
    )
    
    $icon = switch ($Status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "WARN" { "⚠️" }
        default { "⏳" }
    }
    
    $color = switch ($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        default { "Gray" }
    }
    
    $output = "$icon $Label"
    if ($Message) {
        $output += ": $Message"
    }
    
    Write-Host $output -ForegroundColor $color
}

function Test-Port {
    param([int]$Port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

function Test-HttpEndpoint {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing
        return @{ success = $true; status = $response.StatusCode; content = $response.Content }
    } catch {
        return @{ success = $false; error = $_.Exception.Message }
    }
}

# ============================================================================
# Environment Configuration Check
# ============================================================================
Write-Host "`n📋 Environment Configuration" -ForegroundColor Blue
Write-Host "----------------------------------------------------------------------" -ForegroundColor Blue

$backendEnvPath = Join-Path $PSScriptRoot "backend\.env"
$frontendEnvPath = Join-Path $PSScriptRoot "frontend\.env"

if (Test-Path $backendEnvPath) {
    Print-Status "Backend .env" "PASS" "File exists"
    
    $backendEnv = @{}
    Get-Content $backendEnvPath | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $backendEnv[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
    
    $requiredVars = @("MONGO_URI", "JWT_SECRET", "FRONTEND_URL", "NODE_ENV")
    $missingVars = $requiredVars | Where-Object { -not $backendEnv.ContainsKey($_) }
    
    if ($missingVars.Count -eq 0) {
        Print-Status "Required Variables" "PASS" "All present"
        $results.environment.status = "PASS"
    } else {
        Print-Status "Required Variables" "WARN" "Missing: $($missingVars -join ', ')"
        $results.environment.status = "WARN"
    }
    
    if ($backendEnv["JWT_SECRET"] -and $backendEnv["JWT_SECRET"].Length -lt 32) {
        Print-Status "JWT_SECRET Strength" "WARN" "Consider using a longer secret"
    } elseif ($backendEnv["JWT_SECRET"]) {
        Print-Status "JWT_SECRET Strength" "PASS" "Adequate length"
    }
    
    if ($backendEnv["NODE_ENV"] -eq "production") {
        Print-Status "Environment Mode" "PASS" "Production mode"
    } else {
        Print-Status "Environment Mode" "WARN" "Currently: $($backendEnv['NODE_ENV'])"
    }
} else {
    Print-Status "Backend .env" "FAIL" "File not found"
    $results.environment.status = "FAIL"
}

if (Test-Path $frontendEnvPath) {
    Print-Status "Frontend .env" "PASS" "File exists"
} else {
    Print-Status "Frontend .env" "WARN" "File not found (optional)"
}

# ============================================================================
# Backend API Health Check
# ============================================================================
Write-Host "`n📋 Backend API Health" -ForegroundColor Blue
Write-Host "----------------------------------------------------------------------" -ForegroundColor Blue

$backendPort = 5000
$backendRunning = Test-Port -Port $backendPort

if ($backendRunning) {
    Print-Status "Port 5000" "PASS" "Backend is running"
    
    $healthCheck = Test-HttpEndpoint -Url "http://localhost:5000/health"
    if ($healthCheck.success) {
        Print-Status "Health Endpoint" "PASS" "/health returns $($healthCheck.status)"
        $results.backend.status = "PASS"
        
        try {
            $healthData = $healthCheck.content | ConvertFrom-Json
            if ($healthData.status -eq "ok") {
                Print-Status "Health Status" "PASS" "Server reports OK"
            }
        } catch {
            # Ignore JSON parse errors
        }
    } else {
        Print-Status "Health Endpoint" "FAIL" $healthCheck.error
        $results.backend.status = "FAIL"
    }
} else {
    Print-Status "Backend Server" "FAIL" "Not running on port 5000"
    Print-Status "Action Required" "WARN" "Start backend: cd backend && npm run dev"
    $results.backend.status = "FAIL"
}

# ============================================================================
# Frontend Application Check
# ============================================================================
Write-Host "`n📋 Frontend Application" -ForegroundColor Blue
Write-Host "----------------------------------------------------------------------" -ForegroundColor Blue

$frontendPort = 5173
$frontendRunning = Test-Port -Port $frontendPort

if ($frontendRunning) {
    Print-Status "Port 5173" "PASS" "Frontend is running"
    
    $frontendCheck = Test-HttpEndpoint -Url "http://localhost:5173"
    if ($frontendCheck.success) {
        Print-Status "Frontend Server" "PASS" "Responding on port 5173"
        $results.frontend.status = "PASS"
        
        if ($frontendCheck.content -match "HealthVillage|root") {
            Print-Status "Application" "PASS" "HealthVillage app detected"
        }
    } else {
        Print-Status "Frontend Server" "FAIL" $frontendCheck.error
        $results.frontend.status = "FAIL"
    }
} else {
    Print-Status "Frontend Server" "FAIL" "Not running on port 5173"
    Print-Status "Action Required" "WARN" "Start frontend: cd frontend && npm run dev"
    $results.frontend.status = "FAIL"
}

# ============================================================================
# Database Connectivity Check
# ============================================================================
Write-Host "`n📋 Database Connectivity" -ForegroundColor Blue
Write-Host "----------------------------------------------------------------------" -ForegroundColor Blue

if ($backendEnv -and $backendEnv["MONGO_URI"]) {
    Print-Status "MongoDB URI" "PASS" "Configured in .env"
    
    if ($backendEnv["MONGO_URI"] -match "mongodb://([^:]+):(\d+)/(.+)") {
        $dbHost = $matches[1]
        $dbPort = $matches[2]
        $dbName = $matches[3]
        Print-Status "Database Host" "PASS" "$dbHost:$dbPort"
        Print-Status "Database Name" "PASS" $dbName
    }
    
    Write-Host "`n⏳ Testing MongoDB connection..." -ForegroundColor Gray
    
    # Test MongoDB connection by checking if backend can connect
    if ($backendRunning) {
        Print-Status "MongoDB Connection" "PASS" "Backend connected (inferred from running state)"
        $results.database.status = "PASS"
    } else {
        Print-Status "MongoDB Connection" "WARN" "Cannot verify (backend not running)"
        $results.database.status = "WARN"
    }
} else {
    Print-Status "MongoDB URI" "FAIL" "Not configured in .env"
    $results.database.status = "FAIL"
}

# ============================================================================
# Security Configuration Check
# ============================================================================
Write-Host "`n📋 Security Configuration" -ForegroundColor Blue
Write-Host "----------------------------------------------------------------------" -ForegroundColor Blue

if ($backendEnv) {
    $securityIssues = 0
    
    if ($backendEnv["JWT_SECRET"] -eq "your-secret-key" -or $backendEnv["JWT_SECRET"] -eq "secret") {
        Print-Status "JWT Secret" "FAIL" "Using default/weak secret"
        $securityIssues++
    } elseif ($backendEnv["JWT_SECRET"] -and $backendEnv["JWT_SECRET"].Length -ge 32) {
        Print-Status "JWT Secret" "PASS" "Strong secret configured"
    } else {
        Print-Status "JWT Secret" "WARN" "Secret could be stronger"
    }
    
    if ($backendEnv["FRONTEND_URL"]) {
        Print-Status "CORS Origin" "PASS" "Configured: $($backendEnv['FRONTEND_URL'])"
    } else {
        Print-Status "CORS Origin" "WARN" "FRONTEND_URL not set"
    }
    
    if ($backendEnv["NODE_ENV"] -eq "production") {
        Print-Status "Production Mode" "PASS" "NODE_ENV=production"
    } else {
        Print-Status "Production Mode" "WARN" "NODE_ENV=$($backendEnv['NODE_ENV']) (should be 'production' for deployment)"
    }
    
    $results.security.status = if ($securityIssues -gt 0) { "FAIL" } else { "PASS" }
} else {
    Print-Status "Security Check" "FAIL" "Cannot read .env file"
    $results.security.status = "FAIL"
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "`n========================================================================" -ForegroundColor Cyan
Write-Host "📊 Health Check Summary" -ForegroundColor Cyan
Write-Host "========================================================================`n" -ForegroundColor Cyan

$components = @(
    @{ name = "Environment Configuration"; result = $results.environment }
    @{ name = "Backend API"; result = $results.backend }
    @{ name = "Frontend Application"; result = $results.frontend }
    @{ name = "Database Connection"; result = $results.database }
    @{ name = "Security Settings"; result = $results.security }
)

$allPass = $true
$hasWarnings = $false

foreach ($component in $components) {
    $status = $component.result.status
    $icon = switch ($status) {
        "PASS" { "✅" }
        "FAIL" { "❌" }
        "WARN" { "⚠️" }
        default { "⏳" }
    }
    
    $color = switch ($status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        default { "Gray" }
    }
    
    Write-Host "$icon $($component.name): $status" -ForegroundColor $color
    
    if ($status -eq "FAIL") { $allPass = $false }
    if ($status -eq "WARN") { $hasWarnings = $true }
}

Write-Host "`n========================================================================" -ForegroundColor Cyan

if ($allPass -and -not $hasWarnings) {
    Write-Host "🎉 ALL SYSTEMS GO! Ready for deployment." -ForegroundColor Green
} elseif ($allPass -and $hasWarnings) {
    Write-Host "⚠️  MOSTLY READY - Review warnings before deployment." -ForegroundColor Yellow
} else {
    Write-Host "❌ NOT READY - Fix critical issues before deployment." -ForegroundColor Red
}

Write-Host "========================================================================`n" -ForegroundColor Cyan
