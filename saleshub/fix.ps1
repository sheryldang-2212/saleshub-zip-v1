$content = Get-Content -Raw 'js\companies.js'
$content = $content.Replace('\${', '${')
$content = $content.Replace('\`', '`')
Set-Content -Path 'js\companies.js' -Value $content
