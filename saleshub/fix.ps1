foreach ($file in @('app.js', 'app2.js')) {
    $content = Get-Content -Raw $file
    
    $content = $content.Replace('Discovery (Synced)', 'Discovery (10%)')

    $oldDrop = "        if (newStage.includes('Synced')) {
           alert("This stage is synced from Bid status. You cannot manually move deals here.");
           return;
        }

        const deal = mockDeals.find(d => d.id === dealId);"
    
    $newDrop = "        if (newStage.includes('Synced')) {
           alert("This stage is synced from Bid status. You cannot manually move deals here.");
           return;
        }

        if (newStage.includes('Discovery')) {
           const overlay = document.getElementById('discovery-modal-overlay');
           const modal = document.getElementById('discovery-modal');
           if(overlay && modal) {
             overlay.style.display='block';
             modal.style.display='block';
           }
           return;
        }

        const deal = mockDeals.find(d => d.id === dealId);"

    # Some systems use \r\n instead of \n
    $oldDropCRLF = $oldDrop.Replace("
", "
")
    $newDropCRLF = $newDrop.Replace("
", "
")
    
    $content = $content.Replace($oldDrop, $newDrop).Replace($oldDropCRLF, $newDropCRLF)

    $oldBtn = "if (!stageText.includes('Solution Design')) {""
    $newBtn = "if (!stageText.includes('Solution Design') && !stageText.includes('Discovery')) {""
    $content = $content.Replace($oldBtn, $newBtn)

    $oldAlert1 = "alert(`Bid can only be created in Solution Design stage. Current stage: ${stageText}`);"
    $newAlert1 = "alert(`Bid can only be created in Discovery or Solution Design stage. Current stage: ${stageText}`);"
    $content = $content.Replace($oldAlert1, $newAlert1)

    $oldBtn2 = "if (!selected.includes('Solution Design')) {""
    $newBtn2 = "if (!selected.includes('Solution Design') && !selected.includes('Discovery')) {""
    $content = $content.Replace($oldBtn2, $newBtn2)

    $oldAlert2 = "alert('Bid can only be created in Solution Design stage. Current stage is not valid.');""
    $newAlert2 = "alert('Bid can only be created in Discovery or Solution Design stage. Current stage is not valid.');""
    $content = $content.Replace($oldAlert2, $newAlert2)

    Set-Content $file $content -Encoding UTF8
}
