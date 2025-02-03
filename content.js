
console.log('Content script is loaded!');
const observer = new MutationObserver(() => {
    // 查找 <div class="resultset"> 是否存在
    const newRows = document.querySelectorAll('.resultset .row');
    
    // 如果找到了 <div class="resultset">
    newRows.forEach(row => {
        if (!row.dataset.processed) {  // 检查这个元素是否已经处理过
          console.log('New row found:', row);
    
          // 在这里执行你需要的操作，如处理 row 内容
          handleItemInformation(row);
    
          // 设置该 row 为已处理，防止重复处理
          row.dataset.processed = true;
        }
    });
  });
  
  // 配置 MutationObserver 监听整个页面的变化
  observer.observe(document.body, { childList: true, subtree: true });

function handleItemInformation(row) {
    const item = row;
    let Rarity='Rare'
    // 获取物品信息（在 middle 部分）
    const middleSection = item.querySelector('.middle');
    if (!middleSection) return;
    const matchingElements = item.querySelectorAll('.uniquePopup, .rarePopup, .magicPopup');
    if (matchingElements.length > 0) {
        matchingElements.forEach(element => {
          // 检查每个元素的类，输出具体是哪个类
          if (element.classList.contains('uniquePopup')) {
            Rarity='Unique';
          } else if (element.classList.contains('rarePopup')) {
            Rarity='Rare';
          } else if (element.classList.contains('magicPopup')) {
            Rarity='Magic';
          }
        });
      } 
    const itemName = middleSection.querySelector('.itemName .lc')?.textContent.trim();
    const itemTypeName = middleSection.querySelector('.itemName.typeLine .lc')?.textContent.trim();
    const itemType = middleSection.querySelector('.content .property .lc')?.textContent.trim();
    
    let propertysinfo=''
    const propertys = middleSection.querySelectorAll('.content .property .lc.s');
    propertys.forEach(property=>{
        propertysinfo+=property.textContent.trim()+'\n';
    })

    const itemLevel = middleSection.querySelector('.itemLevel .colourDefault')?.textContent.trim();
    const itemRequirements = middleSection.querySelector('.requirements .lc')?.textContent.trim();

    let mod_propertysinfo=''
    mod_property_all=middleSection.querySelectorAll('[class$="Mod"]');
    
    mod_property_all.forEach(mod_property=>{
        mod_propertysinfo+=mod_property.querySelector('.lc.s')?.textContent.trim();
        
    });
    // // 获取物品的属性
    // const itemStats = [];
    // middleSection.querySelectorAll('.content .property').forEach(prop => {
    //     itemStats.push(prop.textContent.trim());
    // });

    // 获取 implicit 和 explicit mod
    // const implicitMod = middleSection.querySelector('.implicitMod .s')?.textContent.trim();
    // const explicitMods = [];
    // middleSection.querySelectorAll('.explicitMod .s').forEach(explicit => {
    //     explicitMods.push(explicit.textContent.trim());
    // });

    // 获取污染标记（Corrupted）
    const corrupted = middleSection.querySelector('.unmet') ? 'Corrupted' : '';

    // 创建 "复制" 按钮
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制到PoB';
    copyButton.style.marginLeft = '10px';

    // 格式化物品信息
    let itemInfo = `
Item Class: ${itemType}
Rarity: ${Rarity}
${itemName}
${itemTypeName}
--------
`;
    // 加入 charm slots 和属性
    propertys.forEach(stat => {
        itemInfo += `${stat.textContent.trim()}\n`;
    });
    itemInfo+=`--------\n`;
    // 加入物品等级和需求
    itemInfo += `Item Level:${itemLevel}
--------\n`;

    // 加入mod
 
    mod_property_all.forEach(mod => {
        itemInfo += `${mod.querySelector('.lc.s')?.textContent.trim()}`+'\n';

    });
    itemInfo+=`--------\n`;
    // 如果物品被污染（Corrupted）
    if (corrupted) itemInfo += `${corrupted}
--------`;

    // 设置按钮点击事件，复制物品信息到剪贴板
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(itemInfo)
            .then()
            .catch(err => alert('复制失败：' + err));
    });

    // 将按钮添加到物品条目中的右侧
    const rightSection = item.querySelector('.right .details .btns');
    if (rightSection) {
        rightSection.appendChild(copyButton);
    }
}
