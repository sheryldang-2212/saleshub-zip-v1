$files = Get-ChildItem -Path . -Filter *.html
foreach ($file in $files) {
    if ($file.Name -eq "test_debug.html") { continue }
    $content = Get-Content $file.FullName -Raw

    $active = ""
    if ($file.Name -eq "dashboards.html") { $active = "Dashboards" }
    elseif ($file.Name -match "index|contact.html") { $active = "Contacts" }
    elseif ($file.Name -match "compan") { $active = "Company" }
    elseif ($file.Name -match "deal") { $active = "Deal" }
    elseif ($file.Name -match "bid") { $active = "Presale Workspace" }
    elseif ($file.Name -match "forecast") { $active = "Revenue Forecast" }
    elseif ($file.Name -match "case_stud") { $active = "Case Study Hub" }
    elseif ($file.Name -match "admin_settings") { $active = "Settings" }

    $menu = @(
        @{text="Dashboards"; icon="ph-chart-pie-slice"; href="dashboards.html"},
        @{text="Contacts"; icon="ph-address-book"; href="index.html"},
        @{text="Company"; icon="ph-buildings"; href="companies.html"},
        @{text="Deal"; icon="ph-currency-dollar"; href="deals.html"},
        @{text="Presale Workspace"; icon="ph-gavel"; href="bidding.html"},
        @{text="Revenue Forecast"; icon="ph-trend-up"; href="forecast.html"},
        @{text="Case Study Hub"; icon="ph-books"; href="case_studies.html"},
        @{text="<i>Marketing (Coming soon)</i>"; icon="ph-megaphone"; href="#"},
        @{text="<i>Report (Coming soon)</i>"; icon="ph-file-text"; href="#"}
    )

    $newSidebar = "<aside class=`"sidebar`">`n      <div style=`"color: white; font-size: 24px; margin-bottom: 40px; display: flex; align-items: center; gap: 12px;`"><i class=`"ph ph-hexagon-fill`"></i> <span style=`"font-size: 18px; font-weight: 600;`">SalesHub</span></div>`n"

    foreach ($item in $menu) {
        $color = if ($item.text -eq $active) { "white" } else { "#7C98B6" }
        $newSidebar += "      <div style=`"color: $color; margin-bottom: 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; width: 100%;`" onclick=`"window.location.href='$($item.href)'`"><i class=`"ph $($item.icon)`" style=`"font-size: 22px;`"></i> $($item.text)</div>`n"
    }

    $color = if ($active -eq "Settings") { "white" } else { "#7C98B6" }
    $newSidebar += "      <div style=`"margin-top: auto; color: $color; cursor: pointer; display: flex; align-items: center; gap: 12px; font-weight: 500; width: 100%;`" onclick=`"window.location.href='admin_settings.html'`"><i class=`"ph ph-gear`" style=`"font-size: 22px;`"></i> Settings</div>`n    </aside>"

    $content = $content -replace '<aside class="sidebar">(?s).*?</aside>', $newSidebar
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated $($file.Name)"
}
