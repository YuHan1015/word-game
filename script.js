const storyElement = document.getElementById("story");
const choicesElement = document.getElementById("choices");

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
    story: "你走进了森林，听到周围传来奇怪的声音。你会继续前进还是停下来观察？",
    choices: [
      { text: "继续前进", next: "deeper_forest" },
      { text: "停下来观察", next: "observe" },
    ],
  },
  home: {
    story: "你选择了返回家乡，冒险就此结束。",
    choices: [],
  },
  deeper_forest: {
    story: "你深入森林，发现了一座古老的遗迹！",
    choices: [],
  },
  observe: {
    story: "你停下来观察，发现了一只奇怪的小动物。",
    choices: [],
  },
};

// 更新游戏内容
function updateStory(scenario) {
  const scene = gameData[scenario];
  storyElement.textContent = scene.story;
  choicesElement.innerHTML = "";

  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => updateStory(choice.next);
    choicesElement.appendChild(button);
  });
}

// 初始化游戏
updateStory("start");
