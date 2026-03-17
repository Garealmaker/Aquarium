Add-Type -AssemblyName System.Drawing
$sourcePath = 'C:\Users\lesci\Documents\Aquariow\assets\ground\ChatGPT Image 15 mars 2026, 20_57_05.png'
$groundDir = 'C:\Users\lesci\Documents\Aquariow\assets\ground'
$source = [System.Drawing.Bitmap]::FromFile($sourcePath)

$cropX = 69
$cropY = 52
$cropW = 364
$cropH = 194
$capW = 52

function New-TransparentBitmap([int]$width, [int]$height) {
  $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.Clear([System.Drawing.Color]::Transparent)
  $gfx.Dispose()
  return $bmp
}

function Copy-Region($src, [int]$x, [int]$y, [int]$w, [int]$h) {
  $bmp = New-TransparentBitmap $w $h
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $gfx.DrawImage($src, (New-Object System.Drawing.Rectangle 0,0,$w,$h), (New-Object System.Drawing.Rectangle $x,$y,$w,$h), [System.Drawing.GraphicsUnit]::Pixel)
  $gfx.Dispose()
  return $bmp
}

function Remove-WhiteBackground($bmp) {
  for ($yy = 0; $yy -lt $bmp.Height; $yy++) {
    for ($xx = 0; $xx -lt $bmp.Width; $xx++) {
      $c = $bmp.GetPixel($xx, $yy)
      if ($c.R -ge 244 -and $c.G -ge 244 -and $c.B -ge 244) {
        $bmp.SetPixel($xx, $yy, [System.Drawing.Color]::FromArgb(0, $c.R, $c.G, $c.B))
      }
    }
  }
}

$full = Copy-Region $source $cropX $cropY $cropW $cropH
Remove-WhiteBackground $full
$full.Save((Join-Path $groundDir 'substrate-light-tile.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$left = Copy-Region $full 0 0 $capW $cropH
$left.Save((Join-Path $groundDir 'substrate-light-left.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$center = Copy-Region $full $capW 0 ($cropW - ($capW * 2)) $cropH
$center.Save((Join-Path $groundDir 'substrate-light-center.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$right = Copy-Region $full ($cropW - $capW) 0 $capW $cropH
$right.Save((Join-Path $groundDir 'substrate-light-right.png'), [System.Drawing.Imaging.ImageFormat]::Png)

$full.Dispose(); $left.Dispose(); $center.Dispose(); $right.Dispose(); $source.Dispose()
Write-Output 'created substrate sprites'
