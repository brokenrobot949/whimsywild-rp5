# Local test server for Whimsywild RP5.
#
# Serves the game at http://localhost:8000/whimsywild-rp5/ - the same subfolder the live
# GitHub Pages site uses - so a path that starts with "/" breaks here just as it would online.
# It also refuses file names whose capital letters don't match, because GitHub Pages is
# case-sensitive even though Windows is not. Files are never cached, so a normal refresh
# always loads the latest code.
#
# To start it, double-click tools/start-server.cmd. To stop it, close that window.

param(
  [int]$Port = 8000,
  [switch]$Open
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path.TrimEnd('\')
$base = '/whimsywild-rp5/'
$types = @{
  '.html'  = 'text/html; charset=utf-8'
  '.js'    = 'text/javascript; charset=utf-8'
  '.css'   = 'text/css; charset=utf-8'
  '.json'  = 'application/json; charset=utf-8'
  '.md'    = 'text/plain; charset=utf-8'
  '.txt'   = 'text/plain; charset=utf-8'
  '.png'   = 'image/png'
  '.jpg'   = 'image/jpeg'
  '.gif'   = 'image/gif'
  '.svg'   = 'image/svg+xml'
  '.mp3'   = 'audio/mpeg'
  '.woff2' = 'font/woff2'
}

# True if every part of the path matches the real file and folder names exactly, capitals included.
function Test-ExactCase([string]$relative) {
  $dir = $root
  foreach ($part in $relative.Split('/')) {
    if ($part -eq '') { continue }
    $entry = [IO.Directory]::GetFileSystemEntries($dir, $part) | Select-Object -First 1
    if (-not $entry -or [IO.Path]::GetFileName($entry) -cne $part) { return $false }
    $dir = $entry
  }
  return $true
}

function Send-Bytes($response, [int]$status, [string]$type, [byte[]]$body) {
  $response.StatusCode = $status
  $response.ContentType = $type
  $response.Headers['Cache-Control'] = 'no-store'
  $response.ContentLength64 = $body.Length
  $response.OutputStream.Write($body, 0, $body.Length)
}

function Send-Text($response, [int]$status, [string]$text) {
  Send-Bytes $response $status 'text/plain; charset=utf-8' ([Text.Encoding]::UTF8.GetBytes($text))
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "Could not start the server on port $Port. It may already be running in another window."
  exit 1
}

$address = "http://localhost:$Port$base"
Write-Host ''
Write-Host "  Whimsywild RP5 is running at  $address"
Write-Host "  Debug mode:                   $($address)?debug"
Write-Host '  Close this window to stop the server.'
Write-Host ''
if ($Open) { Start-Process $address }

try {
  while ($listener.IsListening) {
    # Wait in short slices so Ctrl+C can stop the server.
    $pending = $listener.GetContextAsync()
    while (-not $pending.AsyncWaitHandle.WaitOne(250)) { }
    $context = $pending.GetAwaiter().GetResult()
    $response = $context.Response
    $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
    $status = 200
    try {
      if ($path -eq '/' -or $path -eq '/whimsywild-rp5') {
        $status = 302
        $response.Redirect($base)
      } elseif (-not $path.StartsWith($base)) {
        $status = 404
        Send-Text $response 404 "Not found: $path`nThe game lives under $base. A path that starts with '/' skips that folder, and will break on GitHub Pages too."
      } else {
        $relative = $path.Substring($base.Length)
        if ($relative -eq '' -or $relative.EndsWith('/')) { $relative += 'index.html' }
        $file = [IO.Path]::GetFullPath((Join-Path $root $relative))
        if (-not $file.StartsWith($root + '\') -or -not [IO.File]::Exists($file)) {
          $status = 404
          Send-Text $response 404 "Not found: $path"
        } elseif (-not (Test-ExactCase $relative)) {
          $status = 404
          Send-Text $response 404 "Not found: $path`nA file with this name exists, but its capital letters are different. GitHub Pages cares about capitals, so fix the name or the link."
        } else {
          $type = $types[[IO.Path]::GetExtension($file).ToLowerInvariant()]
          if (-not $type) { $type = 'application/octet-stream' }
          Send-Bytes $response 200 $type ([IO.File]::ReadAllBytes($file))
        }
      }
    } catch {
      $status = 500
      try { Send-Text $response 500 "Server error: $_" } catch { }
    } finally {
      try { $response.Close() } catch { }
    }
    Write-Host "$status $path"
  }
} finally {
  $listener.Stop()
}
