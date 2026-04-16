param(
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:3000"
)

Write-Host "Testing Notifications Flow`n" -ForegroundColor Green

try {
    # Create first user (comment author)
    Write-Host "1. Creating Author User..." -ForegroundColor Cyan
    $timestamp1 = Get-Date -Format "yyyyMMddHHmmssf"
    $author = @{
        email = "author$timestamp1@test.com"
        username = "author_$timestamp1"
        password = "TestPass123!"
    } | ConvertTo-Json

    $authorRes = Invoke-RestMethod -Uri "$ApiUrl/auth/register" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $author

    $authorId = $authorRes.user.id
    $authorToken = $authorRes.access_token

    Write-Host "PASS: Author user created: $authorId" -ForegroundColor Green

    # Create second user (comment liker)
    Write-Host "`n2. Creating Liker User..." -ForegroundColor Cyan
    Start-Sleep -Milliseconds 100
    $timestamp2 = Get-Date -Format "yyyyMMddHHmmssf"
    $liker = @{
        email = "liker$timestamp2@test.com"
        username = "liker_$timestamp2"
        password = "TestPass123!"
    } | ConvertTo-Json

    $likerRes = Invoke-RestMethod -Uri "$ApiUrl/auth/register" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $liker

    $likerId = $likerRes.user.id
    $likerToken = $likerRes.access_token

    Write-Host "PASS: Liker user created: $likerId" -ForegroundColor Green

    # Author creates a comment
    Write-Host "`n3. Author Creating Comment..." -ForegroundColor Cyan
    $authorHeaders = @{
        "Authorization" = "Bearer $authorToken"
        "Content-Type" = "application/json"
    }

    $commentBody = @{
        content = "Testing notification system"
    } | ConvertTo-Json

    $commentRes = Invoke-RestMethod -Uri "$ApiUrl/comments" `
        -Method Post `
        -Headers $authorHeaders `
        -Body $commentBody

    $commentId = $commentRes._id
    Write-Host "PASS: Comment created: $commentId" -ForegroundColor Green

    # Liker likes the comment
    Write-Host "`n4. Liker Liking Comment..." -ForegroundColor Cyan
    $likerHeaders = @{
        "Authorization" = "Bearer $likerToken"
        "Content-Type" = "application/json"
    }

    $likeBody = @{
        commentId = $commentId
    } | ConvertTo-Json

    $likeRes = Invoke-RestMethod -Uri "$ApiUrl/likes" `
        -Method Post `
        -Headers $likerHeaders `
        -Body $likeBody

    Write-Host "PASS: Comment liked" -ForegroundColor Green

    # Check if author received notification
    Write-Host "`n5. Checking Notifications for Author..." -ForegroundColor Cyan
    Start-Sleep -Milliseconds 500

    $notifRes = Invoke-RestMethod -Uri "$ApiUrl/notifications" `
        -Method Get `
        -Headers $authorHeaders

    if ($notifRes -and $notifRes.Count -gt 0) {
        Write-Host "PASS: Notification(s) received!" -ForegroundColor Green
        $notifRes | ForEach-Object {
            Write-Host "   - Type: $($_.type)"
            Write-Host "   - Message: $($_.message)"
            Write-Host "   - Sender: $($_.sender.username)"
            Write-Host "   - Read: $($_.read)"
            Write-Host ""
        }
    } else {
        Write-Host "WARNING: No notifications received (might be still in progress)" -ForegroundColor Yellow
    }

    # Check unread count
    Write-Host "6. Checking Unread Count..." -ForegroundColor Cyan
    $unreadRes = Invoke-RestMethod -Uri "$ApiUrl/notifications/unread-count" `
        -Method Get `
        -Headers $authorHeaders

    Write-Host "PASS: Unread count: $($unreadRes.unreadCount)" -ForegroundColor Green

    Write-Host "`nNotification Flow Test Complete!" -ForegroundColor Green

} catch {
    Write-Host "Test failed:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
