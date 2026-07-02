import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Discovery (Synced) -> Discovery (10%)
    content = content.replace('Discovery (Synced)', 'Discovery (10%)')

    # 2. Add Discovery Modal to drop logic
    old_drop = '''        if (newStage.includes('Synced')) {
           alert("This stage is synced from Bid status. You cannot manually move deals here.");
           return;
        }

        const deal = mockDeals.find(d => d.id === dealId);'''
        
    new_drop = '''        if (newStage.includes('Synced')) {
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

        const deal = mockDeals.find(d => d.id === dealId);'''
        
    content = content.replace(old_drop, new_drop)

    # 3. New Bid Logic
    old_btn1 = "if (!stageText.includes('Solution Design')) {"
    new_btn1 = "if (!stageText.includes('Solution Design') && !stageText.includes('Discovery')) {"
    content = content.replace(old_btn1, new_btn1)

    old_alert1 = "alert(Bid can only be created in Solution Design stage. Current stage: );"
    new_alert1 = "alert(Bid can only be created in Discovery or Solution Design stage. Current stage: );"
    content = content.replace(old_alert1, new_alert1)

    old_btn2 = "if (!selected.includes('Solution Design')) {"
    new_btn2 = "if (!selected.includes('Solution Design') && !selected.includes('Discovery')) {"
    content = content.replace(old_btn2, new_btn2)

    old_alert2 = "alert('Bid can only be created in Discovery or Solution Design stage. Current stage is not valid.');"
    new_alert2 = "alert('Bid can only be created in Discovery or Solution Design stage. Current stage is not valid.');"
    # Actually wait, the old alert2 in the base repo is:
    old_alert2 = "alert('Bid can only be created in Solution Design stage. Current stage is not valid.');"
    content = content.replace(old_alert2, new_alert2)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('app.js')
fix_file('app2.js')
print('Done!')
