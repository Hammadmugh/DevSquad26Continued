param(
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:3000"
)

# Create test user
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"
$testUsername = "testuser$timestamp"
$testPassword = "TestPassword123!"

Write-Host "Starting API Tests`n" -ForegroundColor Green

try {
    # Test 1: Register
    Write-Host "1. Testing User Registration..." -ForegroundColor Cyan
    $registerBody = @{
        email = $testEmail
        username = $testUsername
        password = $testPassword
    } | ConvertTo-Json

    $registerRes = Invoke-RestMethod -Uri "$ApiUrl/auth/register" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody

    $authToken = $registerRes.access_token
    $userId = $registerRes.user.id
    
    Write-Host "PASS: Registration successful" -ForegroundColor Green
    Write-Host "   Email: $($registerRes.user.email)"
    Write-Host "   Username: $($registerRes.user.username)"
    Write-Host "   User ID: $userId"
    Write-Host "   Token: $($authToken.Substring(0, 20))...`n" -ForegroundColor Gray

    # Test 2: Login
    Write-Host "2. Testing User Login..." -ForegroundColor Cyan
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $loginRes = Invoke-RestMethod -Uri "$ApiUrl/auth/login" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody

    $loginToken = $loginRes.access_token
    Write-Host "PASS: Login successful" -ForegroundColor Green
    Write-Host "   Token: $($loginToken.Substring(0, 20))...`n" -ForegroundColor Gray

    # Test 3: Get Profile with JWT
    Write-Host "3. Testing Get Profile (with JWT)..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $authToken"
        "Content-Type" = "application/json"
    }

    $profileRes = Invoke-RestMethod -Uri "$ApiUrl/users/profile" `
        -Method Get `
        -Headers $headers

    Write-Host "PASS: Profile retrieved" -ForegroundColor Green
    Write-Host "   Email: $($profileRes.email)"
    Write-Host "   Username: $($profileRes.username)"
    Write-Host "   Follower Count: $($profileRes.followerCount)`n" -ForegroundColor Gray

    # Test 4: Create a comment
    Write-Host "4. Testing Comment Creation..." -ForegroundColor Cyan
    $commentBody = @{
        content = "This is a test comment"
    } | ConvertTo-Json

    $commentRes = Invoke-RestMethod -Uri "$ApiUrl/comments" `
        -Method Post `
        -Headers $headers `
        -Body $commentBody

    $commentId = $commentRes._id
    Write-Host "PASS: Comment created" -ForegroundColor Green
    Write-Host "   Comment ID: $commentId"
    Write-Host "   Content: $($commentRes.content)`n" -ForegroundColor Gray

    # Test 5: Like a comment
    Write-Host "5. Testing Like Comment..." -ForegroundColor Cyan
    $likeBody = @{
        commentId = $commentId
    } | ConvertTo-Json

    $likeRes = Invoke-RestMethod -Uri "$ApiUrl/likes" `
        -Method Post `
        -Headers $headers `
        -Body $likeBody

    Write-Host "PASS: Comment liked" -ForegroundColor Green
    Write-Host "   Like ID: $($likeRes._id)`n" -ForegroundColor Gray

    # Test 6: Decode JWT to verify payload
    Write-Host "6. Checking JWT Token Payload..." -ForegroundColor Cyan
    $parts = $authToken.Split('.')
    if ($parts.Length -eq 3) {
        try {
            $payload = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($parts[1].PadRight($parts[1].Length + (4 - $parts[1].Length % 4) % 4, '='))) | ConvertFrom-Json
            Write-Host "PASS: JWT Payload decoded" -ForegroundColor Green
            Write-Host "   sub (User ID): $($payload.sub)"
            Write-Host "   email: $($payload.email)"
            Write-Host "   iat: $(Get-Date -UnixTimeSeconds $payload.iat -Format 'yyyy-MM-dd HH:mm:ss')"
            Write-Host "   exp: $(Get-Date -UnixTimeSeconds $payload.exp -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor Gray
        } catch {
            Write-Host "WARNING: Could not decode JWT payload`n" -ForegroundColor Yellow
        }
    }

    Write-Host "All tests PASSED!`n" -ForegroundColor Green
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "   User Created: $testEmail"
    Write-Host "   User ID: $userId"
    Write-Host "   Can Login: PASS"
    Write-Host "   Can Access Protected Routes: PASS"
    Write-Host "   Can Create Comments: PASS"
    Write-Host "   Can Like Comments: PASS"

} catch {
    Write-Host "Test failed:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
