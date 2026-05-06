param(
  [string]$OutputDir = "ppt_web"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Get-Location).Path
$outRoot = Join-Path $root $OutputDir
$assetDir = Join-Path $outRoot "assets"
$slideDir = Join-Path $outRoot "slides"
$tempRoot = Join-Path $env:TEMP ("pptx-web-" + [guid]::NewGuid().ToString("N"))

$slugMap = @{
  1 = "if"
  2 = "while"
  3 = "for"
  4 = "basic-io"
  5 = "file-io"
  6 = "function"
  7 = "class"
}

$sourcePattern = "E:\26-\26-1*\3. *\*ppt\*.pptx"
$presentations = Get-ChildItem -Path $sourcePattern |
  Sort-Object { [int]([regex]::Match($_.BaseName, "^\d+").Value) } |
  ForEach-Object {
    $order = [int]([regex]::Match($_.BaseName, "^\d+").Value)
    @{
      Path = $_.FullName
      Slug = $slugMap[$order]
      Title = ($_.BaseName -replace "^\d+\.\s*", "")
    }
  }

function Reset-Directory($path) {
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Recurse -Force
  }
  New-Item -ItemType Directory -Path $path -Force | Out-Null
}

function HtmlEncode($value) {
  return [System.Net.WebUtility]::HtmlEncode([string]$value)
}

function Get-FirstNode($node, [string]$xpath) {
  return $node.SelectSingleNode($xpath)
}

function Get-Attr($node, [string]$name, $default = $null) {
  if ($null -eq $node -or $null -eq $node.Attributes) { return $default }
  $attr = $node.Attributes.GetNamedItem($name)
  if ($null -eq $attr) { return $default }
  return $attr.Value
}

function Read-XmlUtf8([string]$path) {
  $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $xml = New-Object System.Xml.XmlDocument
  $xml.PreserveWhitespace = $true
  $xml.LoadXml($text)
  return $xml
}

function Get-TextRuns($shape) {
  $paragraphs = @()
  $pNodes = $shape.SelectNodes(".//*[local-name()='txBody']/*[local-name()='p']")
  foreach ($p in $pNodes) {
    $runs = @()
    $rNodes = $p.SelectNodes("./*[local-name()='r']")
    foreach ($r in $rNodes) {
      $textNode = $r.SelectSingleNode("./*[local-name()='t']")
      if ($null -eq $textNode) { continue }
      $rPr = $r.SelectSingleNode("./*[local-name()='rPr']")
      $size = Get-Attr $rPr "sz" $null
      $bold = (Get-Attr $rPr "b" "0") -eq "1"
      $italic = (Get-Attr $rPr "i" "0") -eq "1"
      $color = $null
      $srgb = $rPr.SelectSingleNode(".//*[local-name()='solidFill']/*[local-name()='srgbClr']")
      if ($null -ne $srgb) { $color = "#" + (Get-Attr $srgb "val" "111111") }
      $runs += @{
        Text = $textNode.InnerText
        Size = $size
        Bold = $bold
        Italic = $italic
        Color = $color
      }
    }
    if ($runs.Count -eq 0) {
      $plain = $p.SelectSingleNode("./*[local-name()='fld']/*[local-name()='t']")
      if ($null -ne $plain) { $runs += @{ Text = $plain.InnerText; Size = $null; Bold = $false; Italic = $false; Color = $null } }
    }
    if ($runs.Count -gt 0) {
      $paragraphs += @{
        Runs = $runs
        Align = Get-Attr ($p.SelectSingleNode("./*[local-name()='pPr']")) "algn" "l"
        Bullet = $null -ne ($p.SelectSingleNode("./*[local-name()='pPr']/*[local-name()='buChar']"))
      }
    }
  }
  return $paragraphs
}

function Get-Xfrm($node, [double]$slideCx, [double]$slideCy) {
  $xfrm = $node.SelectSingleNode(".//*[local-name()='xfrm']")
  if ($null -eq $xfrm) {
    return @{ Left = 0; Top = 0; Width = 100; Height = 100 }
  }
  $off = $xfrm.SelectSingleNode("./*[local-name()='off']")
  $ext = $xfrm.SelectSingleNode("./*[local-name()='ext']")
  $x = [double](Get-Attr $off "x" 0)
  $y = [double](Get-Attr $off "y" 0)
  $cx = [double](Get-Attr $ext "cx" 914400)
  $cy = [double](Get-Attr $ext "cy" 914400)
  return @{
    Left = [math]::Round(($x / $slideCx) * 100, 4)
    Top = [math]::Round(($y / $slideCy) * 100, 4)
    Width = [math]::Round(($cx / $slideCx) * 100, 4)
    Height = [math]::Round(($cy / $slideCy) * 100, 4)
  }
}

function Get-SolidFill($node) {
  $srgb = $node.SelectSingleNode(".//*[local-name()='spPr']/*[local-name()='solidFill']/*[local-name()='srgbClr']")
  if ($null -ne $srgb) { return "#" + (Get-Attr $srgb "val" "ffffff") }
  return $null
}

function Get-LineFill($node) {
  $srgb = $node.SelectSingleNode(".//*[local-name()='spPr']/*[local-name()='ln']/*[local-name()='solidFill']/*[local-name()='srgbClr']")
  if ($null -ne $srgb) { return "#" + (Get-Attr $srgb "val" "d0d7de") }
  return $null
}

function Get-RelMap($relsPath) {
  $map = @{}
  if (-not (Test-Path -LiteralPath $relsPath)) { return $map }
  $rels = Read-XmlUtf8 $relsPath
  foreach ($rel in $rels.SelectNodes("//*[local-name()='Relationship']")) {
    $map[(Get-Attr $rel "Id" "")] = Get-Attr $rel "Target" ""
  }
  return $map
}

function Render-TextBox($shape, $pos) {
  $paras = Get-TextRuns $shape
  if ($paras.Count -eq 0) { return "" }
  $fill = Get-SolidFill $shape
  $style = "left:$($pos.Left)%;top:$($pos.Top)%;width:$($pos.Width)%;height:$($pos.Height)%;"
  if ($fill) { $style += "background:$fill;" }
  $html = "<div class=""textbox"" style=""$style"">"
  foreach ($p in $paras) {
    $align = switch ($p.Align) { "ctr" { "center" } "r" { "right" } default { "left" } }
    $pClass = if ($p.Bullet) { "para bullet" } else { "para" }
    $html += "<p class=""$pClass"" style=""text-align:$align"">"
    foreach ($run in $p.Runs) {
      $runStyle = ""
      if ($run.Size) {
        $pt = [math]::Round(([double]$run.Size / 100), 1)
        $runStyle += "font-size:$pt`pt;"
      }
      if ($run.Bold) { $runStyle += "font-weight:700;" }
      if ($run.Italic) { $runStyle += "font-style:italic;" }
      if ($run.Color) { $runStyle += "color:$($run.Color);" }
      $html += "<span style=""$runStyle"">$(HtmlEncode $run.Text)</span>"
    }
    $html += "</p>"
  }
  $html += "</div>"
  return $html
}

function Render-ShapeBox($shape, $pos) {
  $fill = Get-SolidFill $shape
  $line = Get-LineFill $shape
  if (-not $fill -and -not $line) { return "" }
  $style = "left:$($pos.Left)%;top:$($pos.Top)%;width:$($pos.Width)%;height:$($pos.Height)%;"
  if ($fill) { $style += "background:$fill;" }
  if ($line) { $style += "border:1px solid $line;" }
  return "<div class=""shape-box"" style=""$style""></div>"
}

Reset-Directory $outRoot
New-Item -ItemType Directory -Path $assetDir -Force | Out-Null
New-Item -ItemType Directory -Path $slideDir -Force | Out-Null
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

$allSlides = @()
$globalIndex = 1

try {
  foreach ($deck in $presentations) {
    if (-not (Test-Path -LiteralPath $deck.Path)) {
      throw "Missing file: $($deck.Path)"
    }

    $extractDir = Join-Path $tempRoot $deck.Slug
    [System.IO.Compression.ZipFile]::ExtractToDirectory($deck.Path, $extractDir)

    $presXml = Read-XmlUtf8 (Join-Path $extractDir "ppt\presentation.xml")
    $sldSz = $presXml.SelectSingleNode("//*[local-name()='sldSz']")
    $slideCx = [double](Get-Attr $sldSz "cx" 12192000)
    $slideCy = [double](Get-Attr $sldSz "cy" 6858000)

    $slideFiles = Get-ChildItem -LiteralPath (Join-Path $extractDir "ppt\slides") -Filter "slide*.xml" |
      Sort-Object { [int]([regex]::Match($_.BaseName, "\d+").Value) }

    $deckSlideNo = 1
    foreach ($slideFile in $slideFiles) {
      $slideXml = Read-XmlUtf8 $slideFile.FullName
      $relsPath = Join-Path $slideFile.DirectoryName ("_rels\" + $slideFile.Name + ".rels")
      $rels = Get-RelMap $relsPath
      $items = @()

      $bg = "#ffffff"
      $bgNode = $slideXml.SelectSingleNode("//*[local-name()='cSld']/*[local-name()='bg']//*[local-name()='srgbClr']")
      if ($null -ne $bgNode) { $bg = "#" + (Get-Attr $bgNode "val" "ffffff") }

      $shapeNodes = $slideXml.SelectNodes("//*[local-name()='cSld']/*[local-name()='spTree']/*[local-name()='sp']")
      foreach ($shape in $shapeNodes) {
        $pos = Get-Xfrm $shape $slideCx $slideCy
        $rendered = Render-TextBox $shape $pos
        if ($rendered) {
          $items += $rendered
        } else {
          $shapeBox = Render-ShapeBox $shape $pos
          if ($shapeBox) { $items += $shapeBox }
        }
      }

      $picNodes = $slideXml.SelectNodes("//*[local-name()='cSld']/*[local-name()='spTree']/*[local-name()='pic']")
      foreach ($pic in $picNodes) {
        $embed = Get-Attr ($pic.SelectSingleNode(".//*[local-name()='blip']")) "embed" $null
        if (-not $embed) { continue }
        $target = $rels[$embed]
        if (-not $target) { continue }
        $source = Join-Path (Join-Path $extractDir "ppt\slides") $target
        $source = [System.IO.Path]::GetFullPath($source)
        if (-not (Test-Path -LiteralPath $source)) { continue }
        $assetName = ("{0:000}-{1}-{2}" -f $globalIndex, $deck.Slug, [System.IO.Path]::GetFileName($source))
        Copy-Item -LiteralPath $source -Destination (Join-Path $assetDir $assetName) -Force
        $pos = Get-Xfrm $pic $slideCx $slideCy
        $items += "<img class=""slide-image"" src=""../assets/$assetName"" alt="""" style=""left:$($pos.Left)%;top:$($pos.Top)%;width:$($pos.Width)%;height:$($pos.Height)%;"">"
      }

      $fileName = "{0:000}-{1}-{2:00}.html" -f $globalIndex, $deck.Slug, $deckSlideNo
      $allSlides += @{
        File = $fileName
        Deck = $deck.Title
        DeckSlide = $deckSlideNo
        Global = $globalIndex
        Background = $bg
        Items = ($items -join "`n")
      }
      $globalIndex += 1
      $deckSlideNo += 1
    }
  }

  $total = $allSlides.Count
  for ($i = 0; $i -lt $total; $i++) {
    $slide = $allSlides[$i]
    $prev = if ($i -gt 0) { $allSlides[$i - 1].File } else { $allSlides[$total - 1].File }
    $next = if ($i -lt ($total - 1)) { $allSlides[$i + 1].File } else { $allSlides[0].File }
    $indexUrl = "../index.html"
    $html = @"
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$(HtmlEncode $slide.Deck) $($slide.DeckSlide)</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body data-prev="$prev" data-next="$next">
  <main class="viewer">
    <section class="slide" style="background:$($slide.Background)">
$($slide.Items)
    </section>
  </main>
  <nav class="chrome" aria-label="slide navigation">
    <a class="nav-button" href="$prev" title="이전 슬라이드">‹</a>
    <a class="deck-title" href="$indexUrl">$(HtmlEncode $slide.Deck) · $($slide.DeckSlide) / $total</a>
    <a class="nav-button" href="$next" title="다음 슬라이드">›</a>
  </nav>
  <script src="../slide-nav.js"></script>
</body>
</html>
"@
    Set-Content -LiteralPath (Join-Path $slideDir $slide.File) -Value $html -Encoding UTF8
  }

  $links = ""
  foreach ($slide in $allSlides) {
    $links += "<a href=""slides/$($slide.File)""><span>$($slide.Global)</span> $(HtmlEncode $slide.Deck) - $($slide.DeckSlide)</a>`n"
  }
  $first = $allSlides[0].File
  $indexHtml = @"
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>파이썬 수업 슬라이드</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="index-page">
  <main class="index">
    <h1>파이썬 수업 슬라이드</h1>
    <p>방향키 ← / → 또는 화면 아래 버튼으로 이동합니다.</p>
    <a class="start" href="slides/$first">첫 슬라이드 보기</a>
    <section class="slide-list">
$links
    </section>
  </main>
</body>
</html>
"@
  Set-Content -LiteralPath (Join-Path $outRoot "index.html") -Value $indexHtml -Encoding UTF8

  $css = @"
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif; color: #141414; background: #1d2430; }
.viewer { min-height: 100vh; display: grid; place-items: center; padding: 24px 24px 64px; }
.slide { position: relative; width: min(96vw, calc((100vh - 100px) * 16 / 9)); aspect-ratio: 16 / 9; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.36); }
.shape-box { position: absolute; }
.textbox { position: absolute; padding: .2% .6%; overflow: hidden; line-height: 1.22; }
.para { margin: 0 0 .32em; white-space: pre-wrap; overflow-wrap: anywhere; }
.bullet::before { content: "• "; }
.slide-image { position: absolute; object-fit: contain; display: block; }
.chrome { position: fixed; left: 0; right: 0; bottom: 0; min-height: 48px; display: grid; grid-template-columns: 48px 1fr 48px; align-items: center; background: rgba(10, 15, 22, .9); backdrop-filter: blur(8px); color: #fff; }
.chrome a { color: inherit; text-decoration: none; }
.nav-button { height: 48px; display: grid; place-items: center; font-size: 34px; line-height: 1; }
.nav-button:hover, .deck-title:hover { background: rgba(255,255,255,.12); }
.deck-title { height: 48px; display: grid; place-items: center; padding: 0 12px; font-size: 15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.index-page { background: #f4f6f8; color: #17202a; }
.index { width: min(980px, calc(100vw - 32px)); margin: 0 auto; padding: 40px 0; }
.index h1 { margin: 0 0 8px; font-size: 34px; }
.index p { margin: 0 0 20px; color: #51606f; }
.start { display: inline-flex; align-items: center; min-height: 40px; padding: 0 16px; border-radius: 6px; background: #1f6feb; color: #fff; text-decoration: none; font-weight: 700; }
.slide-list { margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.slide-list a { min-height: 42px; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid #d7dde4; border-radius: 6px; color: #17202a; background: #fff; text-decoration: none; }
.slide-list span { width: 34px; flex: 0 0 auto; text-align: right; color: #6a7682; font-variant-numeric: tabular-nums; }
@media (max-width: 720px) {
  .viewer { padding: 10px 10px 58px; align-content: center; }
  .slide { width: 100%; }
  .deck-title { font-size: 13px; }
}
"@
  Set-Content -LiteralPath (Join-Path $outRoot "styles.css") -Value $css -Encoding UTF8

  $js = @"
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    location.href = document.body.dataset.next;
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'Backspace') {
    event.preventDefault();
    location.href = document.body.dataset.prev;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    location.href = '../index.html';
  }
});
"@
  Set-Content -LiteralPath (Join-Path $outRoot "slide-nav.js") -Value $js -Encoding UTF8

  Write-Host "Created $total slide pages in $outRoot"
}
finally {
  if (Test-Path -LiteralPath $tempRoot) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
  }
}
