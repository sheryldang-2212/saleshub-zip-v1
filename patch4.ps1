$pmCode = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }
$paginationCode = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }
$newRenderContacts = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }
$newRenderCompanies = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }
$newRenderDeals = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }
$newRenderBids = Get-Content patch3.ps1 -Raw | Select-String -Pattern '(?s)\ = @''\r?\n(.*?)\r?\n''@' | ForEach-Object { $_.Matches.Groups[1].Value }

function ReplaceFirst($text, $search, $replace) {
    $idx = $text.IndexOf($search)
    if ($idx -lt 0) { return $text }
    return $text.Remove($idx, $search.Length).Insert($idx, $replace)
}

function ReplaceBlock($text, $startStr, $endStr, $replacement) {
    $startIndex = $text.IndexOf($startStr)
    if ($startIndex -lt 0) { return $text }
    $endIndex = $text.IndexOf($endStr, $startIndex)
    if ($endIndex -lt 0) { return $text }
    return $text.Remove($startIndex, $endIndex - $startIndex).Insert($startIndex, $replacement)
}

git restore saleshub/app.js

$content = [System.IO.File]::ReadAllText("saleshub\app.js", [System.Text.Encoding]::UTF8)

# 1. Insert PropertyManager at the top
$domContentLine = "document.addEventListener('DOMContentLoaded', () => {"
$content = ReplaceFirst $content $domContentLine ($pmCode + "

" + $domContentLine)

# 2. Insert pagination globals right inside DOMContentLoaded
$content = ReplaceFirst $content ("
" + $domContentLine + "
") ("
" + $domContentLine + "
" + $paginationCode + "
")
if ($content.IndexOf("
" + $domContentLine + "
" + $paginationCode) -lt 0) {
    $content = ReplaceFirst $content ("
" + $domContentLine + "
") ("
" + $domContentLine + "
" + $paginationCode + "
")
}

# 3. Replace Render blocks
$content = ReplaceBlock $content "  function renderContacts(filter = 'all') {" "  if (contactSelectAll) {" ($newRenderContacts + "
")
$content = ReplaceBlock $content "  function renderCompanies(filter = 'all', query = '') {" "  if (compTbody) {" ($newRenderCompanies + "
")
$content = ReplaceBlock $content "  function renderDeals() {" "  function setupDragAndDrop() {" ($newRenderDeals + "
")
$content = ReplaceBlock $content "  function renderBids() {" "  if (bidTbody || bidKanbanCols.length > 0) {" ($newRenderBids + "
")

# 4. Remove duplicate renderDetailProperties call
$content = $content.Replace("if (typeof window.renderDetailProperties === 'function') { window.renderDetailProperties(); }", "")
$content = ReplaceFirst $content "setTimeout(initForecastModule, 100);
});" "setTimeout(initForecastModule, 100);
  if (typeof window.renderDetailProperties === 'function') { window.renderDetailProperties(); }
});"

[System.IO.File]::WriteAllText("saleshub\app.js", $content, [System.Text.Encoding]::UTF8)
Write-Output "Patch 4 revised applied successfully!"

