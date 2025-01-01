// 游戏状态对象
const gameState = {
    spiritualPower: 0,
    cultivation: 0,
    lifespan: 0,
    money: 0,
    energy: 100,
    maxEnergy: 100,
    level: 0,
    inventory: [],
    breakthroughBonus: 0
};

// 消息显示函数
function addMessage(message, type = 'info') {
    const messageLog = document.getElementById('message-log');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageLog.insertBefore(messageElement, messageLog.firstChild);
}

// 更新能量条显示
function updateEnergyBar() {
    const energyFill = document.getElementById('energy-fill');
    const percentage = (gameState.energy / gameState.maxEnergy) * 100;
    energyFill.style.width = `${percentage}%`;
}

// 更新显示函数
function updateDisplay() {
    document.getElementById('spiritual-power').textContent = gameState.spiritualPower;
    document.getElementById('cultivation').textContent = gameState.cultivation;
    document.getElementById('lifespan').textContent = gameState.lifespan;
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('energy').textContent = `${gameState.energy}/${gameState.maxEnergy}`;
    document.getElementById('level').textContent = getLevelName(gameState.level);
    updateEnergyBar();
}

// 获取境界名称
function getLevelName(level) {
    const levels = [
        "凡人", 
        "练气初期", "练气中期", "练气后期",
        "筑基初期", "筑基中期", "筑基后期",
        "金丹初期", "金丹中期", "金丹后期"
    ];
    return levels[level] || "未知境界";
}

// 打坐修炼
function cultivate() {
    if (gameState.energy < 10) {
        addMessage("体力不足，需要休息！", "warning");
        return;
    }

    const gain = Math.floor(Math.random() * 10) + 5 + gameState.level * 2;
    gameState.cultivation += gain;
    gameState.energy -= 10;
    addMessage(`打坐修炼获得${gain}点修为！`);
    updateDisplay();
}

// 采集灵气
function collectSpirit() {
    if (gameState.energy < 10) {
        addMessage("体力不足，需要休息！", "warning");
        return;
    }

    const gain = Math.floor(Math.random() * 5) + 3 + gameState.level;
    gameState.spiritualPower += gain;
    gameState.energy -= 10;
    addMessage(`采集到${gain}点灵气！`);
    
    if (Math.random() < 0.1) {
        triggerRandomEvent();
    }
    
    updateDisplay();
}

// 突破境界
function breakthrough() {
    const requireCultivation = (gameState.level + 1) * 100;
    
    if (gameState.cultivation < requireCultivation) {
        addMessage(`修为不足，需要${requireCultivation}点修为才能尝试突破！`, "warning");
        return;
    }

    if (gameState.energy < 50) {
        addMessage("体力不足，无法突破！", "warning");
        return;
    }

    const baseSuccessRate = 0.5;
    const spiritBonus = gameState.spiritualPower / 1000;
    const breakthroughBonus = gameState.breakthroughBonus || 0;
    const successRate = baseSuccessRate + spiritBonus + breakthroughBonus;

    if (Math.random() < successRate) {
        gameState.level += 1;
        gameState.cultivation = 0;
        gameState.energy -= 50;
        addMessage(`突破成功！当前境界：${getLevelName(gameState.level)}`, "success");
    } else {
        gameState.cultivation = Math.floor(gameState.cultivation * 0.8);
        gameState.energy -= 30;
        addMessage("突破失败，修为受损！", "warning");
    }
    updateDisplay();
}

// 随机事件系统
function triggerRandomEvent() {
    const events = [
        {
            name: "发现灵药",
            probability: 0.4,
            execute: () => {
                const gain = Math.floor(Math.random() * 50) + 50;
                gameState.spiritualPower += gain;
                addMessage(`发现灵药！灵力增加${gain}点`, "success");
            }
        },
        {
            name: "遇到修士",
            probability: 0.3,
            execute: () => {
                const gain = Math.floor(Math.random() * 30) + 20;
                gameState.cultivation += gain;
                addMessage(`遇到友善的修士指点，获得${gain}点修为`, "success");
            }
        },
        {
            name: "获得灵石",
            probability: 0.3,
            execute: () => {
                const gain = Math.floor(Math.random() * 10) + 5;
                gameState.money += gain;
                addMessage(`意外获得${gain}块灵石！`, "success");
            }
        }
    ];

    const totalProbability = events.reduce((sum, event) => sum + event.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (let event of events) {
        if (random < event.probability) {
            event.execute();
            break;
        }
        random -= event.probability;
    }
}

// 存档功能
function saveGame() {
    const saveData = {
        gameState: gameState,
        timestamp: new Date().toISOString(),
        version: "1.0"
    };

    try {
        localStorage.setItem('xiuxianGame', JSON.stringify(saveData));
        addMessage("游戏已保存！", "success");
    } catch (e) {
        addMessage("保存失败：" + e.message, "warning");
    }
}

// 读取存档
function loadGame() {
    try {
        const saveData = localStorage.getItem('xiuxianGame');
        if (!saveData) {
            addMessage("没有找到存档！", "warning");
            return;
        }

        const data = JSON.parse(saveData);
        Object.assign(gameState, data.gameState);
        addMessage(`读取存档成功！(存档时间: ${new Date(data.timestamp).toLocaleString()})`, "success");
        updateDisplay();
    } catch (e) {
        addMessage("读取存档失败：" + e.message, "warning");
    }
}

// 外出历练
function explore() {
    if (gameState.energy < 20) {
        addMessage("体力不足，需要至少20点体力！", "warning");
        return;
    }

    gameState.energy -= 20;
    
    const rewards = [
        { type: "灵石", chance: 0.4, min: 10, max: 50 },
        { type: "修为", chance: 0.3, min: 20, max: 100 },
        { type: "灵力", chance: 0.3, min: 15, max: 80 }
    ];

    let message = "外出历练：\n";
    rewards.forEach(reward => {
        if (Math.random() < reward.chance) {
            const amount = Math.floor(Math.random() * (reward.max - reward.min)) + reward.min;
            switch (reward.type) {
                case "灵石":
                    gameState.money += amount;
                    message += `获得${amount}块灵石！\n`;
                    break;
                case "修为":
                    gameState.cultivation += amount;
                    message += `获得${amount}点修为！\n`;
                    break;
                case "灵力":
                    gameState.spiritualPower += amount;
                    message += `获得${amount}点灵力！\n`;
                    break;
            }
        }
    });

    if (Math.random() < 0.3) {
        triggerRandomEvent();
    }

    addMessage(message);
    updateDisplay();
}

// 坊市相关函数
function generateMarketItems() {
    const items = [
        {
            name: "培元丹",
            cost: 50,
            effect: "恢复全部体力",
            description: "精心炼制的丹药，服用后立即恢复所有体力",
            rarity: "normal"
        },
        {
            name: "聚灵丹",
            cost: 100,
            effect: "增加50点灵力",
            description: "提升修炼者的灵力，效果显著",
            rarity: "rare"
        },
        {
            name: "筑基丹",
            cost: 200,
            effect: "增加100点修为",
            description: "大幅提升修炼速度，为突破境界打下基础",
            rarity: "epic"
        },
        {
            name: "渡劫丹",
            cost: 500,
            effect: "提升突破成功率20%",
            description: "降低突破失败的风险，为修士突破境界提供保障",
            rarity: "legendary"
        },
        {
            name: "五行灵果",
            cost: 300,
            effect: "随机增加属性",
            description: "蕴含五行之力的神奇果实，食用后随机提升一项属性",
            rarity: "epic"
        }
    ];

    return items.map(item => `
        <div class="market-item ${item.rarity}">
            <div class="item-name">${item.name}</div>
            <div class="item-cost">💎 ${item.cost} 灵石</div>
            <div class="item-effect">${item.effect}</div>
            <div class="item-description">${item.description}</div>
            <button class="purchase-btn" 
                    onclick="purchaseItem('${item.name}', ${item.cost})"
                    ${gameState.money < item.cost ? 'disabled' : ''}>
                购买
            </button>
        </div>
    `).join('');
}

// 游历坊市函数
function visitMarket() {
    if (gameState.energy < 10) {
        addMessage("体力不足，需要至少10点体力！", "warning");
        return;
    }

    gameState.energy -= 10;
    showMarketInterface();
}

// 显示坊市界面
function showMarketInterface() {
    const overlay = document.createElement('div');
    overlay.className = 'market-overlay';
    
    const marketDiv = document.createElement('div');
    marketDiv.className = 'market-interface';
    
    marketDiv.innerHTML = `
        <div class="market-header">
            <h3>修仙坊市</h3>
            <button class="market-close" onclick="closeMarket()">×</button>
        </div>
        <div class="market-info">
            <span>当前灵石：<span class="money-value">${gameState.money}</span></span>
        </div>
        <div class="market-items">
            ${generateMarketItems()}
        </div>
    `;
    
    overlay.appendChild(marketDiv);
    document.body.appendChild(overlay);
}

// 购买物品
function purchaseItem(itemName, cost) {
    if (gameState.money < cost) {
        addMessage(`灵石不足！需要${cost}灵石`, "warning");
        return;
    }

    gameState.money -= cost;
    
    switch(itemName) {
        case "培元丹":
            gameState.energy = gameState.maxEnergy;
            addMessage("使用培元丹，体力完全恢复！", "success");
            break;
        case "聚灵丹":
            gameState.spiritualPower += 50;
            addMessage("使用聚灵丹，灵力+50！", "success");
            break;
        case "筑基丹":
            gameState.cultivation += 100;
            addMessage("使用筑基丹，修为+100！", "success");
            break;
        case "渡劫丹":
            gameState.breakthroughBonus = (gameState.breakthroughBonus || 0) + 0.2;
            addMessage("使用渡劫丹，突破成功率提升20%！", "success");
            break;
        case "五行灵果":
            const randomBonus = Math.floor(Math.random() * 100) + 50;
            const attributes = ["灵力", "修为", "体力上限"];
            const randAttr = attributes[Math.floor(Math.random() * attributes.length)];
            applyAttributeBonus(randAttr, randomBonus);
            addMessage(`食用五行灵果，${randAttr}提升${randomBonus}点！`, "success");
            break;
    }

    updateDisplay();
    document.querySelector('.money-value').textContent = gameState.money;
    updatePurchaseButtons();
}

// 更新购买按钮状态
function updatePurchaseButtons() {
    document.querySelectorAll('.purchase-btn').forEach(button => {
        const cost = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        button.disabled = gameState.money < cost;
    });
}

// 关闭坊市
function closeMarket() {
    const overlay = document.querySelector('.market-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 属性加成函数
function applyAttributeBonus(attribute, amount) {
    switch(attribute) {
        case "灵力":
            gameState.spiritualPower += amount;
            break;
        case "修为":
            gameState.cultivation += amount;
            break;
        case "体力上限":
            gameState.maxEnergy += amount;
            gameState.energy = Math.min(gameState.energy + amount, gameState.maxEnergy);
            break;
    }
}

// 闭关修炼
function meditation() {
    if (gameState.energy < 50) {
        addMessage("体力不足，需要至少50点体力！", "warning");
        return;
    }

    const days = prompt("请输入闭关天数（每天消耗50点体力）：");
    const daysNum = parseInt(days);

    if (!daysNum || daysNum <= 0) {
        addMessage("输入无效！", "warning");
        return;
    }

    if (gameState.energy < daysNum * 50) {
        addMessage("体力不足以支撑这么长时间的闭关！", "warning");
        return;
    }

    const gainPerDay = 20 + gameState.level * 5;
    const totalGain = gainPerDay * daysNum;
    
    gameState.energy -= daysNum * 50;
    gameState.cultivation += totalGain;
    gameState.lifespan -= daysNum;

    addMessage(`闭关${daysNum}天，获得${totalGain}点修为！消耗${daysNum * 50}点体力`, "success");
    updateDisplay();
}

// 显示休息界面
function showRestInterface() {
    const overlay = document.createElement('div');
    overlay.className = 'rest-overlay';
    
    const restDiv = document.createElement('div');
    restDiv.className = 'rest-interface';
    
    const currentEnergy = gameState.energy;
    const maxEnergy = gameState.maxEnergy;
    const neededEnergy = maxEnergy - currentEnergy;
    const costPerEnergy = 0.2;
    
    restDiv.innerHTML = `
        <div class="rest-header">
            <h3>打坐休息</h3>
            <button class="rest-close" onclick="closeRest()">×</button>
        </div>
        
        <div class="energy-status">
            <div>当前体力状态</div>
            <div class="energy-bar-large">
                <div class="energy-fill" style="width: ${(currentEnergy/maxEnergy*100)}%"></div>
                <span class="energy-text">${currentEnergy} / ${maxEnergy}</span>
            </div>
            <div>当前灵石：${gameState.money}</div>
        </div>

        <div class="rest-options">
            <div class="rest-option" onclick="restoreEnergy('small')">
                <div class="option-header">小憩</div>
                <div class="option-effect">恢复30%体力</div>
                <div class="option-cost">消耗 ${Math.ceil(neededEnergy * 0.3 * costPerEnergy)} 灵石</div>
            </div>
            <div class="rest-option" onclick="restoreEnergy('medium')">
                <div class="option-header">打坐</div>
                <div class="option-effect">恢复60%体力</div>
                <div class="option-cost">消耗 ${Math.ceil(neededEnergy * 0.6 * costPerEnergy)} 灵石</div>
            </div>
            <div class="rest-option" onclick="restoreEnergy('full')">
                <div class="option-header">深度休息</div>
                <div class="option-effect">恢复全部体力</div>
                <div class="option-cost">消耗 ${Math.ceil(neededEnergy * costPerEnergy)} 灵石</div>
            </div>
        </div>

        <div class="rest-info">
            提示：休息时会持续吸收天地灵气，恢复体力的同时也能获得少量修为。
        </div>
    `;
    
    overlay.appendChild(restDiv);
    document.body.appendChild(overlay);
}

// 恢复体力
function restoreEnergy(type) {
    const currentEnergy = gameState.energy;
    const maxEnergy = gameState.maxEnergy;
    const neededEnergy = maxEnergy - currentEnergy;
    const costPerEnergy = 0.2;
    
    let recoveryPercent, recoveryAmount, cost;
    
    switch(type) {
        case 'small':
            recoveryPercent = 0.3;
            break;
        case 'medium':
            recoveryPercent = 0.6;
            break;
        case 'full':
            recoveryPercent = 1;
            break;
    }
    
    recoveryAmount = Math.ceil(neededEnergy * recoveryPercent);
    cost = Math.ceil(recoveryAmount * costPerEnergy);
    
    if (gameState.money < cost) {
        addMessage(`灵石不足！需要${cost}块灵石。`, "warning");
        return;
    }
    
    gameState.money -= cost;
    gameState.energy = Math.min(maxEnergy, currentEnergy + recoveryAmount);
    
    const cultivationGain = Math.floor(recoveryAmount * 0.1);
    gameState.cultivation += cultivationGain;
    
    addMessage(`休息完成！恢复${recoveryAmount}点体力，获得${cultivationGain}点修为，消耗${cost}块灵石。`, "success");
    updateDisplay();
    closeRest();
}

// 关闭休息界面
function closeRest() {
    const overlay = document.querySelector('.rest-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 自动体力恢复
setInterval(() => {
    if (gameState.energy < gameState.maxEnergy) {
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 1);
        updateDisplay();
    }
}, 30000);

// 初始化游戏
function initGame() {
    // 添加基础事件监听器
    document.getElementById('cultivateBtn').addEventListener('click', cultivate);
    document.getElementById('collectBtn').addEventListener('click', collectSpirit);
    document.getElementById('breakthroughBtn').addEventListener('click', breakthrough);
    
    // 添加高级操作事件监听
    document.getElementById('exploreBtn').addEventListener('click', explore);
    document.getElementById('marketBtn').addEventListener('click', visitMarket);
    document.getElementById('meditationBtn').addEventListener('click', meditation);

    // 添加存档相关的事件监听
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);

    // 添加休息按钮
    const restButton = document.createElement('button');
    restButton.id = 'restBtn';
    restButton.textContent = '休息恢复';
    restButton.addEventListener('click', showRestInterface);
    document.querySelector('.action-group').appendChild(restButton);
    
    // 初始化显示
    updateDisplay();
    addMessage("修仙之旅开始了！体力每30秒自动恢复1点");
}
function dailySignIn() {
    const lastSignIn = localStorage.getItem('lastSignIn');
    const today = new Date().toDateString();
    
    if (lastSignIn === today) {
        addMessage("今日已经签到过了！", "warning");
        return;
    }
    
    const bonus = Math.floor(Math.random() * 20) + 10; // 10-30灵石
    gameState.money += bonus;
    localStorage.setItem('lastSignIn', today);
    addMessage(`签到成功！获得${bonus}块灵石`, "success");
    updateDisplay();
}


// 等待页面加载完成后初始化游戏
window.onload = initGame;
