# Test registration API
$body = @{
    name = "Test Student"
    email = "test@klh.edu.in"
    password = "Test@123"
    studentId = "2021001"
    role = "student"
    department = "CSE"
    year = 3
    phone = "9876543210"
} | ConvertTo-Json

Write-Host "Testing Registration API..." -ForegroundColor Cyan
Write-Host "Sending request to: http://localhost:5000/api/auth/register" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "`n✅ SUCCESS! User registered:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
    Write-Host "`n🎉 Now refresh MongoDB Compass to see the data!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host ($_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 3)
    }
}
