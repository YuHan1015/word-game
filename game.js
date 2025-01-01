function 随机事件() {
  const events = [
    {
      描述: "你在山林中发现了一株灵草，你要采摘吗？",
      选择: [
        { 描述: "采摘灵草", 后果: () => 采摘灵草() },
        { 描述: "离开这里", 后果: () => 输出信息("你选择离开，没有发生任何事情。") },
      ],
    },
    {
      描述: "一名神秘修士与你相遇，他愿意与你交易。",
      选择: [
        { 描述: "用10灵石换取一本修炼秘籍", 后果: () => 交易秘籍() },
        { 描述: "拒绝交易", 后果: () => 输出信息("你拒绝了交易，继续前行。") },
      ],
    },
    {
      描述: "你不小心闯入了一片妖兽巢穴！",
      选择: [
        { 描述: "试图逃跑", 后果: () => 妖兽逃跑() },
        { 描述: "与妖兽战斗", 后果: () => 与妖兽战斗() },
      ],
    },
  ];

  // 随机选择事件
  return events[Math.floor(Math.random() * events.length)];
}

// 处理复杂事件
function 外出历练() {
  const event = 随机事件();
  输出信息(`事件：${event.描述}`);
  if (event.选择) {
    显示选择(event.选择);
  }
}

// 显示选择
function 显示选择(choices) {
  const actions = document.getElementById("actions");
  actions.innerHTML = ""; // 清空按钮
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.描述;
    button.onclick = () => {
      actions.innerHTML = `<button onclick="恢复默认按钮()">返回操作</button>`;
      choice.后果();
    };
    actions.appendChild(button);
  });
}

// 恢复默认按钮
function 恢复默认按钮() {
  const actions = document.getElementById("actions");
  actions.innerHTML = `
    <button onclick="闭关修炼()">闭关修炼</button>
    <button onclick="外出历练()">外出历练</button>
    <button onclick="查看属性()">查看属性</button>
  `;
}

// 具体后果逻辑
function 采摘灵草() {
  const 成功 = Math.random() > 0.5;
  if (成功) {
    player.灵石 += 10;
    输出信息("你成功采摘了灵草，并出售换取了10灵石！");
  } else {
    输出信息("你尝试采摘灵草，但触发了机关，受了点伤。");
    player.经验 -= 5;
  }
  更新界面();
}

function 交易秘籍() {
  if (player.灵石 >= 10) {
    player.灵石 -= 10;
    输出信息("你用10灵石换取了一本修炼秘籍，悟性提升！");
    player.经验 += 20;
  } else {
    输出信息("你没有足够的灵石，交易失败。");
  }
  更新界面();
}

function 妖兽逃跑() {
  const 成功 = Math.random() > 0.3;
  if (成功) {
    输出信息("你成功逃离了妖兽巢穴！");
  } else {
    输出信息("你试图逃跑，但被妖兽攻击，损失了5灵石！");
    player.灵石 -= 5;
  }
  更新界面();
}

function 与妖兽战斗() {
  const 成功 = Math.random() > 0.5;
  if (成功) {
    输出信息("你击败了妖兽，获得了宝贵的经验！");
    player.经验 += 20;
  } else {
    输出信息("你与妖兽战斗失败，损失了一些灵石！");
    player.灵石 -= 10;
  }
  更新界面();
}
