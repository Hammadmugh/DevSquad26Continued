# Comprehensive Project Test Suite
# Tests the entire NestJS backend and frontend integration

$ErrorActionPreference = "SilentlyContinue"
$WarningPreference = "SilentlyContinue"

# Colors
$SuccessColor = "Green"
$ErrorColor = "Red"
$InfoColor = "Yellow"
$HeadingColor = "Cyan"

Write-Host "`n================================================================================================" -ForegroundColor $HeadingColor
Write-Host "DEVSQUAD26 - COMPREHENSIVE PROJECT TEST SUITE" -ForegroundColor $HeadingColor
Write-Host "================================================================================================`n" -ForegroundColor $HeadingColor

$baseUrl = "http://localhost:3000"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$Token,
        [boolean]$ShouldFail = $false
    )
    
    try {
        $headers = @{"Content-Type" = "application/json"}
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params
        $result = $response.Content | ConvertFrom-Json
        
        if ($ShouldFail) {
            Write-Host "[FAIL] $Name (expected failure)" -ForegroundColor $ErrorColor
            $script:testResults += @{Test = $Name; Status = "FAILED"; Expected = "Failure"; Actual = "Success"}
        } else {
            Write-Host "[PASS] $Name" -ForegroundColor $SuccessColor
            $script:testResults += @{Test = $Name; Status = "PASSED"; Expected = "Success"; Actual = "Success"}
        }
        
        return $result
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($ShouldFail -and $statusCode -eq 401) {
            Write-Host "[PASS] $Name (correctly blocked)" -ForegroundColor $SuccessColor
            $script:testResults += @{Test = $Name; Status = "PASSED"; Expected = "401"; Actual = "401"}
        } else {
            Write-Host "[FAIL] $Name (HTTP $statusCode)" -ForegroundColor $ErrorColor
            $script:testResults += @{Test = $Name; Status = "FAILED"; Expected = "Success"; Actual = "HTTP $statusCode"}
        }
        
        return $null
    }
}

# ==================== PHASE 1: PUBLIC ENDPOINTS ====================
Write-Host "PHASE 1: PUBLIC ENDPOINTS (No Authentication Required)" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Get all users
Test-Endpoint -Name "GET /users (Public)" -Method GET -Endpoint "/users" | Out-Null

# Get all comments
Test-Endpoint -Name "GET /comments (Public)" -Method GET -Endpoint "/comments" | Out-Null

Write-Host ""

# ==================== PHASE 2: AUTHENTICATION FLOW ====================
Write-Host "PHASE 2: AUTHENTICATION FLOW" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Register user 1
$user1 = @{
    email = "testuser1_$([DateTime]::Now.Ticks)@example.com"
    password = "TestPassword123!"
    username = "testuser1_$([DateTime]::Now.Ticks)"
}

$registerResult = Test-Endpoint -Name "POST /auth/register (User 1)" -Method POST -Endpoint "/auth/register" -Body $user1
$user1Email = $user1.email
$token1 = $registerResult.access_token

# Register user 2  
$user2 = @{
    email = "testuser2_$([DateTime]::Now.Ticks)@example.com"
    password = "TestPassword123!"
    username = "testuser2_$([DateTime]::Now.Ticks)"
}

$registerResult2 = Test-Endpoint -Name "POST /auth/register (User 2)" -Method POST -Endpoint "/auth/register" -Body $user2
$user2Email = $user2.email
$token2 = $registerResult2.access_token

# Login user 1
$loginBody = @{
    email = $user1Email
    password = "TestPassword123!"
}

$loginResult = Test-Endpoint -Name "POST /auth/login" -Method POST -Endpoint "/auth/login" -Body $loginBody
$loginToken = $loginResult.access_token

Write-Host ""

# ==================== PHASE 3: PROTECTED USER ENDPOINTS ====================
Write-Host "PHASE 3: PROTECTED USER ENDPOINTS" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Get profile with valid token
Test-Endpoint -Name "GET /users/profile (With Token)" -Method GET -Endpoint "/users/profile" -Token $token1 | Out-Null

# Get profile without token (should fail)
Test-Endpoint -Name "GET /users/profile (Without Token)" -Method GET -Endpoint "/users/profile" -ShouldFail $true | Out-Null

# Update profile
$updateBody = @{
    bio = "Test user bio from comprehensive test"
    profilePicture = "https://example.com/pic.jpg"
}

# Note: Need to extract user ID first
$profileData = Test-Endpoint -Name "GET /users/profile (to extract ID)" -Method GET -Endpoint "/users/profile" -Token $token1
$userId = $profileData._id
Test-Endpoint -Name "PATCH /users/:id (Update Profile)" -Method PATCH -Endpoint "/users/$userId" -Body $updateBody -Token $token1 | Out-Null

Write-Host ""

# ==================== PHASE 4: COMMENTS FUNCTIONALITY ====================
Write-Host "PHASE 4: COMMENTS FUNCTIONALITY" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Create comment as user 1
$commentBody = @{
    content = "Test comment from comprehensive test - User 1 at $([DateTime]::Now)"
}

$commentResult = Test-Endpoint -Name "POST /comments (Create)" -Method POST -Endpoint "/comments" -Body $commentBody -Token $token1
$commentId = $commentResult._id

# Get all comments
Test-Endpoint -Name "GET /comments (Get All)" -Method GET -Endpoint "/comments" | Out-Null

# Get specific comment
if ($commentId) {
    Test-Endpoint -Name "GET /comments/:id (Get Specific)" -Method GET -Endpoint "/comments/$commentId" | Out-Null
}

# Update comment
$updateCommentBody = @{
    content = "Updated test comment - $([DateTime]::Now)"
}

if ($commentId) {
    Test-Endpoint -Name "PATCH /comments/:id (Update)" -Method PATCH -Endpoint "/comments/$commentId" -Body $updateCommentBody -Token $token1 | Out-Null
}

# Like comment as user 2
if ($commentId) {
    Test-Endpoint -Name "POST /comments/:id/like (Like)" -Method POST -Endpoint "/comments/$commentId/like" -Token $token2 | Out-Null
}

# Get likes on comment
if ($commentId) {
    Test-Endpoint -Name "GET /likes/:commentId (Get Likes)" -Method GET -Endpoint "/likes/$commentId" | Out-Null
}

# Check if liked
if ($commentId) {
    Test-Endpoint -Name "GET /likes/:commentId/is-liked (Check Liked)" -Method GET -Endpoint "/likes/$commentId/is-liked" -Token $token2 | Out-Null
}

Write-Host ""

# ==================== PHASE 5: FOLLOWERS FUNCTIONALITY ====================
Write-Host "PHASE 5: FOLLOWERS FUNCTIONALITY" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Extract user2 ID
$profileData2 = Test-Endpoint -Name "GET /users/profile (User 2 - extract ID)" -Method GET -Endpoint "/users/profile" -Token $token2
$user2Id = $profileData2._id

# User 1 follows User 2
if ($user2Id) {
    Test-Endpoint -Name "POST /followers/:userId/follow (User 1 -> User 2)" -Method POST -Endpoint "/followers/$user2Id/follow" -Token $token1 | Out-Null
}

# Get followers of user 2
if ($user2Id) {
    Test-Endpoint -Name "GET /followers/:userId/followers (Get Followers)" -Method GET -Endpoint "/followers/$user2Id/followers" | Out-Null
}

# Get following of user 1
if ($userId) {
    Test-Endpoint -Name "GET /followers/:userId/following (Get Following)" -Method GET -Endpoint "/followers/$userId/following" | Out-Null
}

# Check if user 1 is following user 2
if ($userId -and $user2Id) {
    Test-Endpoint -Name "GET /followers/:userId/is-following/:targetId (Check Following)" -Method GET -Endpoint "/followers/$userId/is-following/$user2Id" -Token $token1 | Out-Null
}

Write-Host ""

# ==================== PHASE 6: NOTIFICATIONS ====================
Write-Host "PHASE 6: NOTIFICATIONS" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Get notifications
Test-Endpoint -Name "GET /notifications (Get All)" -Method GET -Endpoint "/notifications" -Token $token1 | Out-Null

# Get unread notifications
Test-Endpoint -Name "GET /notifications/unread (Get Unread)" -Method GET -Endpoint "/notifications/unread" -Token $token1 | Out-Null

# Get unread count
Test-Endpoint -Name "GET /notifications/unread-count (Get Unread Count)" -Method GET -Endpoint "/notifications/unread-count" -Token $token1 | Out-Null

Write-Host ""

# ==================== PHASE 7: COMMENTS WITH REPLIES ====================
Write-Host "PHASE 7: COMMENTS WITH REPLIES" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Add reply to comment
if ($commentId) {
    $replyBody = @{
        content = "This is a test reply - $([DateTime]::Now)"
    }
    
    Test-Endpoint -Name "POST /comments/:id/replies (Add Reply)" -Method POST -Endpoint "/comments/$commentId/replies" -Body $replyBody -Token $token2 | Out-Null
    
    # Get replies
    Test-Endpoint -Name "GET /comments/:id/replies (Get Replies)" -Method GET -Endpoint "/comments/$commentId/replies" | Out-Null
}

Write-Host ""

# ==================== PHASE 8: JWT AUTHENTICATION VALIDATION ====================
Write-Host "PHASE 8: JWT AUTHENTICATION VALIDATION" -ForegroundColor $InfoColor
Write-Host "================================================== ========" -ForegroundColor $InfoColor

# Test invalid token
Test-Endpoint -Name "GET /users/profile (Invalid Token)" -Method GET -Endpoint "/users/profile" -Token "invalid.token.here" -ShouldFail $true | Out-Null

# Test expired token - using a fake one
Test-Endpoint -Name "GET /users/profile (Malformed Token)" -Method GET -Endpoint "/users/profile" -Token "Bearer malformed" -ShouldFail $true | Out-Null

Write-Host ""

# ==================== RESULTS SUMMARY ====================
Write-Host "================================================================================================" -ForegroundColor $HeadingColor
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor $HeadingColor
Write-Host "================================================================================================`n" -ForegroundColor $HeadingColor

$passed = ($testResults | Where-Object {$_.Status -eq "PASSED"}).Count
$failed = ($testResults | Where-Object {$_.Status -eq "FAILED"}).Count
$total = $testResults.Count

Write-Host "Total Tests:  $total" -ForegroundColor $InfoColor
Write-Host "Passed:       $passed" -ForegroundColor $SuccessColor
if ($failed -eq 0) {
    Write-Host "Failed:       $failed" -ForegroundColor $SuccessColor
} else {
    Write-Host "Failed:       $failed" -ForegroundColor $ErrorColor
}
Write-Host ""

if ($failed -gt 0) {
    Write-Host "FAILED TESTS:" -ForegroundColor $ErrorColor
    $testResults | Where-Object {$_.Status -eq "FAILED"} | ForEach-Object {
        Write-Host "  [FAIL] $($_.Test)" -ForegroundColor $ErrorColor
        Write-Host "         Expected: $($_.Expected) | Actual: $($_.Actual)" -ForegroundColor $ErrorColor
    }
} else {
    Write-Host "*** ALL TESTS PASSED! ***" -ForegroundColor $SuccessColor
}

Write-Host ""
Write-Host "================================================================================================" -ForegroundColor $HeadingColor
Write-Host "END OF TEST SUITE" -ForegroundColor $HeadingColor
Write-Host "================================================================================================`n" -ForegroundColor $HeadingColor

# Return exit code
if ($failed -gt 0) { exit 1 } else { exit 0 }
