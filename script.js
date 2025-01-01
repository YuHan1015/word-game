const storyElement = document.getElementById("story");
const choicesElement = document.getElementById("choices");
const itemsElement = document.getElementById("items");

// 玩家数据
const player = {
  inventory: [], // 存放物品
};

// 游戏数据
const gameData = {
  start: {
    story: "你站在一片森林的入口。前方有两条路：一条通向未知的冒险，另一条返回家乡。",
    choices: [
      { text: "进入森林", next: "forest" },
      { text: "返回家乡", next: "home" },
    ],
  },
  forest: {
    story: "你走进了森林，发现了一把锈迹斑斑的剑。你会捡起它吗？",
    choices: [
      { text: "捡起剑", next: "pick_sword" },
      { text: "继续前进", next: "deeper_forest" },
    ],
  },
  pick_sword: {
    story: "你捡起了锈迹斑斑的剑。这或许会有用。",
    action: () => addItem("锈迹斑斑的剑"),
    choices: [{ text: "继续前进", next: "deeper_forest" }],
  },
  deeper_forest: {
    story: "你遇到了一只凶猛的狼！",
    choices: [
      { text: "用剑战斗", next: "fight_wolf", condition: hasItem("锈迹斑斑的剑") },
      { text: "逃跑", next: "escape" },
    ],
  },
  fight_wolf: {
    story: "你用剑打败了狼！继续冒险吧。",
    choices: [{ text: "进入遗迹", next: "ruins" }],
  },
  escape: {
    story: "你逃跑了，但狼似乎在追踪你。",
    choices: [{ text: "继续跑", next: "forest_escape" }],
  },
  ruins: {
    story: "你来到了遗迹，发现了一颗闪闪发光的宝石。",
    choices: [{ text: "拿起宝石", next: "take_gem" }],
  },
  take_gem: {
    story: "你拿起了宝石，感受到一种神秘的力量。",
    action: () => addItem("神秘宝石"),
    choices: [{ text: "结束冒险", next: "end" }],
  },
  forest_escape: {
    story: "你成功逃离了森林，但冒险未完成。",
    choices: [{ text: "重新开始", next: "start" }],
  },
  home: {
    story: "你选择了返回家乡，冒险就此结束。",
    choices: [{ text: "重新开始", next: "start" }],
  },
  end: {
    story: "你完成了冒险，获得了神秘宝石！恭喜！",
    choices: [{ text: "重新开始", next: "start" }],
  },
};

// 添加物品到物品栏
function addItem(item) {
  if (!player.inventory.includes(item)) {
    player.inventory.push(item);
    updateInventory();
  }
}

// 检查是否拥有某物品
function hasItem(item) {
  return () => player.inventory.includes(item);
}

// 更新物品栏
function updateInventory() {
  itemsElement.innerHTML = "";
  player.inventory.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    itemsElement.appendChild(li);
  });
}

// 更新故事内容
function updateStory(scenario) {
  const scene = gameData[scenario];
  storyElement.textContent = scene.story;
  choicesElement.innerHTML = "";

  if (scene.action) scene.action();

  scene.choices.forEach((choice) => {
    if (choice.condition && !choice.condition()) return;

    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => updateStory(choice.next);
    choicesElement.appendChild(button);
  });
}

// 初始化游戏
updateStory("start");
